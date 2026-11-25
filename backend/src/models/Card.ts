import { Schema, model, Document, Types } from 'mongoose';

export interface ICard extends Document {
  title: string;
  description: string;
  dueDate: string | null;
  labels: string[];
  list: Types.ObjectId;
  order: number;
}

const cardSchema = new Schema<ICard>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    dueDate: { type: String, default: null },
    labels: { type: [String], default: [] },
    list: { type: Schema.Types.ObjectId, ref: 'List', required: true },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const Card = model<ICard>('Card', cardSchema);