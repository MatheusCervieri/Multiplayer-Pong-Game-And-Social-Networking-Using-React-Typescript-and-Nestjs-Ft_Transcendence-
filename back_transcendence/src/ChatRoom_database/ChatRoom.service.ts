import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatRoom } from './ChatRoom.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private roomsRepository: Repository<ChatRoom>,
  ) {}

  create(room: ChatRoom): Promise<ChatRoom> {
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

  findAll(): Promise<ChatRoom[]> {
    return this.roomsRepository.find();
  }

  findOne(id: number): Promise<ChatRoom> {
    return this.roomsRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.roomsRepository.delete(id);
  }
  
  async deleteAll(): Promise<void> {
    await this.roomsRepository.clear();
  }
}