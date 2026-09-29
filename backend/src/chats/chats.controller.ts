import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SessionGuard, SessionRequest } from '../session';
import { ChatsService } from './chats.service';
import { CleanTranscriptDto, CreateChatDto, PageDto, SendMessageDto, UpdateChatDto } from './dto';

@Controller('chats')
@UseGuards(SessionGuard)
export class ChatsController {
  constructor(private readonly chats: ChatsService) {}
  private owner(req: SessionRequest) { return req.userId || req.sessionId; }
  @Post() create(@Req() req: SessionRequest, @Body() dto: CreateChatDto) { return this.chats.create(this.owner(req), dto); }
  @Get() list(@Req() req: SessionRequest, @Query() page: PageDto) { return this.chats.list(this.owner(req), page); }
  @Get(':id') get(@Req() req: SessionRequest, @Param('id', new ParseUUIDPipe({ version: '4' })) id: string) { return this.chats.get(this.owner(req), id); }
  @Patch(':id') update(@Req() req: SessionRequest, @Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body() dto: UpdateChatDto) { return this.chats.update(this.owner(req), id, dto); }
  @Get(':id/messages') history(@Req() req: SessionRequest, @Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Query() page: PageDto) { return this.chats.history(this.owner(req), id, page); }
  @Post(':id/messages') @HttpCode(200) @Throttle({ default: { limit: 10, ttl: 60000 } })
  send(@Req() req: SessionRequest, @Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body() dto: SendMessageDto) { return this.chats.send(this.owner(req), id, dto); }
  @Post('speech/clean') @HttpCode(200) @Throttle({ default: { limit: 10, ttl: 60000 } })
  async cleanSpeech(@Req() req: SessionRequest, @Body() dto: CleanTranscriptDto) {
    return { text: await this.chats.cleanTranscript(this.owner(req), dto) };
  }
  @Delete(':id') @HttpCode(204)
  remove(@Req() req: SessionRequest, @Param('id', new ParseUUIDPipe({ version: '4' })) id: string) { return this.chats.remove(this.owner(req), id); }
}
