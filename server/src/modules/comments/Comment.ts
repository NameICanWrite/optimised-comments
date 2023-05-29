import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, getMetadataArgsStorage } from 'typeorm';
import { User } from '../users/User';
import { entityTypes } from '../../consts';


@Entity(entityTypes.COMMENTS)
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createdAt: Date

  @Column()
  text: string

  @ManyToOne(() => Comment, /*{ onDelete: 'CASCADE' }*/)
  parent: Comment;

  
  @OneToMany(() => Comment, comment => comment.parent, {cascade: true})
  replies: Comment[];

  @ManyToOne(() => User, (user: User) => user.comments,
  //  {eager: true}
   )
  user: User
}




