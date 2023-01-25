import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Email } from '../email.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(Email)
    private emailRepository: Repository<Email>,
  ) {}

  async create(email: Email): Promise<Email> {
    return this.emailRepository.save(email);
  }

  async findAll(): Promise<Email[]> {
    return this.emailRepository.find();
  }

  async findOne(id: number): Promise<Email> {
    return this.emailRepository.findOneBy({id});
  }

  async update(id: string, email: Email): Promise<void> {
    await this.emailRepository.update(id, email);
  }

  async delete(id: string): Promise<void> {
    await this.emailRepository.delete(id);
  }

}
