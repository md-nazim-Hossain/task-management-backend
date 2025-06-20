import { model, Schema } from 'mongoose';
import { ICategory } from './category.interface';
import { generateUniqueSlug } from '../../../utils/slug-generator';

const categorySchema = new Schema<ICategory, Record<string, unknown>>(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export const Category = model<ICategory>('Category', categorySchema);
