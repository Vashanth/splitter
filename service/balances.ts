import { Request, Response } from 'express';
import Balance from '../models/balances';
import User from '../models/users';

export async function getBalances(req: Request, res: Response) {
  try {
    const user = await User.findOne({ identifier: req.identifier });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const balances = await Balance.find({ 
      groupId: req.params.groupId,
      $or: [
        { fromUser: user._id },
        { toUser: user._id }
      ]
    });
    
    if (!balances) {
      return res.status(404).json({ error: 'Balances not found' });
    }
    
    return res.json(balances);
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
