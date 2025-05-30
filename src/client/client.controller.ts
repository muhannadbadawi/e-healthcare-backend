import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { ClientService } from './client.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('group-by-specialty')
  getDoctorsGroupedBySpecialty() {
    return this.clientService.groupDoctorsBySpecialty();
  }

  @Get(':id/balance')
  async getBalance(@Param('id') clientId: string) {
    return this.clientService.getBalance(clientId);
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
