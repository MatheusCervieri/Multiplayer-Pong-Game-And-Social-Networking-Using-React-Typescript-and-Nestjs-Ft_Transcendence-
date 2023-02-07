import { User } from 'src/user_database/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany , ManyToOne } from 'typeorm';
import { ManyToMany } from 'typeorm';
import { JoinTable } from 'typeorm'

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  adm: string;

  @Column({ nullable: true })
  type: string; // private, public or protected

  @Column({ nullable: true })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(type => Message, message => message.chatRoom)
  messages: Message[];

  @ManyToMany(type => User, user => user.chatRooms)
  @JoinTable()
  users: User[];
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: string;

  @Column()
  message: string;

  @ManyToOne(type => ChatRoom, chatRoom => chatRoom.messages)
  chatRoom: ChatRoom;
}