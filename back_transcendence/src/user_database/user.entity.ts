import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {ManyToMany} from 'typeorm';
import { ChatRoom } from 'src/ChatRoom_database/ChatRoom.entity';
import { OneToMany } from 'typeorm';
import { JoinTable } from 'typeorm';
import { JoinColumn } from 'typeorm';
import {OneToOne} from 'typeorm';
import { Image } from '../image/image.entity';
import { Game } from 'src/GamesDatabase/Game.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  FortytwoId: number;

  @Column({nullable: true})
  token: string;

  @Column({ default: false })
  TwofaAactive: boolean;

  @Column({nullable: true})
  TwofaSecret: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column({nullable: true})
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(type => ChatRoom, chatRoom => chatRoom.users)
  chatRooms: ChatRoom[];


  @ManyToMany(type => ChatRoom, chatRoom => chatRoom.bannedusers)
  bannedrooms: ChatRoom[];

  @ManyToMany(type => ChatRoom, chatRoom => chatRoom.mutedusers)
  mutedrooms: ChatRoom[];

  @ManyToMany(type => ChatRoom, chatRoom => chatRoom.adminusers)
  adminrooms: ChatRoom[];
  
  @ManyToMany(type => User, user => user.blockedBy)
  @JoinTable()
  blocks: User[];

  @ManyToMany(type => User, user => user.blocks)
  @JoinTable()
  blockedBy: User[];

  @OneToMany(type => ChatRoom, chatRoom => chatRoom.owner)
  ownedChatRooms: ChatRoom[];

  @OneToOne(() => Image)
  @JoinColumn()
  image: Image;

}
