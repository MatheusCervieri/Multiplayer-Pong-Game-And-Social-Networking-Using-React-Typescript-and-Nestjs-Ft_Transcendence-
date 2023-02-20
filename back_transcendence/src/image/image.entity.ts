import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {OneToOne} from 'typeorm';
import {User} from '../user_database/user.entity';


@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  filename: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @OneToOne(() => User, (user) => user.image)
  user: User;
}