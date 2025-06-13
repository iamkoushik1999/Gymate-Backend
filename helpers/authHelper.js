// Packages
import jwt from 'jsonwebtoken';
// ENV
const { JWT_SECRET, JWT_EXPIRY_ACCESS, JWT_EXPIRY_REFRESH } = process.env;

// ------------------------------------------------------------

/**
 * @desc Generate Access Token
 * @param {*} user
 * @returns
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRY_ACCESS,
    }
  );
};

/**
 * @desc Generate Refresh Token
 * @param {*} user
 * @returns
 */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRY_REFRESH,
    }
  );
};
/**
 * @desc Verify Token
 * @param {*} token
 * @returns
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
