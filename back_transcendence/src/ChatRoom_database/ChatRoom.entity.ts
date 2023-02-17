import { User } from 'src/user_database/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany , ManyToOne } from 'typeorm';
import { ManyToMany, OneToOne } from 'typeorm';
import { JoinTable, JoinColumn } from 'typeorm'

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  adm: string;

  @Column({ nullable: true })
  type: string; // private, public, protected or dm 

  @Column({ nullable: true })
  password: string;

  @ManyToOne(() => User, user => user.ownedChatRooms)
  @JoinColumn()
  owner: User;
  
  @Column({ default: true })
  isActive: boolean;

  @OneToMany(type => Message, message => message.chatRoom)
  messages: Message[];

  @ManyToMany(type => User, user => user.chatRooms)
  @JoinTable()
  users: User[];

  @ManyToMany(type => User, user => user.adminrooms)
  @JoinTable()
  adminusers: User[];

  @ManyToMany(type => User, user => user.bannedrooms)
  @JoinTable()
  bannedusers: User[];

  @ManyToMany(type => User, user => user.mutedrooms)
  @JoinTable()
  mutedusers: User[];
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