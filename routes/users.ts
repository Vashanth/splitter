import express, { Request, Response, NextFunction } from 'express';
import { getUser, login } from '../service/users';

const router = express.Router();

router.post('/login', (req: Request, res: Response) => login(req, res));
router.get('/current', (req: Request, res: Response) => getUser(req, res));

export default router;
