import { Request, Response } from 'express';
import { extractGooglePayload, setAuthToken } from '../core/auth';
import User from '../models/users';

export async function login(req: Request, res: Response) {
  const { token } = req.body;

  try {
    const { sub, name } = (await extractGooglePayload(token))!;
    let user = await User.findOne({ identifier: sub });

    if (!user) {
      const createdUser = new User({ name, identifier: sub });
      user = await createdUser.save();
    }

    setAuthToken(res, { identifier: user.identifier });
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
}

export async function getUser(req: Request, res: Response) {
  const user = await User.findOne({ identifier: req.identifier });
  res.json(user);
}