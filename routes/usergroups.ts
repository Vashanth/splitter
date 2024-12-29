import express, { Request, Response } from 'express';
import { joinGroup } from '../service/usergroups';
import { authMiddleware } from '../core/auth';

const router = express.Router();

router.post('/join', authMiddleware, (req: Request, res: Response) => joinGroup(req, res));

export default router;
