import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatRoom } from './ChatRoom.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './ChatRoom.entity';
import {User} from '../user_database/user.entity';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private roomsRepository: Repository<ChatRoom>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(room: ChatRoom): Promise<ChatRoom> {
    return this.roomsRepository.save(room);
  }

  save(room: ChatRoom): Promise<ChatRoom> {
    return this.roomsRepository.save(room);
  }

  async update(id: number, room: ChatRoom): Promise<void> {
    await this.roomsRepository.update(id, room);
  }

  async updateName(id: number, name: string): Promise<void> {
    const room = await this.roomsRepository.findOne({ where: { id } });
    room.name = name;
    await this.roomsRepository.save(room);
  }

  async findDMsByUser(user: User): Promise<ChatRoom[]> {
    return this.roomsRepository.find({
      where: { type: 'dm', users: user},
      relations: ['users']
    });
  }

  findAllWithUsers(): Promise<ChatRoom[]> {
    return this.roomsRepository.find({relations: ['users']});
  }

  findAllDmsWithUsers(): Promise<ChatRoom[]> {
    return this.roomsRepository.find({where: {type: 'dm'} ,relations: ['users']});
  }


  findAll(): Promise<ChatRoom[]> {
    return this.roomsRepository.find();
  }

  async findMessages(id: number): Promise<Message[]> {
    const room = await this.roomsRepository.findOne({ where: { id }, relations: ['messages'] });
    return room.messages;
  }

  async findUsers(id: number): Promise<User[]> {
    const room = await this.roomsRepository.findOne({ where: { id }, relations: ['users'] });
    return room.users;
  }

  findOne(id: number): Promise<ChatRoom> {
    return this.roomsRepository.findOneBy({ id });
  }

  findOneWithUsers(id: number) : Promise <ChatRoom> {
    return this.roomsRepository.findOne({ where: { id }, relations: ['users'] });
  }

  async remove(id: string): Promise<void> {
    await this.roomsRepository.delete(id);
  }

  async getRoomUsers(id: number): Promise<User[]> {
    const room = await this.roomsRepository.findOne({ where: { id }, relations: ['users'] });
    return room.users;
  }
  
  async deleteAll(): Promise<void> {
    await this.roomsRepository.clear();
  }
}