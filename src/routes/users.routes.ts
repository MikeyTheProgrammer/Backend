import express from 'express';
import { userSignUp, getUsers, updateUserRole, bulkUpdateUserRoles   } from '../controllers/users.controller';
import { authenticate } from '../services/login.service'; 

const router = express.Router();

router.post('/signup', userSignUp);
router.get('/getusers', getUsers);
router.patch('/:_id', updateUserRole);
router.post('/bulkUpdateRoles', bulkUpdateUserRoles );



export default router;