import { User } from 'src/user_database/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany , ManyToOne } from 'typeorm';
import { ManyToMany, OneToOne } from 'typeorm';
import { JoinTable, JoinColumn } from 'typeorm'

@Entity()
export class Game {
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

}
