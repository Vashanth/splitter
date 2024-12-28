import { Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, name } = payload;

    // Check if user exists in the database
    let user = await User.findOne({ googleId: sub });

    if (!user) {
      user = new User({ name, googleId: sub });
      await user.save();
    }

    // Create JWT token with user data
    const jwtToken = jwt.sign(
      { 
        id: user.id,
        name: user.name
      },
      process.env.JWT_SECRET || 'something',
      { expiresIn: '1h' }
    );

    res.cookie('auth_token', jwtToken, {
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

  const decoded = jwt.verify(auth_token, process.env.JWT_SECRET || 'something') as { id: string };
  
  const user = await User.findById(decoded.id);
  res.json(user);
}