// Filename: backend/src/visits/visits.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Visit, VisitDocument } from './schemas/visit.schema';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';

@Injectable()
export class VisitsService {
  constructor(
    @InjectModel(Visit.name) private visitModel: Model<VisitDocument>,
  ) {}

  async create(createVisitDto: CreateVisitDto): Promise<Visit> {
    const createdVisit = new this.visitModel(createVisitDto);
    return createdVisit.save();
  }

  async findAll(): Promise<Visit[]> {
    return this.visitModel.find().populate('patientId').exec();
  }

  async findOne(id: string): Promise<Visit> {
    const visit = await this.visitModel.findById(id).populate('patientId').exec();
    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }
    return visit;
  }

  async findByPatientId(patientId: string): Promise<Visit[]> {
    return this.visitModel.find({ patientId }).populate('patientId').exec();
  }

  async update(id: string, updateVisitDto: UpdateVisitDto): Promise<Visit> {
    const updatedVisit = await this.visitModel
      .findByIdAndUpdate(id, updateVisitDto, { new: true })
      .populate('patientId')
      .exec();
    if (!updatedVisit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }
    return updatedVisit;
  }

  async remove(id: string): Promise<void> {
    const result = await this.visitModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }
  }
}
