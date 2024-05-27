import { UserEntity } from 'src/modules/auth/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('playlist')
export class PlaylistEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => UserEntity, user => user.playlists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity

  @Column({ name: 'name', type: 'varchar', length: 20, nullable: false })
  name: string;

  @Column({ name: 'musicIds', type: 'json', nullable: false })
  musicIds: String[];
}
