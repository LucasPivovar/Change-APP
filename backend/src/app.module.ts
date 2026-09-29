import { Controller, Get, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DatabaseService } from './database.service';
import { AuthController, ProfileController, SessionController, SessionGuard } from './session';
import { ChatsController } from './chats/chats.controller';
import { ChatsService } from './chats/chats.service';
import { GeminiService } from './chats/gemini.service';
import { FriendsController, FriendsService } from './friends';
import { GroupsController, GroupsService } from './groups';

@Controller('health')
class HealthController {
  @Get() health() { return { status: 'ok' }; }
}

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }])],
  controllers: [HealthController, AuthController, ProfileController, SessionController, ChatsController, FriendsController, GroupsController],
  providers: [DatabaseService, SessionGuard, ChatsService, GeminiService, FriendsService, GroupsService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
