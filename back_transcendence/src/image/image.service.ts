import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {Image} from './image.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
  ) {}

  create(image: Image): Promise<Image> {
    return this.imagesRepository.save(image);
  }

  async update(id: number, image: Image): Promise<void> {
    await this.imagesRepository.update(id, image);
  }

  findAll(): Promise<Image[]> {
    return this.imagesRepository.find();
  }

  findOne(id: number): Promise<Image> {
    return this.imagesRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.imagesRepository.delete(id);
  }


}