
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { VisitsService } from '../visits/visits.service';
import { CreateVisitDto } from '../visits/dto/create-visit.dto';

@Controller('patients')
@UsePipes(new ValidationPipe())
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly visitsService: VisitsService,
  ) {}

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  async findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientsService.update(id, updatePatientDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.patientsService.remove(id);
  }

  @Get(':id/visits')
  async getPatientVisits(@Param('id') id: string) {
    return this.visitsService.findByPatientId(id);
  }

  @Post(':id/visits')
  async addVisitToPatient(
    @Param('id') patientId: string,
    @Body() createVisitDto: CreateVisitDto,
  ) {
    return this.visitsService.create({ ...createVisitDto, patientId });
  }
}
