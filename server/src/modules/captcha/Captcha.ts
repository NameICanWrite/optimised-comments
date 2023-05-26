
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { entityTypes } from '../../consts';

@Entity(entityTypes.CAPTCHA)
export class Captcha extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string
}
