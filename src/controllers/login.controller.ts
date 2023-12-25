import { Request, Response } from 'express';
import { validateLogin, createToken } from '../services/login.service';
import User from '../models/users.model'; 


interface RequestWithUserId extends Request {
  userId: string;
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await validateLogin(email, password);
    const token = createToken(user);

    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: 'Login failed' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'User ID not found in the request' });
    }

    const user = await User.findById(req.userId).select('name role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ name: user.name, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};