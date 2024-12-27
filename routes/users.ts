import express, { Request, Response, NextFunction } from 'express';
import { createUser } from '../service/users';

const router = express.Router();

const checkUserName = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body || !req.body.name) {
    return res.status(400).json({ error: 'User name is required' });
  }
  next();
};

router.post('/', checkUserName, (req: Request, res: Response) => createUser(req, res));

export default router;
