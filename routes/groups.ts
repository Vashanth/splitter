import express, { Request, Response, NextFunction } from 'express';
import { createGroup, getGroup, getGroups } from '../service/groups';
import { authMiddleware } from '../core/auth';

const router = express.Router();

const checkGroupName = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body || !req.body.name) {
    return res.status(400).json({ error: 'Group name is required' });
  }
  authMiddleware(req, res, next);
};

router.post('/', checkGroupName, (req: Request, res: Response) => createGroup(req, res));
router.get('/', authMiddleware, (req: Request, res: Response) => getGroups(req, res));
router.get('/:id', authMiddleware, (req: Request, res: Response) => getGroup(req, res));

export default router;
