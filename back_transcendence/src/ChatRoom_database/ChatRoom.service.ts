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

  async findRoomUsers(id : number): Promise<ChatRoom[]> {
    const chatRoom = await this.roomsRepository.find({
      where: { id: id },
      relations: ['users', 'owner', 'adminusers', 'bannedusers', 'mutedusers'],
    });
    return chatRoom;
  }

  async findOwner(id : number): Promise<ChatRoom> {
    const chatRoom = await this.roomsRepository.find({
      where: { id: id },
      relations: ['owner'],
    });
    return chatRoom[0];
  }

  findAllDmsWithUsers(): Promise<ChatRoom[]> {
    return this.roomsRepository.find({where: {type: 'dm'} ,relations: ['users']});
  }


  findAll(): Promise<ChatRoom[]> {
    return this.roomsRepository.find();
  }

  findAllPublic(): Promise<ChatRoom[]> {
    return this.roomsRepository.find({ where: { type: 'public' } });
  }

  findAllPrivate(): Promise<ChatRoom[]> {
    return this.roomsRepository.find({ where: { type: 'private' } });
  }

  findAllProtected(): Promise<ChatRoom[]> {
    return this.roomsRepository.find({ where: { type: 'protected' } });
  }


  async findMessages(id: number): Promise<Message[]> {
    const room = await this.roomsRepository.findOne({ where: { id }, relations: ['messages'] });
    return room.messages;
  }

  async findUsers(id: number): Promise<User[]> {
    const room = await this.roomsRepository.findOne({ where: { id }, relations: ['users'] });
    return room.users;
  }

  async findAdminUsers(id: number): Promise<User[]> {
    const chatRoom = await this.roomsRepository.findOne({ where: { id }, 
      relations: ['adminusers'],
    });
    return chatRoom.adminusers || [];
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

  async updateRoomType(id: number, type : string, password: string): Promise<ChatRoom> {
    // Find the room with the given id
    const room = await this.roomsRepository.findOne({ where: { id } });
    room.type = type;
    room.password = password;
    return await this.roomsRepository.save(room);
    // Check if the user is an owner of the room
  }

  async removeParticipant(roomId: number, userId: number): Promise<void> {
    // Find the room with the given id
    //Observar que pode ter um erro aqui: 
    try {
    const room = await this.roomsRepository.findOne({ where: { id: roomId }, relations: ['users'] });
    // Check if the user is a participant in the room
    const participant = room.users.find((user) => user.id === userId);
    if (!participant) {
      throw new Error('User is not a participant in the room');
    }
    
    // Remove the user from the room
    room.users = room.users.filter((user) => user.id !== userId);
    await this.roomsRepository.save(room);
    } catch (error) {
      console.log(error);
    }
  }

  async setNewOwner(room: ChatRoom): Promise<void> {
  try {
  const currentUsers = await this.getRoomUsers(room.id);

  if (currentUsers.length === 0) {
    throw new Error('Cannot set new owner - no users in room');
  }

  // Choose a random user from the current users in the room
  const randomIndex = Math.floor(Math.random() * currentUsers.length);
  const newOwner = currentUsers[randomIndex];

  // Update the room owner
  room.owner = newOwner;
  await this.roomsRepository.save(room);
}
  catch (error) {

}
}

async findBlockedUsers(id: number): Promise<User[]> {
  const chatRoom = await this.roomsRepository.findOne({ where: { id }, 
    relations: ['bannedusers'],
  });
  return chatRoom.bannedusers || [];
}

async findMutedUsers(id: number): Promise<User[]> {
  const chatRoom = await this.roomsRepository.findOne({ where: { id }, 
    relations: ['mutedusers'],
  });
  return chatRoom.mutedusers || [];  
}
  
  async deleteAll(): Promise<void> {
    await this.roomsRepository.clear();
  }
}