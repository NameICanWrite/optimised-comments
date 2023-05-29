import { NextFunction, Request, Response } from "express";
import { Captcha } from "./Captcha";
import TryCatch from "../../utils/try-catch.decorator";
import dotenv from 'dotenv'
dotenv.config()

export const isCaptchaSolved = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.IS_CAPTCHA_ON) {
    return next()
  }

  const {captchaId, captchaText} = req.body
  const solution = await Captcha.findOne({where: {id: captchaId}})

  if (solution && captchaText === solution.text) {
    await Captcha.delete(captchaId)
    next()
  } else {
    res.status(400)
    return 'Captcha is invalid'
  }
})