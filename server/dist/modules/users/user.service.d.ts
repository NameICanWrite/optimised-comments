import { DeepPartial } from 'typeorm';
import { User } from './User';
declare class UserService {
    findAll(): Promise<User[]>;
    create({ email, password, name, isActive }: {
        email: string;
        password: string;
        name: string;
        isActive: boolean;
    }): Promise<User>;
    activate(id: number): Promise<any>;
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByName(name: string): Promise<User | null>;
    setAvatar(id: number, avatarUrl: string): Promise<any>;
    setHomepage(id: number, homepage: string): Promise<any>;
    delete(id: number): Promise<void>;
    isUserExists(id: number): Promise<boolean>;
    updateAndGet(id: number, fields: DeepPartial<User>): Promise<any>;
}
declare const userService: UserService;
export default userService;
