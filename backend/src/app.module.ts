import { Controller, Get, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DatabaseService } from './database.service';
import { AuthController, ProfileController, SessionController, SessionGuard } from './session';
import { ChatsController } from './chats/chats.controller';
import { ChatsService } from './chats/chats.service';
import { GeminiService } from './chats/gemini.service';
import { FriendsController, FriendsService } from './friends';

@Controller('health')
class HealthController {
  @Get() health() { return { status: 'ok' }; }
}

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }])],
  controllers: [HealthController, AuthController, ProfileController, SessionController, ChatsController, FriendsController],
  providers: [DatabaseService, SessionGuard, ChatsService, GeminiService, FriendsService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
