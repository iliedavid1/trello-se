import mongoose, { Schema, Document } from 'mongoose';

export interface IBoard extends Document {
  name: string;
  createdAt: Date;
}

const BoardSchema: Schema = new Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Board || mongoose.model<IBoard>('Board', BoardSchema);

