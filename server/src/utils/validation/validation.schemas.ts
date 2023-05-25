import Joi from "joi"
import UserService from "../../modules/users/user.service"
import { entityTypes } from "../../consts"

const validationSchemas = {
  [entityTypes.COMMENTS]: Joi.object({
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
