import {IComment} from './comments.type'
import e, {Response, Request, NextFunction} from 'express'
import commentService from './comments.service'
import TryCatch from '../../utils/try-catch.decorator'
import Joi from 'joi'
import {Comment} from './Comment'
import {User} from '../users/User'
import WebSocket from 'ws'
import redisClient from '../../config/redis'
import {scanAndDelete} from '../../utils/redis/scanAndDelete'
import {DeepPartial} from 'typeorm'
import {AllCommentsReq} from './comments.type'


// @TryCatch
export class CommentController {
    constructor() {}

    async getAllComments(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const commentReq = req as AllCommentsReq
        let {page, limit, sortField, isSortAscending} = commentReq.query

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

    async createComment(req: Request<{ id: string }, any, { parentId: number, text: string }> & { user: User }) {
        const {parentId, text} = req.body
        const newComment = await commentService.create({
            text,
            parent: parentId ? {id: parentId} : undefined
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



