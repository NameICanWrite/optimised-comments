
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from '../comments/Comment';

import { entityTypes } from '../../consts';

@Entity(entityTypes.USER)
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string

  @Column({nullable: true})
  avatarUrl: string;

  @Column({nullable: true})
  homepage: string

  @Column()
  password: string;

  @Column()
  isActive: boolean;

  @Column({default: '0'})
  passwordResetCode: string

  @Column({default: '0'})
  passwordResetCodeExpiresAt: string

  @OneToMany(() => Comment, (comment: Comment) => comment.user)
  comments: Array<Comment>;
}
