import Joi from "joi"
import { entityTypes } from "../../consts"
import dotenv from 'dotenv'
dotenv.config()

const validTagsRegex = /<(a|code|i|strong)(\s+\w+="[^"]*")*>.*<\/\1>|^[^<>]+$/;
const validPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/ //minimum 1 character and 1 number

const validationSchemas = {
  [entityTypes.COMMENTS]: process.env.IS_CAPTCHA_ON ? Joi.object({
      captchaText: Joi.string().trim().required(),
      captchaId: Joi.number().required(),
      text: Joi.string().trim().regex(validTagsRegex, 'Invalid html tags detected').required(),
      parentId: Joi.number(),
  }) : Joi.object({
    text: Joi.string().trim().regex(validTagsRegex).required(),
    parentId: Joi.number(),
  }),
  signup: Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(8).regex(validPasswordRegex).required().messages({
      'string.min': 'pass too weak: minimum 8 symbols', 
      'string.pattern.base': 'pass too weak: minimum of 1 character and 1 number'}),
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
