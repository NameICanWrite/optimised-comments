import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CommonFields } from './commons-fields.entity';
import { Users } from './users.entity';
import { MainComments } from './main.comments.entity';

@Entity()
export class Comments extends CommonFields {
    @Column({
        width: 8000,
    })
    text: string;

    @Column()
    userId: string;

    @Column()
    mainCommentId: number;

    @Column({
        name: 'fileImg',
        type: 'varchar',
        width: 255,
        nullable: true,
        default: null,
        unique: true,
    })
    fileImg?: string;

    @ManyToOne(() => Users, (users) => users.comments)
    @JoinColumn({ name: 'userId' })
    user: Users;

    @ManyToOne(() => MainComments, (mainComments) => mainComments.comments)
    @JoinColumn({ name: 'mainCommentId' })
    mainComments: MainComments;
}
