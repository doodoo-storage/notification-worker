import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AppBaseEntity } from './alike-base-entity';
import { PushUser } from './push-user';

@Entity()
export class Push extends AppBaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 200, comment: '푸시 제목', nullable: true })
  public title?: string;

  @Column({ type: 'longtext', comment: '푸시 내용' })
  public content: string;

  @Index()
  @Column({ type: 'varchar', comment: '이미지 url', length: 200, nullable: true })
  public imageUrl: string;

  @Index()
  @Column({ type: 'boolean', comment: '광고성 여부' })
  public marketing: boolean;

  @Index()
  @Column({ type: 'varchar', comment: '발송 타겟 타입' })
  public target: 'ALL' | 'TARGETING';

  @Index()
  @Column({ type: 'varchar', comment: '발송 타입', length: 20 })
  public type: 'IMMEDIATELY' | 'RESERVATION';

  @Column({ type: 'datetime', comment: '발송 예약 시각', nullable: true })
  public reservationAt: Date;

  @Column({ type: 'datetime', comment: '발송 시간', nullable: true })
  public sendedAt: Date;

  @Column({ type: 'varchar', comment: '이동 경로', length: 200 })
  public location: string;

  @Column({ type: 'boolean', comment: '발송 완료 여부' })
  public completed: boolean;

  @OneToMany((type) => PushUser, user => user.push)
  public users: PushUser[];
}