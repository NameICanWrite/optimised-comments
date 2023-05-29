import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import TryCatch from '../../utils/try-catch.decorator';
import userService from './user.service';
import { User } from './User';
import dotenv from 'dotenv'
import redisClient from '../../config/redis';

dotenv.config()


const extractorFromTokenParam = (req: Request) => {
  let token = null;
  if (req && req.params.token) {
      token = req.params.token;
  }
    return token;
}

const extractorFromCookie = (req: Request) => {
  let token = null 
  if (req && req.cookies) {
      token = req.cookies['jwt']
  } 
  return token
}

export const passportOptionsLogin = {
  jwtFromRequest: ExtractJwt.fromExtractors([extractorFromCookie, extractorFromTokenParam]),
  secretOrKey: process.env.JWT_SECRET
};


export const passportJwtStrategyLoginWithActivation = new JwtStrategy(passportOptionsLogin, async ({userId}: {userId: number}, done: VerifiedCallback) => {

  try {
      let user
      let cachedUser = await redisClient.get(`user:${userId}`)
      if (cachedUser) {
        user = JSON.parse(cachedUser) as User
        console.log('cachedUser', user);
      } else {
        user = await userService.findById(userId);
      }
      if (!user?.isActive) user = await userService.activate(userId)
      if (!cachedUser) await redisClient.setEx(`user:${userId}`, 3600, JSON.stringify(user))
  if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
})



passport.use('jwt-login-with-activation', passportJwtStrategyLoginWithActivation);
// passport.use('jwt-signup', passportJwtStrategySignup)


export const authAndGetUser = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  let errMessage
  await new Promise((resolve, reject) => passport.authenticate('jwt-login-with-activation', { session: false }, (err: any, user: User) => {
    if (err || !user) {
      res.status(401)
      errMessage = 'You should login first!'
      console.log('Auth rejected');
      return resolve(1)
    }
    req.user = user
    return resolve(1)
  })(req, res, next))

  return errMessage || next()
})


// export function AddAuthToken(callback: any): (req: Request, res: Response, next: NextFunction) => Promise<string> {
//   return TryCatch(
//     async function (req: Request, res: Response, next: NextFunction) {
//       const { resBody, tokenPayload } = await callback(req, res, next)
//       if (tokenPayload) {
//         addJwtCookie(res, tokenPayload)
//       }
//       return resBody
//     }
//   )
// }
