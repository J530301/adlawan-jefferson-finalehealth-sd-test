// Filename: backend/src/visits/visits.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';
import { Visit, VisitSchema } from './schemas/visit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Visit.name, schema: VisitSchema }]),
  ],
  controllers: [VisitsController],
  providers: [VisitsService],
  exports: [VisitsService],
})
export class VisitsModule {}
