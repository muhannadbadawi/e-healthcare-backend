import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { ClientService } from './client.service';
import { DoctorService } from 'src/doctor/doctor.service';
import { CreateClientDto } from './dto/create-client.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('client')
@Controller('client')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly doctorService: DoctorService,
  ) {}

  @Get('group-by-specialty')
  getDoctorsGroupedBySpecialty() {
    return this.clientService.groupDoctorsBySpecialty();
  }

  @Get(':id/balance')
  async getBalance(@Param('id') clientId: string) {
    return this.clientService.getBalance(clientId);
  }

  @Get('getClientById/:id')
  async getClientById(@Param('id') clientId: string) {
    return this.clientService.findByUserId(clientId);
  }

  @Put('updateClient/:id')
  async updateClient(@Param('id') id: string, @Body() dto: CreateClientDto) {
    console.log("id: ", id);
    await this.clientService.updateClient(id, dto);
  }

  @Post('rateDoctor')
  async rateDoctor(
    @Body('doctorId') doctorId: string,
    @Body('rating') rating: number,
  ) {
    return this.doctorService.rateDoctor(doctorId, rating);
  }
  // PATCH request updates only part of the data.
  // PUT request updates the entire data.
  @Patch(':id/balance')
  async updateSessionPrice(
    @Param('id') doctorId: string,
    @Body('balance') balance: number,
  ) {
    return this.clientService.updateBalance(doctorId, balance);
  }
}
