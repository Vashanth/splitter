import express from 'express';
import { addTransaction } from '../service/transcations';

const router = express.Router();

router.post('/add', (req, res) => addTransaction(req, res));

export default router;
