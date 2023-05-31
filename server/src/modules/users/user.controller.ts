import e, {Response, Request, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import { User } from './User';
import userService from './user.service';
import bcrypt from 'bcrypt'
import { BACKEND_PAGES, FRONTEND_PAGES } from '../../consts';
import { sendMail } from '../../config/mailer';
import crypto from 'crypto'
import dotenv from 'dotenv'
import { UploadedFile } from 'express-fileupload';
import sharp from 'sharp';
import { deleteAvatarFromFirebase, uploadAvatarToFirebase } from '../../utils/firebase';
import Joi from 'joi';
import redisClient from '../../config/redis';
import { addJwtCookie, removeJwtCookie } from '../../utils/jwt.utils';
import TryCatch from '../../utils/try-catch.decorator';
import { emailQueue } from './email.queue';
import { scanAndDelete } from '../../utils/redis/scanAndDelete';
import fsPromises from 'fs/promises'
import { resizeIfNecessary } from '../../utils/resizeImage';

dotenv.config()

@TryCatch
export class UserController {
  constructor() {}



  async login(req: Request<any, any, { email: string, password: string }>, res: Response, next: NextFunction) {
    let { email, password } = req.body;

    email = email.toLowerCase()

    const user = await userService.findByEmail(email);
    if (!user) {
      res.status(401)
      return 'User doesnt exist' 
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      res.status(401)
      return 'Password incorrect' 
    }
    if (!user.isActive) {
      res.status(401)
      return 'Visit your email and activate user (user is inactive)' 
    }

    await redisClient.setEx(`user:${user.id}`, 3600, JSON.stringify(user))

    addJwtCookie(res, {userId: user.id})
    return {...user, password: undefined}
  }


  async redirectIfUserExists(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return res.redirect(FRONTEND_PAGES.TOKEN_CONFIRMATION_FAILURE)
    }
    addJwtCookie(res, {userId: req.user.id})
    return res.redirect(`${process.env.CLIENT_ROOT_URL}`)
  }


  async signUpAndSendActivationEmail(req: Request, res: Response, next: NextFunction) {
    let { email, password, name } = req.body

    email = email.toLowerCase()
    name = name.toLowerCase()

    let existingUserWithEmail = await userService.findByEmail(email);
    if (existingUserWithEmail) {
      if (existingUserWithEmail.isActive) {
        res.status(400)
        return 'User email already exists'
      } else {
        await userService.delete(existingUserWithEmail.id)
      }
    }

    let existingUserWithName = await userService.findByEmail(name);
    if (existingUserWithName) {
      if (existingUserWithName.isActive) {
        res.status(400)
        return 'User name already exists'
      } else {
        await userService.delete(existingUserWithName.id)
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await userService.create({email, password: hashedPassword, name, isActive: false})

    const token = jwt.sign({ userId: createdUser.id }, process.env.JWT_SECRET)
    const link = `${BACKEND_PAGES.CONFIRM_SIGNUP}/${token}`

    await emailQueue.add('sendActivationEmail', {email, link},
      { attempts: 5, backoff: { type: 'fixed', delay: 1000 } }
      );
      console.log('added to queue');
    return 'Confirmation email sent'
  }

  async logout(req: Request, res: Response) {
    redisClient.del(`user:${req.user?.id}`)
    removeJwtCookie(res)
    res.send()
  }


  async getCurrentUser(req: Request, res: Response) {
    return { ...req.user, password: undefined, }
  }


  async getCurrentUserComments(req: Request, res: Response) {
    return req.user?.comments || []
  }


  async setAvatar(req: Request, res: Response) {
    if (!req.user) throw new Error()

    const {avatar} = req.files as {avatar: UploadedFile}
    //validate avatar
    if (!avatar) {
      res.status(400)
      return 'Avatar is required'
    }
    const allowedAvatarExtensions = ['gif', 'jpg', 'png', 'jpeg']
    const avatarExtension = avatar.mimetype.split('/')[1]
    if (!allowedAvatarExtensions.includes(avatarExtension)){
      res.status(400)
      return 'Only gif, jpg, png extensions accepted. Wrong extension.'
    }
    // Resize the image if necessary

    await resizeIfNecessary(avatar, avatarExtension === 'gif')


    //save image
    await deleteAvatarFromFirebase(req.user.id)
    const url = await uploadAvatarToFirebase(avatar, req.user.id)
    const user = await userService.setAvatar(req.user.id, url)

    await redisClient.setEx(`user:${req.user.id}`, 3600, JSON.stringify(user))
    await scanAndDelete('comments:*')

    return {url, message: 'Avatar has been changed'}
  }


  async setHomepage(req: Request<any, any, { homepage: string }>, res: Response) {
    if (!req.user) throw new Error()

    const { homepage } = req.body
    await Joi.string().uri().required().validateAsync(homepage)
    const user = await userService.setHomepage(req.user?.id, homepage)
    await redisClient.setEx(`user:${req.user?.id}`, 3600, JSON.stringify(user))
    return 'Homepage changed successfully'
  }
}

export const userController = new UserController()