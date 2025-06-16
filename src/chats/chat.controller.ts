import {
  Controller,
  Body,
  Get,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { GetHistoryByUserIdDto } from './dto/chats.dto';


@Controller('chat')
export class AuthController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get('getByUserId')
  getByUserId(@Body() dto: GetHistoryByUserIdDto) {
    return this.chatsService.getByUserId(dto);
  }

 
}
