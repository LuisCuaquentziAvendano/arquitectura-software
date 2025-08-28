import { BadRequestException, Injectable } from '@nestjs/common';
import { ThreeInARowGame } from './three-in-a-row-game';
import { ThreeInARowDto } from 'src/three-in-a-row/dto/three-in-a-row.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ThreeInARow } from 'src/repositories/three-in-a-row.repository';
import { Model } from 'mongoose';
import { User } from 'src/repositories/user.repository';

@Injectable()
export class ThreeInARowService {
  constructor(
    private readonly threeInARowGame: ThreeInARowGame,
    @InjectModel(ThreeInARow.name)
    private readonly threeInARowRepository: Model<ThreeInARow>,
  ) {}

  async startGame(user: User): Promise<ThreeInARowDto> {
    const game = this.threeInARowGame.startGame();
    await this.threeInARowRepository.findOneAndUpdate(
      { userId: user._id },
      game,
      { upsert: true },
    );
    return game;
  }

  async playUserTurn(
    user: User,
    i: number,
    j: number,
  ): Promise<ThreeInARowDto> {
    const game = await this.threeInARowRepository.findOne({ userId: user._id });
    if (!game) throw new BadRequestException('There is no game in progress');
    this.threeInARowGame.playUserTurn(game, i, j);
    await this.threeInARowRepository.updateOne({ userId: game.userId }, game);
    return this.threeInARowModelToDto(game);
  }

  private threeInARowModelToDto(threeInARow: ThreeInARow): ThreeInARowDto {
    return {
      board: threeInARow.board,
      isEndOfGame: threeInARow.isEndOfGame,
      winningBoxes: threeInARow.winningBoxes,
    };
  }
}
