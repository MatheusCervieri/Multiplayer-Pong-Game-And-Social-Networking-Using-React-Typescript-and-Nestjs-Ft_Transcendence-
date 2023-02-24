import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {User} from '../user_database/user.entity';
import {Game} from  './Game.entity';
import { GameGateway } from './gamewebsocket/game.gateway';
import { RTGameRoomInterface, defaultGameRoom } from './roominterface';
import {CustomSocket} from './gamewebsocket/game.gateway';
import { Socket } from 'socket.io';
import { AnyARecord } from 'dns';
import { defaultThrottleConfig } from 'rxjs/internal/operators/throttle';
import { UsersService } from 'src/user_database/user.service';


@Injectable()
export class GamesServices {
  private queue: any[];
  private rtGames = new Map<string, RTGameRoomInterface>();
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
    @Inject(forwardRef(() => GameGateway))
    private gameGateway: GameGateway,
    private readonly userService: UsersService,
  ) {

    setInterval(() => this.gameLoops(), 100);
  }
  
  async createQueueGame(player1 : any , player2 : any): Promise<Game> {
    const newgame = new Game();
    newgame.name = player1.user.name + " vs " + player2.user.name;
    newgame.player1Id = player1.user.id;
    newgame.player2Id = player2.user.id;
    const databaseGame = await this.gamesRepository.save(newgame); 
    const rtGame = Object.assign({}, defaultGameRoom); //One of the problens is here. 
    console.log("RT GAME", defaultGameRoom);
    rtGame.id = databaseGame.id;
    rtGame.player1Name = player1.user.name;
    rtGame.player2Name = player2.user.name;
    rtGame.creationDate = new Date().getTime();
    rtGame.status = "lobby";
    this.rtGames.set(databaseGame.id.toString(), rtGame);
    console.log(this.rtGames);
    player1.client.emit('game-found', { id : databaseGame.id });
    player2.client.emit('game-found', { id: databaseGame.id });
    return databaseGame;
  }

  authenticate(playername: string, gameId: string) {
    const rtGame = this.rtGames.get(gameId);

    if (rtGame)
    {
    if(playername === rtGame.player1Name) {
      rtGame.player1IsConnected = true;
      //Remove possible player1 clients from the queue
      
    }
    else if (playername === rtGame.player2Name)
    {
      rtGame.player2IsConnected = true;
      //Remove possible player2 clients from the queue
    }
     // i could create a property for spectors, but i dont think it is necessary. 
     this.updateGame(gameId, rtGame);
  }
  }

  disconnect(playername: string, gameId: string) {
    const rtGame = this.rtGames.get(gameId);
    if (rtGame)
    {
    if(playername === rtGame.player1Name) {
      rtGame.player1IsConnected = false;
    }
    else if (playername === rtGame.player2Name)
    {
      rtGame.player2IsConnected = false;
    }
    else
    {

    }

    if(rtGame.player1IsConnected === false && rtGame.player2IsConnected === false) {
      console.log("Game is finished"); 
      //this.rtGames.delete(gameId);
    }
    
    this.updateGame(gameId, rtGame);
    }
  }

 

  async movePlayer(username: string, game_id: string, direction: string)
  {
    const rtGame = this.rtGames.get(game_id);
    if(rtGame.player1Name === username)
    {
      if(direction === 'up')
      {
        rtGame.player1RacketPosition -= rtGame.racketVelocity;
      }
      if(direction === 'down')
      {
        rtGame.player1RacketPosition += rtGame.racketVelocity;
      }
    }
    if(rtGame.player2Name === username)
    {
      if(direction === 'up')
      {
        rtGame.player2RacketPosition -= rtGame.racketVelocity;
      }
      if(direction === 'down')
      {
        rtGame.player2RacketPosition += rtGame.racketVelocity;
      }
    }
    this.updateGame(game_id, rtGame);
  }

  moveBall(game_id: string)
  {
    const rtGame = this.rtGames.get(game_id);
    rtGame.ballX += rtGame.ballVx;
    rtGame.ballY += rtGame.ballVy;
    this.rtGames.set(game_id, rtGame);
  }


  handleBallWallCollision(gameId: string , rtGame: any) {
    const { width, height, ballRadiues, ballX, ballY, ballVx, ballVy } = rtGame;
  
    // Check for collision with the right or left walls
    if (ballX + ballRadiues > width) {
      rtGame.ballX = rtGame.firstBallPosition;
      rtGame.ballY = rtGame.firstBallPosition; 
      rtGame.player1Score += 1; // Ball collided with right wall
      rtGame.ballVx = -Math.abs(ballVx); // Reverse ball velocity in x direction
    } else if (ballX - ballRadiues < 0) { // Ball collided with left wall
      rtGame.ballX = rtGame.firstBallPosition;
      rtGame.ballY = rtGame.firstBallPosition;
      rtGame.player2Score += 1;  
      rtGame.ballVx = Math.abs(ballVx); // Reverse ball velocity in x direction
    }
  
    // Check for collision with the top or bottom walls
    if (ballY + ballRadiues > height) { // Ball collided with bottom wall
      rtGame.ballVy = -Math.abs(ballVy); // Reverse ball velocity in y direction
    } else if (ballY - ballRadiues < 0) { // Ball collided with top wall
      rtGame.ballVy = Math.abs(ballVy); // Reverse ball velocity in y direction
    }
  
    this.rtGames.set(gameId, rtGame);
  }
  handleBallRacketCollision(gameId: string, rtGame: any) {
    const { ballX, ballY, ballRadiues, ballVx, ballVy,
            racketHeight, racketWidth,
            player1RacketPosition, player2RacketPosition, width } = rtGame;
  
    const isCollidingWithRacket = (racketPosition: number, height: number, width: number) => {
      const isBallInRangeOfRacketY = ballY > racketPosition - ballRadiues && ballY < racketPosition + height + ballRadiues;
      const isBallInRangeOfRacketX = (ballX + ballRadiues > width && ballVx > 0 && ballX < width + ballRadiues) ||
                                     (ballX - ballRadiues < width && ballVx < 0 && ballX > width - racketWidth - ballRadiues);
      return isBallInRangeOfRacketY && isBallInRangeOfRacketX;
    }
  
    if (isCollidingWithRacket(player1RacketPosition, racketHeight, racketWidth)) {
      rtGame.ballVx = Math.abs(ballVx);
    } else if (isCollidingWithRacket(player2RacketPosition, racketHeight, racketWidth)) {
      rtGame.ballVx = -Math.abs(ballVx);
    }
  
    this.rtGames.set(gameId, rtGame);
  }

  async finishGame(gameId: string , rtGame: RTGameRoomInterface)
  {
    rtGame.status = 'finished';
    const gamedatabase = await this.findGame(gameId);
    gamedatabase.player1FinalScore = rtGame.player1Score;
    gamedatabase.player2FinalScore = rtGame.player2Score;
    if(rtGame.player1Score > rtGame.player2Score)
    {
      gamedatabase.winnerName = rtGame.player1Name;
      gamedatabase.winnerId = gamedatabase.player1Id;
    }
    else if(rtGame.player1Score < rtGame.player2Score)
    {
      gamedatabase.winnerName = rtGame.player2Name;
      gamedatabase.winnerId = gamedatabase.player2Id;
    }
    else
    {
      //select draw
      gamedatabase.winnerName = 'Draw';
    }
    gamedatabase.isRunning = false;
    await this.save(gamedatabase);

    //remove game from rtGames
    this.rtGames.delete(gameId);
  }

  updateGame(gameId: string, rtGame: RTGameRoomInterface) {
    rtGame.elepsedTime = new Date().getTime() - rtGame.creationDate;
    if(rtGame.status === 'lobby')
    {
    rtGame.timeToStart = 10000 - rtGame.elepsedTime;
      if (rtGame.timeToStart <= 0) 
      {
        rtGame.timeToStart = 0;
        if(rtGame.player1IsConnected && rtGame.player2IsConnected)
        {
          rtGame.status = 'playing';
        }
        else
        {
          //finishgame
          rtGame.status = 'finished';
        }
      }
    }

    this.rtGames.set(gameId, rtGame);
    this.gameGateway.server.to(gameId).emit('game-update', rtGame);
  }

  async gameLoops(): Promise<void> {
    for (const [gameId, rtGame] of this.rtGames.entries()) {
      if (rtGame.status === 'playing') {
        this.moveBall(gameId);
        this.handleBallWallCollision(gameId, rtGame);
        this.handleBallRacketCollision(gameId, rtGame);
        if(rtGame.player1Score === 1 || rtGame.player2Score === 1)
          this.finishGame(gameId, rtGame);
      }
      this.updateGame(gameId, rtGame);
    }
  }

  getRtGame(id: string) {
    return this.rtGames.get(id);
  }

  async handleQueue(data : any, client: Socket) {
    const user = await this.userService.findOneByToken(data.token);
    if (user)
    {
      console.log("User found");
      if (this.queue === undefined)
      {
        this.queue = [];
      }
      //Check if the user is already in the queue
      if (this.queue.find(x => x.user.id === user.id) === undefined)
      {
        this.queue.push({client, user});
        console.log("User added to queue");
      }

      //Check if the user is already in a running game! 
      for (const [gameId, rtGame] of this.rtGames.entries()) {
        if (rtGame.player1Name === user.name || rtGame.player2Name === user.name)
        {
          console.log("User is already in a running game!");
          return;
        }
      }

      if (this.queue.length >= 2)
      {
        const player1 = this.queue.shift();
        const player2 = this.queue.shift();
        console.log("Queue", this.queue);
        const game = await this.createQueueGame(player1, player2);
        console.log(this.getRtGame(game.id.toString()));
      }
    }
  }

  async handleQueueDisconnect(client: CustomSocket) {

    if (this.queue) {
      this.queue = this.queue.filter(player => player.client.id !== client.id);
      console.log("Disconected from queue", client.id);
    }
  }

  create(game: Game): Promise<Game> {
    return this.gamesRepository.save(game);
  }

  async findWithPlayers(id: any): Promise<Game> {
    const game = await this.gamesRepository.findOne({
      where: { id: id },
      relations: ['player1', 'player2'],
    });
    return game;
  }

  async findGame(id: any): Promise<Game> {
    const game = await this.gamesRepository.findOne({
      where: { id: id },
    });
    return game;
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