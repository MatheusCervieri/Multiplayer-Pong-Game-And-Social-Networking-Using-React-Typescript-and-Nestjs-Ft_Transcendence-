import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {User} from '../user_database/user.entity';
import {Game} from  './Game.entity';

@Injectable()
export class GamesServices {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,

  ) {}

  create(game: Game): Promise<Game> {
    return this.gamesRepository.save(game);
  }

  save(game: Game): Promise<Game> {
    return this.gamesRepository.save(game);
  }

  async update(id: number, game: Game): Promise<void> {
    await this.gamesRepository.update(id, game);
  }

  async remove(id: string): Promise<void> {
    await this.gamesRepository.delete(id);
  }
  
  async deleteAll(): Promise<void> {
    await this.gamesRepository.clear();
  }
}