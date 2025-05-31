import { Request, Response } from 'express';
import Transaction from '../models/transactions';
import webPush from 'web-push';
import { getUser } from './users';
import User from '../models/users';
import Balance from '../models/balances';

// VAPID keys
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY ?? '',
  privateKey: process.env.VAPID_PRIVATE_KEY ?? '',
};

webPush.setVapidDetails(
  'mailto:vashanth.sa@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function addTransaction(req: Request, res: Response) {
  try {  
    const transaction = new Transaction({ 
      amount: req.body.amount, 
      name: req.body.name, 
      date: new Date(), 
      from: req.body.from,
      splits: req.body.splits,
      groupId: req.body.groupId
    });
    const createdTransaction = await transaction.save();
    const populatedTransaction = await Transaction.findById(createdTransaction._id).populate('splits.user', 'name');
    const splitUserIds = (populatedTransaction?.splits ?? []).map((split) => split.user?._id);

    const splitUsersNotificationSubscriptions = await User
      .find({ _id: { $in: splitUserIds } })
      .select('subscription');

    for (const userNotification of splitUsersNotificationSubscriptions) {
      if (userNotification?.subscription) {
        await webPush.sendNotification(userNotification.subscription, 'New transaction added');
      }
    }

    const balances = await Balance.find({ groupId: req.body.groupId });

    for (const split of req.body.splits) {
      const actualTransactionFrom = req.body.from;
      const actualSplitUser = split.user;
      const { fromUser, toUser } = actualTransactionFrom < actualSplitUser ? 
        { fromUser: actualTransactionFrom, toUser: actualSplitUser } : 
        { fromUser: actualSplitUser, toUser: actualTransactionFrom };

      if (fromUser === toUser || !split.share) {
        continue;
      }

      const fromToUserBalance = balances.find((balance) =>  balance.fromUser.toString() === fromUser && balance.toUser.toString() === toUser);
      const absoluteBalance = fromUser === actualTransactionFrom ? split.share : -split.share;

      if (fromToUserBalance) {
        fromToUserBalance.balance += absoluteBalance;
      } else {
        await Balance.create({
          balance: absoluteBalance,
          fromUser: fromUser,
          toUser: toUser,
          groupId: req.body.groupId
        });
      }
     
      await fromToUserBalance?.save();
    }
  
    return res.json({
      transaction: populatedTransaction,
      balances
    });
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export async function getTransactions(req: Request, res: Response) {
  const transactions = await Transaction.find({ groupId: req.params.groupId }).populate('splits.user', 'name').limit(100);
  return res.json(transactions);
}

export async function deleteTransaction(req: Request, res: Response) {
  const transaction = await Transaction.findByIdAndDelete(req.params.transactionId);

  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  const usersInvolvedInTransaction = (transaction?.splits ?? []).map((split) => split.user?._id);
  const userNotificationSubscriptions = await User.find({ _id: { $in: usersInvolvedInTransaction } }).select('subscription');

  for (const userNotification of userNotificationSubscriptions) {
    if (userNotification?.subscription) {
      await webPush.sendNotification(userNotification.subscription, 'Transaction deleted');
    }
  }

  const balances = await Balance.find({ groupId: transaction.groupId });

  for (const split of transaction.splits) {
    const actualTransactionFrom = transaction.from.toString();
    const actualSplitUser = split.user.toString();
    const { fromUser, toUser } = actualTransactionFrom < actualSplitUser ? 
      { fromUser: actualTransactionFrom, toUser: actualSplitUser } : 
      { fromUser: actualSplitUser, toUser: actualTransactionFrom };

    if (fromUser === toUser || !split.share) {
      continue;
    }

    const fromToUserBalance = balances.find((balance) =>  fromUser === balance.fromUser.toString() && toUser === balance.toUser.toString());

    if (fromToUserBalance) {
      const absoluteBalance = fromUser === actualTransactionFrom ? split.share : -split.share;
      fromToUserBalance.balance -= absoluteBalance;
    }

    if (fromToUserBalance?.balance === 0) {
      await Balance.findByIdAndDelete(fromToUserBalance._id);
    } else {
      await fromToUserBalance?.save();
    }
  }

  return res.json({
    transaction,
    balances
  });
}