import { EmailEntity } from 'src/modules/email/entities/email.entity';
import { PlaylistEntity } from 'src/modules/playlist/entities/playlist.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 20 })
  id: string;

  @Column({ name: 'password', type: 'char', length: 60, nullable: false })
  password: string;

  @Column({ name: 'email', type: 'varchar', length: 40, unique: true, nullable: false })
  email: string;

  @Column({ name: 'nickname', type: 'varchar', length: 30, nullable: false })
  nickname: string;

  @Column({ name: 'isEmailVerified', type: 'boolean', default: false })
  isEmailVerified: boolean;

  @OneToMany(() => PlaylistEntity, playlist => playlist.user, { cascade: true })
  playlists: PlaylistEntity[]

  @OneToMany(() => EmailEntity, email => email.user, { cascade: true })
  emails: EmailEntity[]
}
