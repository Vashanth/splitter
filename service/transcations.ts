import { Request, Response } from 'express';
import Transaction from '../models/transactions';

export async function addTransaction(req: Request, res: Response) {
  try {  
    const transaction = new Transaction({ 
      amount: req.body.amount, 
      description: req.body.description, 
      date: new Date(), 
      from: req.body.from,
      to: req.body.to
    });
    const createdTransaction = await transaction.save();
  
    return res.json(createdTransaction);
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
