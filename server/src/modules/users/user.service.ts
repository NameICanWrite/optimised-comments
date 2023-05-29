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
    return await User.save({id, isActive: true})
  }

  async findById(id: number) {
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

  async setAvatar(id: number, avatarUrl: string) {
    return await User.save({id, avatarUrl})
  }

  async setHomepage(id: number, homepage: string) {
    return await User.save({id, homepage})
  }

  async delete(id: number) {
    await User.delete(id)
  }

  async isUserExists(id: number) {
    return !!(await this.findById(id))
  }
}

const userService = new UserService()
export default userService