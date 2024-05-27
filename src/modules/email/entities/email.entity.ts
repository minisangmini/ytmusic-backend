import { UserEntity } from 'src/modules/auth/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('email_verification')
export class EmailEntity {
  @PrimaryColumn({ name: 'id', type: 'char', length: 13 })
  id: string;

  @Column({ name: 'email', type: 'varchar', length: 40, nullable: false })
  email: string;

  @ManyToOne(() => UserEntity, user => user.playlists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity
}
