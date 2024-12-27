import express from 'express';
import groups from './groups';
import transactions from './transactions';
import users from './users';
import usergroups from './usergroups';

const router = express.Router();

// Add body-parser middleware to parse request bodies
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/groups', groups);
router.use('/transactions', transactions);
router.use('/users', users);
router.use('/usergroups', usergroups);

export default router;
