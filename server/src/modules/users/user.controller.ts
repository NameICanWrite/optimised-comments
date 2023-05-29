import { Request, Response, NextFunction } from 'express';
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

dotenv.config()

@TryCatch
export class UserController {
  constructor() { }



  async login(req: Request<any, any, { email: string, password: string }>, res: Response, next: NextFunction) {
    const { email, password } = req.body;
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


  async redirectIfUserExists(req: Request & {user: User}, res: Response, next: NextFunction) {
    if (!req.user) {
      return res.redirect(FRONTEND_PAGES.TOKEN_CONFIRMATION_FAILURE)
    }
    addJwtCookie(res, {userId: req.user.id})
    return res.redirect(`${process.env.CLIENT_ROOT_URL}`)
  }


  async signUpAndSendActivationEmail(req: Request, res: Response, next: NextFunction) {
    const { email, password, name } = req.body

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
    return 'Confirmation email sent'
  }

  async logout(req: Request & {user: User}, res: Response) {
    redisClient.del(`user:${req.user.id}`)
    removeJwtCookie(res)
    res.send()
  }


  async getCurrentUser(req: Request & { user: User }, res: Response) {
    return { ...req.user, password: undefined, }
  }


  async getCurrentUserComments(req: Request & { user: User }, res: Response) {
    return (req.user as User)?.comments || []
  }


  async setAvatar(req: Request<any, any, any> & { user: User, files: {avatar: UploadedFile} }, res: Response) {
    const {avatar} = req.files
    //validate avatar
    if (!avatar) {
      res.status(400)
      return 'Avatar is required'
    }
    const allowedAvatarExtensions = ['gif', 'jpg', 'png', 'jpeg']
    const avatarExtension = avatar.mimetype.split('/')[1]
    console.log(avatarExtension);
    if (!allowedAvatarExtensions.includes(avatarExtension)){
      res.status(400)
      return 'Only gif, jpg, png extensions accepted. Wrong extension.'
    }
    // Resize the image if necessary
    const image = sharp(avatar.tempFilePath, {animated: avatarExtension === 'gif'});
    const metadata = await image.metadata();

    if (metadata.width && metadata.height && (metadata.width > 320 || metadata.height > 240)) {
      const resizedImage = await image.resize(320, 240).toBuffer();
      avatar.data = resizedImage
    }
    //save image
    await deleteAvatarFromFirebase(req.user.id)
    const url = await uploadAvatarToFirebase(avatar, req.user.id)
    const user = await userService.setAvatar(req.user.id, url)

    await redisClient.setEx(`user:${req.user.id}`, 3600, JSON.stringify(user))
    await scanAndDelete('comments:*')

    return {url, message: 'Avatar has been changed'}
  }


  async setHomepage(req: Request<any, any, { homepage: string }> & { user: User }, res: Response) {
    const { homepage } = req.body
    await Joi.string().uri().required().validateAsync(homepage)
    const user = await userService.setHomepage(req.user.id, homepage)
    await redisClient.setEx(`user:${req.user.id}`, 3600, JSON.stringify(user))
    return 'Homepage changed successfully'
  }
}

export const userController = new UserController()