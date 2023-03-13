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
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {

    setInterval(() => this.gameLoops(), 100);
  }

  async createInviteGame(player1 : any , player2 : any): Promise<Game> {
    const newgame = new Game();
    newgame.name = player1.user.name + " vs " + player2.user.name;
    newgame.type = "invite";
    newgame.player1Id = player1.user.id;
    newgame.player2Id = player2.user.id;
    const databaseGame = await this.gamesRepository.save(newgame); 
    const rtGame = Object.assign({}, defaultGameRoom); 
    
    rtGame.id = databaseGame.id;
    rtGame.type = 'invite';
    rtGame.player1Name = player1.user.name;
    rtGame.player2Name = player2.user.name;
    rtGame.creationDate = new Date().getTime();
    rtGame.status = "lobby";
    rtGame.lobbyTime = 25000;
    this.rtGames.set(databaseGame.id.toString(), rtGame);
    return databaseGame;
  }
  
  async createQueueGame(player1 : any , player2 : any): Promise<Game> {
    const newgame = new Game();
    newgame.name = player1.user.name + " vs " + player2.user.name;
    newgame.type = "findgame";
    newgame.player1Id = player1.user.id;
    newgame.player2Id = player2.user.id;
    const databaseGame = await this.gamesRepository.save(newgame); 
    const rtGame = Object.assign({}, defaultGameRoom); //One of the problens is here. 
    
    rtGame.id = databaseGame.id;
    rtGame.player1Name = player1.user.name;
    rtGame.player2Name = player2.user.name;
    rtGame.creationDate = new Date().getTime();
    rtGame.status = "lobby";
    this.rtGames.set(databaseGame.id.toString(), rtGame);
    
    player1.client.emit('game-found', { id : databaseGame.id });
    player2.client.emit('game-found', { id: databaseGame.id });
    return databaseGame;
  }

  authenticate(playername: string, gameId: string) {
    const rtGame = this.rtGames.get(gameId);

    if (rtGame)
    {
    if(rtGame.type === 'findgame')
    {
    if(playername === rtGame.player1Name) {
      rtGame.player1IsConnected = true;
      //Remove possible player1 clients from the queue
      this.queue = this.queue.filter(x => x.user.name !== rtGame.player1Name);

    }
    else if (playername === rtGame.player2Name)
    {
      rtGame.player2IsConnected = true;
       //Remove possible player2 clients from the queue
      this.queue = this.queue.filter(x => x.user.name !== rtGame.player2Name);
     
    }
    }
    else
    {
      if(playername === rtGame.player1Name) {
        rtGame.player1IsConnected = true;
      }
      else if (playername === rtGame.player2Name)
      {
        rtGame.player2IsConnected = true;
      }
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
       
      //this.rtGames.delete(gameId);
    }
    
    this.updateGame(gameId, rtGame);
    }
  }


  async voteGame(username: string, game_id: string, smallRacket: boolean, longerGame: boolean)
  {
    const rtGame = this.rtGames.get(game_id);
    
    if(rtGame.player1Name === username)
    {
        rtGame.player1SmallRacketVote = smallRacket;
        rtGame.player1LongerGameVote = longerGame;
    }

    if(rtGame.player2Name === username)
    {
        rtGame.player2SmallRacketVote = smallRacket;
        rtGame.player2LongerGameVote = longerGame;
    }

    this.updateGame(game_id, rtGame);
  }
 

  async movePlayer(username: string, game_id: string, direction: string)
  {
    const rtGame = this.rtGames.get(game_id);
    if(rtGame.player1Name === username)
    {
      if(direction === 'up')
      {
        //Check colision with the top wall using this properties  rtGame.player1RacketPosition - rtGame.racketHeight < rtGame.height
        if(rtGame.player1RacketPosition > 0)
          rtGame.player1RacketPosition -= rtGame.racketVelocity;
      }

      if(direction === 'down')
      {
        //Check colision with the botton wall
        if(rtGame.player1RacketPosition + rtGame.racketHeight < rtGame.height)
          rtGame.player1RacketPosition += rtGame.racketVelocity;
      }
    }

    if(rtGame.player2Name === username)
    {
      if(direction === 'up')
      {
        if(rtGame.player2RacketPosition > 0)
          rtGame.player2RacketPosition -= rtGame.racketVelocity;
      }
      if(direction === 'down')
      {
        if(rtGame.player2RacketPosition + rtGame.racketHeight < rtGame.height)
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
    if (ballX + ballRadiues > (width + ballRadiues * 2 + 10)) {
      rtGame.ballX = rtGame.firstBallPositionX;
      rtGame.ballY = rtGame.firstBallPositionY; 
      rtGame.player1Score += 1; // Ball collided with right wall
      rtGame.ballVx = -Math.abs(ballVx); // Reverse ball velocity in x direction
    } 
    else if (ballX - ballRadiues < (0 - ballRadiues * 2 - 10)) { // Ball collided with left wall
      rtGame.ballX = rtGame.firstBallPositionX;
      rtGame.ballY = rtGame.firstBallPositionY;
      rtGame.player2Score += 1;  
      rtGame.ballVx = Math.abs(ballVx); // Reverse ball velocity in x direction
    }
  
    // Check for collision with the top or bottom walls
    if (ballY + ballRadiues > height) { // Ball collided with bottom wall
      rtGame.ballVy = -Math.abs(ballVy); // Reverse ball velocity in y direction
    } 
    else if (ballY - ballRadiues < 0) { // Ball collided with top wall
      rtGame.ballVy = Math.abs(ballVy); // Reverse ball velocity in y direction
    }
  
    this.rtGames.set(gameId, rtGame);
  }

  handleBallRacketCollision(gameId: string, rtGame: any) {
    const { ballX, ballY, ballRadiues, ballVx, ballVy, racketHeight, racketWidth, player1RacketPosition, player2RacketPosition, player1RacketXPosition, player2RacketXPosition, width } = rtGame;
   
    // Check for collision with player 1 racket
    if (ballX - ballRadiues < player1RacketXPosition + racketWidth && ballX + ballRadiues > player1RacketXPosition && ballY - ballRadiues < player1RacketPosition + racketHeight && ballY + ballRadiues > player1RacketPosition) {
      rtGame.ballVx = Math.abs(ballVx); // Reverse ball velocity in x direction
    }
  
    // Check for collision with player 2 racket
    if (ballX - ballRadiues < player2RacketXPosition - racketWidth && ballX + ballRadiues > player2RacketXPosition && ballY - ballRadiues < player2RacketPosition + racketHeight && ballY + ballRadiues > player2RacketPosition) {
      rtGame.ballVx = -Math.abs(ballVx); // Reverse ball velocity in x direction
    }
    this.rtGames.set(gameId, rtGame);
    }

  async finishGame(gameId: string , rtGame: RTGameRoomInterface)
  {
    rtGame.status = 'finished';
    this.updateGame(gameId, rtGame);
    const gamedatabase = await this.findGame(gameId);
    gamedatabase.player1FinalScore = rtGame.player1Score;
    gamedatabase.player2FinalScore = rtGame.player2Score;
    if(rtGame.player1Score > rtGame.player2Score)
    {
      gamedatabase.winnerName = rtGame.player1Name;
      gamedatabase.winnerId = gamedatabase.player1Id;
      gamedatabase.looserId = gamedatabase.player2Id;
    }
    else if(rtGame.player1Score < rtGame.player2Score)
    {
      gamedatabase.winnerName = rtGame.player2Name;
      gamedatabase.winnerId = gamedatabase.player2Id;
      gamedatabase.looserId = gamedatabase.player1Id;
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

  async finishgameBeforeStart(gameId: string, rtGame: RTGameRoomInterface)
  {
    rtGame.status = 'finished';
    const gamedatabase = await this.findGame(gameId);
    gamedatabase.player1FinalScore = 0;
    gamedatabase.player2FinalScore = 0;
    gamedatabase.winnerName = "ERROR1";
    gamedatabase.winnerId = 0;
    gamedatabase.isRunning = false;
    await this.save(gamedatabase);
    //remove game from rtGames
    
    //remove all games with this id from rtGames

    this.rtGames.delete(gameId);
    this.rtGames.delete(gameId.toString());
    
  }

  async finishgameDecline(gameId: string)
  {
    //we need to set the time the lobby to 0;
    //We need to update the rtGame.

    
    const rtGame = this.rtGames.get(gameId.toString());
    
    rtGame.timeToStart = 0;
    
    //remove game from rtGames
    this.rtGames.set(gameId.toString(), rtGame);
    this.gameGateway.server.to(gameId).emit('game-update', rtGame);
  }



  async finishgamePaused(gameId: string, rtGame: RTGameRoomInterface)
  {
    rtGame.status = 'finished';
    const gamedatabase = await this.findGame(gameId);
    gamedatabase.player1FinalScore = rtGame.player1Score;
    gamedatabase.player2FinalScore = rtGame.player2Score;
   
    if(rtGame.timeToPausePlayer1 > 0)
    {
      gamedatabase.winnerName = rtGame.player1Name;
      gamedatabase.winnerId = gamedatabase.player1Id;
      gamedatabase.looserId = gamedatabase.player2Id;
    }
    if(rtGame.timeToPausePlayer2 > 0)
    {
      gamedatabase.winnerName = rtGame.player2Name;
      gamedatabase.winnerId = gamedatabase.player2Id;
      gamedatabase.looserId = gamedatabase.player1Id;
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
      if(rtGame.timeToStart != 0)
        rtGame.timeToStart = rtGame.lobbyTime - rtGame.elepsedTime;
      if (rtGame.timeToStart <= 0) 
      {
        rtGame.timeToStart = 0;
        if(rtGame.player1IsConnected && rtGame.player2IsConnected)
        {
          //Select the gametime - make the necessary changes in the game based in the players votes. 
          
          if(rtGame.player1LongerGameVote && rtGame.player2LongerGameVote)
            rtGame.gameFinishScore = 20;
          if(rtGame.player1SmallRacketVote && rtGame.player2SmallRacketVote)
            rtGame.racketHeight = rtGame.racketHeight / 2;
          rtGame.status = 'playing';
        }
        else
        {
          this.finishgameBeforeStart(gameId, rtGame);
        }
      }
    }
    if(rtGame.status === 'playing')
    {
      if(rtGame.player1IsConnected === false)
      {
        rtGame.status = 'paused';
        rtGame.pausedtime = new Date().getTime();
      }
      if(rtGame.player2IsConnected === false)
      {
        rtGame.status = 'paused';
        rtGame.pausedtime = new Date().getTime();
      }
    }
    if(rtGame.status === 'paused')
    {
      if(rtGame.player1IsConnected && rtGame.player2IsConnected)
      {
        rtGame.status = 'playing';
      }
      if(rtGame.player1IsConnected === false)
      {
        //elepsedtime = tempoatual - tempoqueojogofoipausado.
        //timetodisconect = tempodepausa - elepsedtime
        rtGame.timeToPausePlayer1 = rtGame.player1PauseTime - (new Date().getTime() - rtGame.pausedtime);
      }
      if(rtGame.player2IsConnected === false)
      {
        rtGame.timeToPausePlayer2 = rtGame.player2PauseTime - (new Date().getTime() - rtGame.pausedtime);
      }
      if (rtGame.timeToPausePlayer1  <= 0 || rtGame.timeToPausePlayer2 <= 0) 
      {
        if(rtGame.player1IsConnected && rtGame.player2IsConnected)
        {
          rtGame.status = 'playing';
        }
        else
        {
          this.finishgamePaused(gameId, rtGame);
        }
      }
      if(rtGame.player1IsConnected && rtGame.player2IsConnected)
      {
        rtGame.status = 'playing';
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
        if(rtGame.player1Score === rtGame.gameFinishScore || rtGame.player2Score === rtGame.gameFinishScore)
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
      
      if (this.queue === undefined)
      {
        this.queue = [];
      }
      //Check if the user is already in the queue
      if (this.queue.find(x => x.user.id === user.id) === undefined)
      {
        this.queue.push({client, user});
        
      }

      //Check if the user is already in a running game! 
      for (const [gameId, rtGame] of this.rtGames.entries()) {
        if (rtGame.player1Name === user.name || rtGame.player2Name === user.name)
        {
          
          return;
        }
      }

      if (this.queue.length >= 2)
      {
        const player1 = this.queue.shift();
        const player2 = this.queue.shift();
        
        const game = await this.createQueueGame(player1, player2);
        
      }
    }
  }

  async getUserWins(userId : number) : Promise<number> 
  {
    const games = await this.gamesRepository.find();
    let wins = 0;
    for (const game of games) {
      if(game.winnerId === userId)
        wins++;
    }
    return wins;
  }

  async getUserLosts(userId : number) : Promise<number> 
  {
    const games = await this.gamesRepository.find();
    let looses = 0;
    for (const game of games) {
      if(game.looserId === userId)
        looses++;
    }
    return looses;
  }

  async handleQueueDisconnect(client: CustomSocket) {

    if (this.queue) {
      this.queue = this.queue.filter(player => player.client.id !== client.id);
      
    }
  }

  checkIfUserIsPlaying(playerName: string)
  {
    for (const [gameId, rtGame] of this.rtGames.entries()) {
      if (rtGame.player1Name === playerName || rtGame.player2Name === playerName)
      {
        return true;
      }
    }
    return false; 
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

  async getRunningGames(): Promise<Game[]> {
    return this.gamesRepository.find({ where: { isRunning: true } });
  }

  async getGamesByPlayerId(playerId: number): Promise<Game[]> {
    const games = await this.gamesRepository.find();
    return games.filter(game => game.player1Id === playerId || game.player2Id === playerId);
  }

}