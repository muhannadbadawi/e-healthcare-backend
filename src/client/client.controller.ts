import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
