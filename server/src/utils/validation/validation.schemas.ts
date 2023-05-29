import Joi from "joi"
import { entityTypes } from "../../consts"
import dotenv from 'dotenv'
dotenv.config()

const validationSchemas = {
  [entityTypes.COMMENTS]: process.env.IS_CAPTCHA_ON ? Joi.object({
      captchaText: Joi.string().trim().required(),
      captchaId: Joi.number().required(),
      text: Joi.string().trim().required(),
      parentId: Joi.number(),
  }) : Joi.object({
    text: Joi.string().trim().required(),
    parentId: Joi.number(),
  }),
  signup: Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required()
  }).options({ allowUnknown: true }),
  login: Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required()
  }),
  withEmail: Joi.object({
    email: Joi.string().trim().email().required()
  }),
  resetPassword: Joi.object({
    code: Joi.string().trim().length(4).required(),
    email: Joi.string().trim().email().required(),
    newPassword: Joi.string().required()
  }).options({ allowUnknown: true })
}

export default validationSchemas
