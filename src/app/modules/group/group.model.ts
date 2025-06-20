import { model, Schema } from 'mongoose';
import { IGroup } from './group.interface';

const groupSchema = new Schema<IGroup, Record<string, unknown>>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
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

groupSchema.pre('find', function (next) {
  this.populate('members', '+email +fullName +_id +profileImage');
  next();
});

export const Group = model<IGroup>('Group', groupSchema);
