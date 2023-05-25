import { User } from './User';
declare class UserService {
    findAll(): Promise<User[]>;
    create({ email, password, name, isActive }: {
        email: string;
        password: string;
        name: string;
        isActive: boolean;
    }): Promise<User>;
    activate(id: number): Promise<void>;
    changePassword(id: string, password: string): Promise<import("typeorm").UpdateResult>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByName(name: string): Promise<User | null>;
    addPasswordResetCode(email: string, code: string): Promise<void>;
    delete(id: string): Promise<void>;
    isUserExists(id: string): Promise<boolean>;
}
declare const userService: UserService;
export default userService;
