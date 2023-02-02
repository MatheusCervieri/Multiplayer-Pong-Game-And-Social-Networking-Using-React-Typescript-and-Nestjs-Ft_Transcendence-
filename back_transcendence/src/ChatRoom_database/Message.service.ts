import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Message } from './ChatRoom.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  create(message: Message): Promise<Message> {
    return this.messagesRepository.save(message);
  }

  async update(id: number, message: Message): Promise<void> {
    await this.messagesRepository.update(id, message);
  }


  findAll(): Promise<Message[]> {
    return this.messagesRepository.find();
  }

  findOne(id: number): Promise<Message> {
    return this.messagesRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.messagesRepository.delete(id);
  }
  
  async deleteAll(): Promise<void> {
    await this.messagesRepository.clear();
  }
}