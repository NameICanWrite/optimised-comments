import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, getMetadataArgsStorage } from 'typeorm';
import { User } from '../users/User';
import { entityTypes } from '../../consts';
import { number } from 'joi';


@Entity(entityTypes.COMMENTS)
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({default: () => `TO_TIMESTAMP('${new Date().toISOString()}', 'YYYY-MM-DD"T"HH24:MI:SS.MSZ')`})
  createdAt: string

  @Column()
  text: string

  @ManyToOne(() => Comment, /*{ onDelete: 'CASCADE' }*/)
  parent: Comment;

  @OneToMany(() => Comment, comment => comment.parent)
  replies: Comment[];

  @ManyToOne(() => User, (user: User) => user.comments)
  user: User
}




