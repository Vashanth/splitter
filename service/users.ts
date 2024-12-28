import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CLIENT_ID } from '../constants';

const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(CLIENT_ID);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
  }
});

const User = mongoose.model('User', userSchema);

export async function login(req: Request, res: Response) {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, name } = payload; 

    // Check if user exists in the database
    let user = await User.findOne({ googleId: sub });

    if (!user) {
      user = new User({ name, googleId: sub });
      await user.save();
    }

    res.cookie('auth_token', user.id, { 
      httpOnly: true, 
      secure: true, 
      maxAge: 1 * 60 * 60 * 1000,
      sameSite: 'none',
    });
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
}

export async function getUser(req: Request, res: Response) {
  const auth_token = req.headers.cookie?.split(';')
    .find(c => c.trim().startsWith('auth_token='))
    ?.split('=')[1];

  if (!auth_token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await User.findById(auth_token);
  res.json(user);
}