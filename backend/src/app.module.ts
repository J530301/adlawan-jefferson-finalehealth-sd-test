import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientsModule } from './patients/patients.module';
import { VisitsModule } from './visits/visits.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://jeff_24:severus6211@patient-management.fgvosrs.mongodb.net/?retryWrites=true&w=majority&appName=patient-management'),
    PatientsModule,
    VisitsModule,
  ],
})
export class AppModule {}
