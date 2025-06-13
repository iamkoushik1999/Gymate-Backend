import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    fname: {
      type: String,
    },
    lname: {
      type: String,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
    },
    dob: {
      type: String,
    },
    height: {
      type: String,
    },
    weight: {
      type: String,
    },
    role: {
      type: String,
      enum: ['Admin', 'Customer'],
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

const userModel = mongoose.model('User', userSchema);
export default userModel;
