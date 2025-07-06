
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PatientDocument = Patient & Document;

@Schema({ timestamps: true })
export class Patient {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  dob: Date;

  @Prop({ required: true })
  address: string;

  @Prop()
  emergencyContact: string;

  @Prop()
  medicalHistory: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
