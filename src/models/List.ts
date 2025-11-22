import mongoose, { Schema, Document } from 'mongoose';

export interface ICard extends Document {
  title: string;
  description: string;
  listId: mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface IList extends Document {
  name: string;
  boardId: mongoose.Types.ObjectId;
  cards: ICard[];
  createdAt: Date;
}

// Card Schema (Embedded in List or separate, typically separate for flexibility but can be embedded)
// For this assignment, a separate collection is cleaner for updates, but we can also embed.
// Let's use separate collections for List and Card to make CRUD easier.

const CardSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  listId: { type: Schema.Types.ObjectId, ref: 'List', required: true },
  createdAt: { type: Date, default: Date.now },
});

const ListSchema: Schema = new Schema({
  name: { type: String, required: true },
  boardId: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Virtual populate for cards in a list
ListSchema.virtual('cards', {
  ref: 'Card',
  localField: '_id',
  foreignField: 'listId',
});

// Ensure virtuals are included in JSON
ListSchema.set('toJSON', { virtuals: true });
ListSchema.set('toObject', { virtuals: true });

export const Card = mongoose.models.Card || mongoose.model<ICard>('Card', CardSchema);
export const List = mongoose.models.List || mongoose.model<IList>('List', ListSchema);

