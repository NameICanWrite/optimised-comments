"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
class UserService {
    async findAll() {
        const users = await User_1.User.find();
        return users;
    }
    async create({ email, password, name, isActive }) {
        const saved = await User_1.User.save({ email, password, name, isActive });
        return saved;
    }
    async activate(id) {
        const user = await this.updateAndGet(id, { isActive: true });
        console.log('activated user', user);
        return user;
    }
    async findById(id) {
        const user = await User_1.User.findOne({ where: { id }, relations: ['comments'] });
        return user;
    }
    async findByEmail(email) {
        const user = await User_1.User.findOne({ where: { email }, relations: ['comments'] });
        return user;
    }
    async findByName(name) {
        const user = await User_1.User.findOne({ where: { name }, relations: ['comments'] });
        return user;
    }
    async setAvatar(id, avatarUrl) {
        const user = await this.updateAndGet(id, { avatarUrl });
        return user;
    }
    async setHomepage(id, homepage) {
        return await this.updateAndGet(id, { homepage });
    }
    async delete(id) {
        await User_1.User.delete(id);
    }
    async isUserExists(id) {
        return !!(await this.findById(id));
    }
    async updateAndGet(id, fields) {
        const connection = (0, typeorm_1.getConnection)();
        const updatedUser = await connection
            .createQueryBuilder()
            .update(User_1.User)
            .set(fields)
            .where('id = :id', { id })
            .returning('*')
            .execute();
        return updatedUser.raw[0];
    }
}
const userService = new UserService();
exports.default = userService;
//# sourceMappingURL=user.service.js.map