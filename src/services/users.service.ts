import { SignUp } from '../models/users.model';
import User from '../models/users.model';
import bcrypt from 'bcrypt';

export const createUserService = async (signUpData: SignUp) => {
  try {
    const saltRounds = 10; 

    const hashedPassword = await bcrypt.hash(signUpData.password, saltRounds);

    const user = new User({
      name: signUpData.name,
      email: signUpData.email,
      password: hashedPassword, 
    });

    const savedUser = await user.save();

    return {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
    };
  } catch (error) {
    console.error('Error in createUserService:', error);
    throw error;
  }
};

export const getUsersService = async () => {
  const users = await User.find({}, 'name email role');
  return users;
};

export const updateUserRoleService = async (userId: string, role: string) => {
  const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('name email role');
  return updatedUser;
};