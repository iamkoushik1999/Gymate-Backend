import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
    },
    lname: {
      type: String,
    },
    image: {
      type: String,
    },
    expertise: {
      type: String,
    },
    description: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    twitter: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    youtube: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamp: true,
    versionKey: false,
  }
);

const trainerModel = mongoose.model('Trainer', trainerSchema);

export default trainerModel;
