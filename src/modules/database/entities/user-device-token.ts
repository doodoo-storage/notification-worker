import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AppBaseEntity } from './alike-base-entity';

import { User } from './user';

@Entity()
export class UserDeviceToken extends AppBaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ comment: 'token' })
  public token: string;

  @Column({ comment: 'user id' })
  public userId: string;

  @ManyToOne((type) => User, user => user.deviceTokens, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  public user: User;
}