import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

import { AppBaseEntity } from './alike-base-entity';
import { UserDeviceToken } from './user-device-token';

@Entity()
export class User extends AppBaseEntity {
  @PrimaryColumn()
  public id: string;

  @Column({ type: 'varchar', comment: '이메일' })
  public email: string;

  @OneToMany((type) => UserDeviceToken, token => token.user)
  public deviceTokens: UserDeviceToken[];
}