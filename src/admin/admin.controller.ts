import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminService } from './admin.service';
import { CreateDoctorDto } from 'src/doctor/dto/create-doctor.dto';
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post('getCounts')
  async getCounts() {
    return await this.adminService.getCounts();
  }

  @Post('addDoctor')
  async addDoctors(@Body() dto: CreateDoctorDto) {
    return await this.adminService.addDoctor(dto);
  }

  @Post('getDoctors')
  async getDoctors() {
    return await this.adminService.getDoctors();
  }
}
