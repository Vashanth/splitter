import { Request, Response } from 'express';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
});

const User = mongoose.model('User', userSchema);

export async function createUser(req: Request, res: Response) {
  try {  
    const user = new User({ name: req.body.name });
    const createdUser = await user.save();
  
    return res.json(createdUser);
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
