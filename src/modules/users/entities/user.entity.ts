import { Entity, Column, CreateDateColumn } from 'typeorm';

@Entity('love_ys_user')
export class User {
  @Column({ primary: true, length: 50, name: 'user_id' })
  userId: string;

  @Column({ length: 100, name: 'user_name' })
  userName: string;

  @Column({ length: 20, name: 'user_role' })
  userRole: string;

  @Column({ length: 255 })
  password: string; // Will be hashed

  @CreateDateColumn({ name: 'create_date' })
  createDate: Date;
}
