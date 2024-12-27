import { Request, Response } from 'express';
import mongoose from 'mongoose';

const userGroupSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  }
});

const UserGroup = mongoose.model('UserGroup', userGroupSchema);

export async function joinGroup(req: Request, res: Response) {
  try {  
    const userGroup = new UserGroup({ user: req.body.user, group: req.body.group });

    return res.json(await userGroup.save());
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
