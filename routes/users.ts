import express, { Request, Response, NextFunction } from 'express';
import { getUser, login } from '../service/users';
import { authMiddleware } from '../core/auth';

const router = express.Router();

router.post('/login', (req: Request, res: Response) => login(req, res));
router.get('/current', authMiddleware, (req: Request, res: Response) => getUser(req, res));

export default router;
