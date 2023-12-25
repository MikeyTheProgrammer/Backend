import { Request, Response } from 'express';
import { SignUpSchema, SignUp } from '../models/users.model';
import { getUsersService, updateUserRoleService } from '../services/users.service';
import { createUserService } from '../services/users.service';
import User from '../models/users.model'; 
import { BulkOperation } from '../models/tile.model';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

export const userSignUp = async (req: Request, res: Response) => {
  try {
    const signUpData: SignUp = SignUpSchema.parse(req.body);
    const newUser = await createUserService(signUpData);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Invalid data" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsersService();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const userId = req.params._id;
    const { role } = req.body;
    const updatedUser = await updateUserRoleService(userId, role);
    if(updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error });
  }
};


export const bulkUpdateUserRoles = async (req: Request, res: Response) => {
  try {
    const bulkOps: BulkOperation[] = req.body.map((op: any) => {
      if (op.updateOne) {
        return {
          updateOne: {
            filter: { _id: op.updateOne.filter._id }, 
            update: { role: op.updateOne.update.role }, 
            upsert: false,
          },
        };
      }
      throw new Error('Invalid bulk operation');
    });


    const result = await User.bulkWrite(bulkOps as any[]);
    res.json(result);
  } catch (error) {
    console.error("Error in bulkUpdateUserRoles:", error);
    res.status(500).json({ message: 'Error performing bulk user role update', error: (error as Error).message || error });
  }
};
