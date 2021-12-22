import { BaseEntity, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class AppBaseEntity extends BaseEntity {

  @CreateDateColumn({ type: 'datetime', comment: '생성 날짜' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '수정 날짜' })
  updatedAt: Date;
}