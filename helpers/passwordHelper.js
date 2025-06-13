import { hash, compare } from 'bcrypt';

export const hashPassword = async (password) => {
  return await hash(password, 10);
};

export const comparePassword = async (enteredPassword, hashPassword) => {
  return await compare(enteredPassword, hashPassword);
};
