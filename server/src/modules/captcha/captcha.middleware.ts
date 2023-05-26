import { NextFunction, Request, Response } from "express";
import { Captcha } from "./Captcha";
import TryCatch from "../../utils/try-catch.decorator";

export const isCaptchaSolved = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
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