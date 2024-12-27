import express, { Request, Response } from 'express';
import { joinGroup } from '../service/usergroups';

const router = express.Router();

router.post('/join', (req: Request, res: Response) => joinGroup(req, res));

export default router;
