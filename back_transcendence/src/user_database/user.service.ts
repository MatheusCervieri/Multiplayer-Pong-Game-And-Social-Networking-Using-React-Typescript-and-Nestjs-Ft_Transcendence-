import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { Game } from 'src/GamesDatabase/Game.entity';
import { GamesServices } from 'src/GamesDatabase/Games.service';

interface UserWithStatus extends User {
  status: string;
}

interface UserWithRanking extends UserWithStatus {
  score: any,
  wins: any,
  losts: any,
  rankingP: any,
}


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
    @Inject(forwardRef(() => GamesServices))
    private gameService: GamesServices,
  ) {}

  create(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async GetUsersAndStatus() {
    const users = await this.usersRepository.find();
    if (users) {
      const usersWithStatus: UserWithStatus[] = [];
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const userWithStatus: UserWithStatus = { ...user, status: await this.notificationService.checkUsersStatus(user.id) };
        usersWithStatus.push(userWithStatus);
      }
      return usersWithStatus;
    }
  }

  async GetFriendWithStatus(requestUserId : any) {
    const userWithFriends = await this.findByIdWithFriends(requestUserId);
    const friends = userWithFriends.friends;
    if (friends) {
      const friendswithstatus: any[] = [];
      for (let i = 0; i < friends.length; i++) {
        const friend = friends[i];
        const friendWithStatus: any = { ...friend, status: await this.notificationService.checkUsersStatus(friend.id) };
        friendswithstatus.push(friendWithStatus);
      }
      return friendswithstatus;
    }
    
  
  }

 

  async GetUsersRanking() {
    const users = await this.GetUsersAndStatus();
    if (users) {
      const usersWithRanking: UserWithRanking[] = [];
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const wins = await this.gameService.getUserWins(user.id);
        const losts = await this.gameService.getUserLosts(user.id);
        const userWithRanking = { ...user, 
          wins: wins,
          losts: losts, 
          score: wins - losts,
          rankingP: 0,
        };
        usersWithRanking.push(userWithRanking);
      }
      // Sort by score in descending order
      usersWithRanking.sort((a, b) => b.score - a.score);
      //atribute a ranking position (rankingP) based on the order of the array
      for (let i = 0; i < usersWithRanking.length; i++) {
        usersWithRanking[i].rankingP = i + 1;
      }
      return usersWithRanking;
    }
  }

  async update(id: number, user: User): Promise<void> {
    await this.usersRepository.update(id, user);
  }

  async updateName(id: number, name: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    user.name = name;
    await this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }


  findOneEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  findOneByName(name: string): Promise<User> {
    return this.usersRepository.findOneBy({ name });
  }

  findOneByToken(token: string): Promise<User> {
    return this.usersRepository.findOneBy({ token });
  }

  findOneBy42Id(FortytwoId: number): Promise<User> {
    return this.usersRepository.findOneBy({ FortytwoId });
  }

  async findAllNames(): Promise<string[]> {
    const users = await this.usersRepository.find();
    return users.map(user => user.name);
  }

  async findByIdWithBlocks(id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['blocks'],
    });
  }

  async findByIdWithFriends(id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['friends'],
    });
  }

  async findWithImage(id: number): Promise<User> {
    if (!id) {
      throw new Error('Invalid user ID');
    }
  
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['image'],
    });
  }

  async findUserPrivilleges(id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['blocks'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async blockUser(blockingUser: User, userToBlock: User): Promise<void> {
    blockingUser.blocks.push(userToBlock);
    await this.usersRepository.save(blockingUser);
  }

  async AddFriend(AddFriendUser: User, userToAdd: User): Promise<void> {
    AddFriendUser.friends.push(userToAdd);
    await this.usersRepository.save(AddFriendUser);
  }
}

