import express, { Request, Response } from 'express';
import { getBalances } from '../service/balances';
import { authMiddleware } from '../core/auth';

const router = express.Router();

router.get('/groups/:groupId', authMiddleware, (req: Request, res: Response) => getBalances(req, res));

export default router;
