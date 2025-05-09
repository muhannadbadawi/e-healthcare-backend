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
import { UpdateAdminDto } from './dto/update-admindto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('getCounts')
  getCounts() {
    return this.adminService.getCounts();
  }

  @Post('addDoctor')
  addDoctor(@Body() dto: CreateDoctorDto) {
    return this.adminService.addDoctor(dto);
  }

  @Put('editAdmin/:id')
  editAdmin(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
    return this.adminService.editAdmin(id, dto);
  }

  @Put('editDoctor/:id')
  editDoctor(@Param('id') id: string, @Body() dto: CreateDoctorDto) {
    return this.adminService.editDoctor(id, dto);
  }

  @Post('getDoctors')
  getDoctors() {
    return this.adminService.getDoctors();
  }

  @Post('getClients')
  getClients() {
    return this.adminService.getClients();
  }

  @Delete('deleteDoctor/:id')
  deleteDoctor(@Param('id') id: string) {
    return this.adminService.deleteDoctor(id);
  }

  @Delete('deleteClient/:id')
  deleteClient(@Param('id') id: string) {
    return this.adminService.deleteClient(id);
  }
}
