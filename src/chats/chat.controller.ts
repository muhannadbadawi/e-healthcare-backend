import {
  Controller,
  Body,
  Post,
  Get,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { GetHistoryByUserIdDto } from './dto/chats.dto';


@Controller('chat')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post('getByUserId')
  getByUserId(@Body() dto: GetHistoryByUserIdDto) {
    return this.chatsService.getByUserId(dto);
  }

  @Get('getAllChats')
  async getAll() {
    return this.chatsService.getAll();
  }
}
