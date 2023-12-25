import { authenticate } from './../services/login.service';
import express from 'express';
import { loginUser, getCurrentUser } from '../controllers/login.controller';

const router = express.Router();

router.post('/login', loginUser);
router.get('/current-user', authenticate, getCurrentUser);

export default router;