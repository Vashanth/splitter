import express from 'express';
import fs from 'fs';
import groups from './groups';
import transactions from './transactions';
import users from './users';
import usergroups from './usergroups';
import balances from './balances';

const router = express.Router();

// Add body-parser middleware to parse request bodies
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/health', (req, res) => {
  res.send('OK');
});

router.use('/groups', groups);
router.use('/transactions', transactions);
router.use('/users', users);
router.use('/usergroups', usergroups);
router.use('/balances', balances);

export default router;
