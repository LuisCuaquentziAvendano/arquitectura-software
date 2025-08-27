import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ThreeInARowModule } from './three-in-a-row/three-in-a-row.module';

@Module({
  imports: [UsersModule, ThreeInARowModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
