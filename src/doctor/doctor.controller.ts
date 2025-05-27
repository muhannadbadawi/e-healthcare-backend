import { Controller,  UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
// import { DoctorService } from './doctor.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('doctor')
@Controller('doctor')
export class DoctorController {
//   constructor(private readonly doctorService: DoctorService) {}


}
