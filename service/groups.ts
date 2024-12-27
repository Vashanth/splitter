import { Request, Response } from 'express';
import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
});

const Group = mongoose.model('Group', groupSchema);

export async function createGroup(req: Request, res: Response) {
  try {  
    const group = new Group({ name: req.body.name });
    const createdGroup = await group.save();
    return res.json(createdGroup);
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
