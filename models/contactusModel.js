import mongoose from 'mongoose';

const contactUsSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    class: {
      type: String,
    },
    comment: {
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

const contactUsModel = mongoose.model('ContactUs', contactUsSchema);

export default contactUsModel;
