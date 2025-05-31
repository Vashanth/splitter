import express from 'express';
import { addTransaction, deleteTransaction, getTransactions } from '../service/transcations';
import { authMiddleware } from '../core/auth';

const router = express.Router();

router.post('/add', authMiddleware, (req, res) => addTransaction(req, res));
router.get('/groups/:groupId', authMiddleware, (req, res) => getTransactions(req, res));
router.delete('/:transactionId', authMiddleware, (req, res) => deleteTransaction(req, res));

export default router;
