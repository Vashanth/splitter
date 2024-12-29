import { Request, Response } from 'express';
import UserGroup from '../models/usergroups';
import User from '../models/users';
import Group from '../models/groups';
import Invite from '../models/invites';

export async function joinGroup(req: Request, res: Response) {
  try {
    const user = await User.findOne({ identifier: req.identifier });
    const invite = await Invite.findOne({ inviteCode: req.body.inviteCode });
    const group = await Group.findOne({ _id: invite?.groupId });

    if (!user || !group) {
      return res.status(404).json({ error: 'User or group not found' });
    }

    const currentUserGroup = await UserGroup.findOne({ user: user._id, group: group._id });

    if (currentUserGroup) {
      return res.status(200).json(currentUserGroup);
    }

    const userGroup = new UserGroup({ user: user._id, group: group._id });

    return res.json(await userGroup.save());
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export async function getGroupUsers(req: Request, res: Response) {}

export default UserGroup;
