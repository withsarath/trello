import { Schema, model, Document, Types } from 'mongoose';

export interface IBoard extends Document {
  name: string;
  owner: Types.ObjectId;
}

const boardSchema = new Schema<IBoard>(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Board = model<IBoard>('Board', boardSchema);