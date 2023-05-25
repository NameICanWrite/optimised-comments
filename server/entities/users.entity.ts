import { Column, Entity, OneToMany } from 'typeorm';

import { CommonFields } from './commons-fields.entity';
import { MainComments } from './main.comments.entity';
import { Comments } from './comments.entity';

@Entity()
export class Users extends CommonFields {
    @Column({
        name: 'userName',
        type: 'varchar',
        width: 255,
        nullable: false,
    })
    userName: string;

    @Column({
        name: 'email',
        type: 'varchar',
        unique: true,
        width: 255,
        nullable: false,
    })
    email: string;

    @Column({
        name: 'password',
        type: 'varchar',
        width: 255,
        nullable: false,
    })
    password: string;

    @Column({
        name: 'avatar',
        type: 'varchar',
        width: 255,
        nullable: true,
        default: null,
    })
    avatar?: string;

    @OneToMany(() => Comments, (comments) => comments.user)
    comments: Comments[];

    @OneToMany(() => MainComments, (mainComments) => mainComments.user)
    mainComments: MainComments[];
}
