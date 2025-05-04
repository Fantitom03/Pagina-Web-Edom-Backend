import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
  return jwt.sign(
    payload, //_id y role
    process.env.JWT_SECRET, { expiresIn: '1h' });
};