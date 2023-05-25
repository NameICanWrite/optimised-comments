import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { User } from './User';
import userService from './user.service';
import bcrypt from 'bcrypt'
import TryCatch from '../../utils/try-catch.decorator';
import { AddAuthToken, addJwtHeader } from './auth.middleware';
import { BACKEND_PAGES, FRONTEND_PAGES } from '../../consts';
import { sendMail } from '../../config/mailer';
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()


export class UserController {
  constructor() { }


  async signup(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      res.status(400)
      return { resBody: 'User email already exists' }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userService.create({ email, password: hashedPassword })

    return { resBody: 'Signed up successfully!', tokenPayload: { userId: newUser.id } }
  }

  async login(req: Request<any, any, { email: string, password: string }>, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const user = await userService.findByEmail(email);
    if (!user) {
      res.status(401)
      return { resBody: 'User doesnt exist' }
    }
    console.log(password);
    console.log(user.password);
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      res.status(401)
      return { resBody: 'Password incorrect' }
    }
    if (!user.isActive) {
      res.status(401)
      return { resBody: 'Visit your email and activate user (user is inactive)' }
    }
    return { resBody: user, tokenPayload: { userId: user.id } }
  }

  async activateUserAndRedirectToFrontend(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return res.redirect(FRONTEND_PAGES.TOKEN_CONFIRMATION_FAILURE)
    }
    await userService.activate(req.user.id)
    return res.redirect(`${process.env.CLIENT_ROOT_URL}`)
  }

  async signUpAndSendActivationEmail(req: Request, res: Response, next: NextFunction) {
    const { email, password, name } = req.body

    let existingUserWithEmail = await userService.findByEmail(email);
    if (existingUserWithEmail) {
      if (existingUserWithEmail.isActive) {
        res.status(400)
        return { resBody: 'User email already exists'}
      } else {
        await userService.delete(existingUserWithEmail.id)
      }
    }

    let existingUserWithName = await userService.findByEmail(name);
    if (existingUserWithName) {
      if (existingUserWithName.isActive) {
        res.status(400)
        return { resBody: 'User name already exists'}
      } else {
        await userService.delete(existingUserWithName.id)
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await userService.create({email, password: hashedPassword, name, isActive: false})

    const token = jwt.sign({ userId: createdUser.id }, process.env.JWT_SECRET)
    const link = `${BACKEND_PAGES.CONFIRM_SIGNUP}/${token}`
    await sendMail({
      subject: 'Comment App Signup Confirmation',
      email,
      html: `
    <p>Follow this link to signup</p>
    <a href="${link}">${link}</a>
    `,
      text: ''
    })
    return 'Confirmation email sent'
  }

  async sendResetPasswordCodeEmail(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body
    const existingUser = await userService.findByEmail(email);
    if (!existingUser) {
      res.status(400)
      return { resBody: 'User doesnt exist' }
    }
    let newCode = ''
    for (let i = 0; i < 4; i++) newCode += crypto.randomInt(0, 9).toString()
    await userService.addPasswordResetCode(email, newCode)
    await sendMail({
      subject: 'Comment App Signup Confirmation',
      email,
      html: `
    <p>Enter this code to reset password. It is valid during 10 minutes</p>
    <p>${newCode}</p>
    `,
      text: ''
    })
    return 'Email with code sent'
  }

  async resetPasswordWithCode(req: Request<any, any, { email: string, code: string, newPassword: string }>, res: Response, next: NextFunction) {
    const { email, code, newPassword } = req.body

    const existingUser = await userService.findByEmail(email);
    if (!existingUser) {
      res.status(400)
      return 'User doesnt exist'
    }
    const { passwordResetCode, passwordResetCodeExpiresAt } = existingUser
    if (!(passwordResetCode == code || parseInt(passwordResetCodeExpiresAt) < Date.now())) {
      res.status(400)
      return 'Code invalid or has expired'
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    await userService.changePassword((existingUser as User).id, hashedNewPassword)

    return 'Password changed successfully!'
  }


  async getCurrentUser(req: Request & { user: User }, res: Response) {
    const user = { ...req.user, password: undefined, passwordResetCode: undefined, passwordResetCodeExpiresAt: undefined }
    return user
  }

  async getCurrentUserComments(req: Request & { user: User }, res: Response) {
    return (req.user as User)?.comments || []
  }

  async changePasswordSecure(req: Request<any, any, { oldPassword: string, newPassword: string }> & { user: User }, res: Response) {
    const { oldPassword, newPassword } = req.body
    const isPasswordCorrect = await bcrypt.compare(oldPassword, (req.user as User)?.password)
    if (!isPasswordCorrect) return 'Old password incorrect'

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    await userService.changePassword((req.user as User).id, hashedNewPassword)
    return 'Password changed successfully'
  }

  async changePassword(req: Request<any, any, { newPassword: string }> & { user: User }, res: Response) {
    const { newPassword } = req.body
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    await userService.changePassword((req.user as User).id, hashedNewPassword)
    return 'Password changed successfully'
  }

}

export const userController = new UserController()