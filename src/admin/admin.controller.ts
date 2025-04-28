import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminService } from './admin.service';
import { CreateDoctorDto } from 'src/doctor/dto/create-doctor.dto';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('getCounts')
  async getCounts() {
    return await this.adminService.getCounts();
  }

  @Post('addDoctor')
  async addDoctors(@Body() dto: CreateDoctorDto) {
    return await this.adminService.addDoctor(dto);
  }

  @Put('editDoctor/:id')
  async editDoctor(
    @Param('id') id: string,
    @Body() updateDoctorDto: CreateDoctorDto,
  ) {
    return this.adminService.editDoctor(id, updateDoctorDto);
  }

  @Post('getDoctors')
  async getDoctors() {
    return await this.adminService.getDoctors();
  }

  @Delete('deleteDoctor/:id')
  async deleteDoctor(@Param('id') id: string) {
    return await this.adminService.deleteDoctor(id);
  }

  @Delete('deleteClient/:id')
  async deleteClient(@Param('id') id: string) {
    return await this.adminService.deleteClient(id);
  }

  @Post('getClients')
  async getClients() {
    return await this.adminService.getClients();
  }
}
