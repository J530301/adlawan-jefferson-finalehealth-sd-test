// Filename: backend/src/visits/schemas/visit.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VisitDocument = Visit & Document;

@Schema({ timestamps: true })
export class Visit {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientId: Types.ObjectId;

  @Prop({ required: true })
  visitDate: Date;

  @Prop({ required: true })
  visitType: string;

  @Prop()
  notes: string;

  @Prop()
  followUpDate: Date;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);
