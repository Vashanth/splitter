import express, { Request, Response, NextFunction } from 'express';
import { createGroup } from '../service/groups';

const router = express.Router();

const checkGroupName = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body || !req.body.name) {
    return res.status(400).json({ error: 'Group name is required' });
  }
  next();
};

router.post('/', checkGroupName, (req: Request, res: Response) => createGroup(req, res));

export default router;
