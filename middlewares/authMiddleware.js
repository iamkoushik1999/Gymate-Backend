// Packages
import expressAsyncHandler from 'express-async-handler';
// Models
import userModel from '../models/userModel.js';
import { verifyToken } from '../helpers/authHelper.js';

// ------------------------------------------------------------

/**
 * @desc Middleware to check if the user is authenticated
 */
export const isAuthenticated = expressAsyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decode = verifyToken(token);
    req.user = await userModel.findById(decode.id);
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

/**
 * @desc Middleware to check if the user is an admin
 */
export const isAdmin = expressAsyncHandler(async (req, res, next) => {
  if (req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
  next();
});

/**
 * @desc Middleware to check if the user is a customer
 */
export const isCustomer = expressAsyncHandler(async (req, res, next) => {
  if (req.user.role !== 'Customer') {
    res.status(403);
    throw new Error('Not authorized as a customer');
  }
  next();
});
