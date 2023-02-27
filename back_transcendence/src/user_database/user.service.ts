import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationGateway } from 'src/notification/notification.gateway';

interface UserWithStatus extends User {
  status: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
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

  async findWithImage(id: number): Promise<User> {
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

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async blockUser(blockingUser: User, userToBlock: User): Promise<void> {
    blockingUser.blocks.push(userToBlock);
    await this.usersRepository.save(blockingUser);
  }
}