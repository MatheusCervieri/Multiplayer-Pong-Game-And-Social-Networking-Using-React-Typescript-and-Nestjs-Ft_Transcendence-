import { User } from 'src/user_database/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany , ManyToOne } from 'typeorm';
import { ManyToMany, OneToOne } from 'typeorm';
import { JoinTable, JoinColumn } from 'typeorm';


@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  type: string;

  @Column({nullable: true})
  winnerName: string;

  @Column({nullable: true})
  winnerId: number;

  @Column({nullable: true})
  looserId: number;

  @Column({nullable: true})
  player1FinalScore: number;

  @Column({nullable: true})
  player2FinalScore: number;

  @Column({nullable: true})
  player1Id: number;

  @Column({nullable: true})
  player2Id: number;

  @Column({ default: true , nullable: true})
  isRunning: boolean;
  
  @Column({ default: true })
  isActive: boolean;

}
