import { IUser } from './user.type';
import { User } from './User';

import { entityTypes } from '../../consts';
import { DeepPartial } from 'typeorm';

class UserService {
  async findAll() {
    const users = await User.find()
    return users;
  }

  async create({email, password, name, isActive}: {email: string, password: string, name: string, isActive: boolean}) {
    const saved = await User.save({email, password, name, isActive} as DeepPartial<User>)
    return saved
  }

  async activate(id: number) {
    await User.update(id, {isActive: true})
  }

  async changePassword(id: string, password: string) {
    const user = await User.update(id, {password, passwordResetCode: '0', passwordResetCodeExpiresAt: '0'})
    return user
  }

  async findById(id: string) {
    const user = await User.findOne({where: {id}, relations: ['comments']})
    return user
  }

  async findByEmail(email: string) {
    const user = await User.findOne({where: {email}, relations: ['comments']})
    return user
  }
  async findByName(name: string) {
    const user = await User.findOne({where: {name}, relations: ['comments']})
    return user
  }
  async addPasswordResetCode(email: string, code: string) {
    await User.update({email}, {passwordResetCode: code, passwordResetCodeExpiresAt: (Date.now() + 60 * 1000 * 10).toString()})
  }

  async delete(id: string) {
    await User.delete(id)
  }

  async isUserExists(id: string) {
    return !!(await this.findById(id))
  }
}

const userService = new UserService()
export default userService