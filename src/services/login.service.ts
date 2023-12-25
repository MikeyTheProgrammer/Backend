import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/users.model';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

export const validateLogin = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return user;
};

export const createToken = (user: any) => {
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }
  
    return jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
  };

  export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
    
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
      if (!decoded || !decoded.userId) {
        throw new Error('Invalid token');
      }
    
      req.userId = decoded.userId;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };