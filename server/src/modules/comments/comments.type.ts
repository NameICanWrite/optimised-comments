// TODO: Put a real interfaces here

import { User } from "../users/User"
import { IUser } from "../users/user.type"
import { DeepPartial } from "typeorm"
import {Request} from 'express'

export interface IComment {
  id?: number
  text?: string
  userId?: number
  parent?: IComment
  replies?: IComment[]
  user?: IUser | User
}

export type AllCommentsReq= Request & {
    user: User,
    query: {
        page: string,
        limit: string,
        sortField: string,
        isSortAscending: string,
    }
}