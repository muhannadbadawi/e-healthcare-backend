import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('doctor')
@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get('getById/:id')
  getDoctorById(@Param('id') id: string) {
    return this.doctorService.getDoctorByUserId(id);
  }

  @Put('editDoctor/:id')
  editDoctor(@Param('id') id: string, @Body() dto: CreateDoctorDto) {
    return this.doctorService.updateDoctor(id, dto);
  }

  @Get('sessionPrice')
  async getSessionPrice(@Req() req: Request) {
    const email = (req.user as any)?.email;
    console.log('req.user: ', req.user);

    const doctor = await this.doctorService.findByEmail(email);
    console.log('doctor: ', doctor);

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return { sessionPrice: doctor.sessionPrice ?? 0 };
  }
  // PATCH request updates only part of the data.
  // PUT request updates the entire data.
  @Patch(':id/session-price')
  async updateSessionPrice(
    @Param('id') doctorId: string,
    @Body('sessionPrice') sessionPrice: number,
  ) {
    console.log('sessionPrice: ', sessionPrice);

    return this.doctorService.updateSessionPrice(doctorId, sessionPrice);
  }
}
