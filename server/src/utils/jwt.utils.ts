import { Response, Request, CookieOptions } from 'express'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'


const jwtCookieOptions: CookieOptions = {
  httpOnly: true,
}
if (process.env.NODE_ENV === 'production') {
  jwtCookieOptions.secure = true
  jwtCookieOptions.sameSite = 'none'
  jwtCookieOptions.domain = process.env.ROOT_DOMAIN
  jwtCookieOptions.path = '/'
}


export const addJwtCookie = (res: Response, payload: any) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRES_IN
  })

  const expires = new Date(Date.now() + parseInt(process.env.JWT_COOKIES_EXPIRES_IN) * 24 * 3600 * 1000)
  res.cookie('jwt', token, {...jwtCookieOptions, expires});
  console.log('added cookie');
  console.log({...jwtCookieOptions, expires});
  console.log('token', token);
  return token
}


export const removeJwtCookie = (res: Response) => {

  res.clearCookie('jwt', jwtCookieOptions)
}