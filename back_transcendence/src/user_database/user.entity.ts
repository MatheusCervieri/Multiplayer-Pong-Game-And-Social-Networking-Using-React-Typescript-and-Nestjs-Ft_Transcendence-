import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {ManyToMany} from 'typeorm';
import { ChatRoom } from 'src/ChatRoom_database/ChatRoom.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  token: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(type => ChatRoom, chatRoom => chatRoom.users)
  chatRooms: ChatRoom[];
}