import { DeepPartial, getConnection, getRepository } from 'typeorm';
import { IUser } from './user.type';
import { User } from './User';

import { entityTypes } from '../../consts';

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
    const user = await this.updateAndGet(id, { isActive: true})
    console.log('activated user', user);
    return user
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
    const user = await this.updateAndGet(id, {avatarUrl})
    return user
  }

  async setHomepage(id: number, homepage: string) {
    return await this.updateAndGet(id, {homepage})
  }

  async delete(id: number) {
    await User.delete(id)
  }

  async isUserExists(id: number) {
    return !!(await this.findById(id))
  }

  async updateAndGet(id: number, fields: DeepPartial<User>) {
    const connection = getConnection();
  
    const updatedUser = await connection
      .createQueryBuilder()
      .update(User)
      .set(fields)
      .where('id = :id', { id })
      .returning('*')
      .execute();
  
    return updatedUser.raw[0]
  }
}

const userService = new UserService()
export default userService