import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('love_ys_post')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  title: string;

  @Column({ length: 100 })
  author: string;

  @Column('text')
  contents: string;

  @Column({
    type: 'char',
    length: 1,
    default: '0',
    name: 'access_level',
  })
  accessLevel: string; // '0': public, '1': admin only

  @CreateDateColumn({ name: 'create_date' })
  createDate: Date;
}