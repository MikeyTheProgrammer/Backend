import mongoose, { Document } from 'mongoose';
import { z } from 'zod';

const TileSchema = z.object({
  color: z.string({
    required_error: 'Color is required',
    invalid_type_error: 'Color must be a string',
  }).nonempty('Color cannot be empty'),
});

export type TileData = z.infer<typeof TileSchema>;

export interface TileDocument extends Document, TileData {}

const tileMongooseSchema = new mongoose.Schema<TileDocument>({
  color: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value: string) => TileSchema.shape.color.safeParse(value).success,
      message: props => `${props.value} is not a valid color!`
    }
  },
}, {
  timestamps: true, 
});

const Tile = mongoose.model<TileDocument>('Tile', tileMongooseSchema);

export default Tile;

export type BulkOperation =
  | { insertOne: { document: TileData } }
  | { deleteOne: { _id: string } }
  | { updateOne: { _id: string; update: { color: string } } };