"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        return await User_1.User.save({ id, isActive: true });
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
        return await User_1.User.save({ id, avatarUrl });
    }
    async setHomepage(id, homepage) {
        return await User_1.User.save({ id, homepage });
    }
    async delete(id) {
        await User_1.User.delete(id);
    }
    async isUserExists(id) {
        return !!(await this.findById(id));
    }
}
const userService = new UserService();
exports.default = userService;
//# sourceMappingURL=user.service.js.map