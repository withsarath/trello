import { Schema, model, Document, Types } from 'mongoose';

export interface IList extends Document {
  name: string;
  board: Types.ObjectId;
  order: number;
}

const listSchema = new Schema<IList>(
  {
    name: { type: String, required: true, trim: true },
    board: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const List = model<IList>('List', listSchema);