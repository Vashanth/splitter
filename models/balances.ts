import mongoose from 'mongoose';

const balanceSchema = new mongoose.Schema({
  balance: {
    type: Number,
    required: true
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
});

const Balance = mongoose.model('Balance', balanceSchema);

export default Balance;