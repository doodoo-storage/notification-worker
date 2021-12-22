import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AppBaseEntity } from './alike-base-entity';
import { Push } from './push';

@Entity()
export class PushUser extends AppBaseEntity {
  @PrimaryGeneratedColumn()
  public id: number; 

  @Index()
  @Column({ type: 'int', comment: 'push id' })
  public pushId: number;

  @Column({ type: 'varchar', comment: 'user id', length: 36 })
  public userId: string;

  @ManyToOne((type) => Push, push => push.users, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'pushId', referencedColumnName: 'id' })
  public push: Push;
}