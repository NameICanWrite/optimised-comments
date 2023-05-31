import { Response, Request, NextFunction } from 'express'
import commentService from './comments.service'
import TryCatch from '../../utils/try-catch.decorator'
import { User } from '../users/User'
import WebSocket from 'ws'
import redisClient from '../../config/redis'
import { scanAndDelete } from '../../utils/redis/scanAndDelete'
import { AllCommentsReq, IComment } from './comments.type'
import { UploadedFile } from 'express-fileupload'
import { uploadCommentFileToFirebase } from '../../utils/firebase'
import { resizeIfNecessary } from '../../utils/resizeImage'


@TryCatch
export class CommentController {
    constructor() { }

    async getAllComments(
        req: Request
    ) {
        const commentReq = req as AllCommentsReq
        let { page, limit, sortField, isSortAscending } = commentReq.query

        const allowedSortFields = [
            'user.name',
            'user.email',
            'comment.createdAt',
        ]
        const pageInt = page ? parseInt(page) : 1
        const limitInt = limit ? parseInt(limit) : 100000
        sortField = allowedSortFields.includes(sortField) ? sortField : 'comment.createdAt'
        const isSortAscendingBool = isSortAscending === 'true'

        const cacheKey = `comments:page=${pageInt}` +
            `&limit=${limitInt}` +
            `&isSortAscending=${isSortAscendingBool}` +
            `&${sortField}`

        const cachedComments = await redisClient.get(cacheKey)

        if (cachedComments) {
            return JSON.parse(cachedComments)
        }

        const comments = await commentService.findAll({
            page: pageInt,
            limit: limitInt,
            sortField,
            isSortAscending: isSortAscendingBool,
        })

        await redisClient.setEx(cacheKey, 3600, JSON.stringify(comments))

        return comments
    }

    async createComment(req: Request<{ id: string }, any, { parentId: string, text: string }>, res: Response) {
        if (!req.user) throw new Error()

        const { parentId: parentIdString, text } = req.body
        const parentId = parseInt(parentIdString)
        let commentFiles:  Array<UploadedFile & {type?: string, url?: string} | {type?: string, url?: string}> = []

        if (req.files) {
            const allowedMimetypes = ['text/plain', 'image/gif', 'image/jpeg', 'image/png']
            const maxTextFileSize = 100 * 1000
            const maxFileNumber = 2

            for (let i in req.files) {
                if (commentFiles.length > maxFileNumber) break

                const file = req.files[i] as UploadedFile
                if (!allowedMimetypes.includes(file.mimetype)) {
                    res.status(400)
                    return 'Wrong file type!'
                }
                if (file.mimetype === 'text/plain' && file.size > maxTextFileSize) {
                    res.status(400)
                    return 'Text file too large!'
                }
                
                commentFiles.push({
                    type: file.mimetype.split('/')[0],
                    ...file
                })
            }

            commentFiles = await Promise.all(commentFiles.map(file => new Promise<{type?: string, url?: string}>(async (resolve) => {
                if (file.type !== 'text') {
                    await resizeIfNecessary(file as UploadedFile, (file as UploadedFile).mimetype === 'image/gif')
                }
                const url = await uploadCommentFileToFirebase(file as UploadedFile)
                return resolve({type: file.type, url})
            })))
        }

        const newComment = await commentService.create({
            text,
            files: commentFiles as Array<{type: string, url: string}>,
            parent: parentId ? { id: parentId } : undefined
        }, req.user as User)
        delete newComment.user?.password
        newComment.replies = []
        if (!req.user.comments) req.user.comments = []

        scanAndDelete('comments:*')

        newComment.user = {
            avatarUrl: req.user.avatarUrl,
            name: req.user.name,
            id: req.user.id,
            email: req.user.email
        }

        req.user.comments.push(newComment)
        await redisClient.setEx(`user:${req.user.id}`, 3600, JSON.stringify(req.user))

        // Emit a WebSocket event to notify clients about the new comment
        const message = JSON.stringify({
            event: 'newComment',
            data: newComment,
        })

        const wsClients = req.app.get('wsClients')

        wsClients.forEach((client: WebSocket) => {
            console.log('sending socket message...')
            client.send(message)
        })
        return newComment
    }

}

const commentController = new CommentController()
export default commentController



