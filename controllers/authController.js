// Packages
import expressAsyncHandler from 'express-async-handler';
// Models
import userModel from '../models/userModel.js';
// Helpers
import { comparePassword, hashPassword } from '../helpers/passwordHelper.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../helpers/authHelper.js';

// ------------------------------------------------------------

/**
 * @GET
 * @desc Signup
 * @route /auth/sign-up
 */
export const signup = expressAsyncHandler(async (req, res) => {
  const {
    fname,
    lname,
    username,
    email,
    phoneNumber,
    password,
    dob,
    height,
    weight,
  } = req.body;
  if (!username || !email || !phoneNumber || !password) {
    res.status(400);
    throw new Error(
      'Required fields are missing(username, email, phoneNumber, password)'
    );
  }

  const [emailExists, phooneNumberExists, userNameExists] = await Promise.all([
    userModel.find({ email: email }),
    userModel.find({ phoneNumber: phoneNumber }),
    userModel.find({ username: username }),
  ]);
  if (emailExists.length > 0) {
    res.status(400);
    throw new Error('Email already exists');
  }
  if (phooneNumberExists.length > 0) {
    res.status(400);
    throw new Error('Phone Number already exists');
  }
  if (userNameExists.length > 0) {
    res.status(400);
    throw new Error('User Name already exists');
  }

  const user = await userModel.create({
    fname,
    lname,
    username,
    email,
    phoneNumber,
    password: await hashPassword(password),
    dob,
    height,
    weight,
    role: 'Customer',
  });
  if (!user) {
    res.status(400);
    throw new Error('User not created');
  }

  res.status(200).json({
    success: true,
    message: 'Account created successfully',
  });
});

/**
 * @GET
 * @desc Login
 * @routes /auth/login
 */
export const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Required fields are missing.');
  }

  const query = {
    isDeleted: false,
  };

  query.$or = [{ email: email }, { phoneNumber: email }, { username: email }];

  const user = await userModel.findOne(query);
  if (!user) {
    res.status(404);
    throw new Error('No user found');
  }
  if (user.isDeleted) {
    res.status(400);
    throw new Error(
      'Your account was deleted. Please contact admin for reactivation'
    );
  }

  const { password: pass, ...userData } = user._doc;
  const checkPassword = await comparePassword(password, pass);
  if (!checkPassword) {
    res.status(400);
    throw new Error('Incorrect password');
  }

  const accessToken = generateAccessToken(userData);
  const refreshToken = generateRefreshToken(userData);

  const data = {
    username: userData?.username,
    email: userData?.email,
    phoneNumber: userData?.phoneNumber,
  };

  res.status(200).json({
    success: true,
    message: 'Login Successfull',
    data,
    accessToken,
    refreshToken,
  });
});
