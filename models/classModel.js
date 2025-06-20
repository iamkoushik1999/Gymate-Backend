import { Schema, model } from 'mongoose';

const classSchema = Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    trainer: {
      type: Schema.Types.ObjectId,
      ref: 'Trainer',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const classModel = model('Class', classSchema);

export default classModel;
