import express, { Request, Response } from 'express';
import { getUser, login, subscribe } from '../service/users';
import { authMiddleware } from '../core/auth';

const router = express.Router();

router.post('/login', (req: Request, res: Response) => login(req, res));
router.get('/current', authMiddleware, (req: Request, res: Response) => getUser(req, res));
router.post('/subscribe', authMiddleware, (req: Request, res: Response) => subscribe(req, res));

export default router;
