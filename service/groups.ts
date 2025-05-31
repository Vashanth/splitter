import { Request, Response } from 'express';
import Group from '../models/groups';
import UserGroup from '../models/usergroups';
import User from '../models/users';
import Invite from '../models/invites';
import { v4 as uuidv4 } from 'uuid';

export async function createGroup(req: Request, res: Response) {
  try {  
    const group = new Group({ name: req.body.name });
    const createdGroup = await group.save();
    const user = await User.findOne({ identifier: req.identifier });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await UserGroup.create({ user: user._id, group: createdGroup._id });
    await Invite.create({ groupId: createdGroup._id, inviteCode: uuidv4() });

    return res.json(createdGroup);
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export async function getGroups(req: Request, res: Response) {
  const user = await User.findOne({ identifier: req.identifier });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userGroups = await UserGroup.find({ user: user._id }).populate('group', 'name');
  
  return res.json(userGroups);
}

export async function getGroup(req: Request, res: Response) {
  const group = await Group.findOne({ _id: req.params.id });
  const invite = await Invite.findOne({ groupId: group?._id });
  const usersInGroup = await UserGroup.find({ group: group?._id }).populate<{ user: { name: string } }>('user');
  const collatedGroup = {
    ...group?.toObject(),
    inviteCode: invite?.inviteCode,
    users: usersInGroup.map((userGroup) => userGroup.user)
  };

  return res.json(collatedGroup);
}