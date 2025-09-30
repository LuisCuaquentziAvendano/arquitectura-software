import { BadRequestException, Injectable } from '@nestjs/common';
import { MemoryDto } from './dto/memory.dto';
import { MemoryGame } from './memory-game';
import { InjectModel } from '@nestjs/mongoose';
import { Memory } from 'src/repositories/memory.repository';
import { Model } from 'mongoose';
import { User } from 'src/repositories/user.repository';

@Injectable()
export class MemoryService {
  constructor(
    private readonly memoryGame: MemoryGame,
    @InjectModel(Memory.name)
    private readonly memoryRepository: Model<Memory>,
  ) {}

  async startGame(user: User, pairs: number): Promise<MemoryDto> {
    const game = this.memoryGame.startGame(pairs);
    await this.memoryRepository.findOneAndUpdate({ userId: user._id }, game, {
      upsert: true,
    });
    return this.memoryModelToDto(game);
  }

  async playTurn(user: User, position: number): Promise<number> {
    const game = await this.memoryRepository.findOne({ userId: user._id });
    if (!game) throw new BadRequestException('There is no game in progress');
    const card = this.memoryGame.playTurn(game, position);
    await this.memoryRepository.updateOne({ userId: game.userId }, game);
    return card;
  }

  async gameStatus(user: User): Promise<MemoryDto> {
    const game = await this.memoryRepository.findOne({ userId: user._id });
    if (!game) throw new BadRequestException('There is no game in progress');
    return this.memoryModelToDto(game);
  }

  private memoryModelToDto(memory: Memory): MemoryDto {
    return {
      shownCards: memory.shownCards,
      moves: memory.moves,
      isEndOfGame: memory.isEndOfGame,
      gameTime: memory.gameTime || '',
    };
  }
}
