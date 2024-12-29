import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { UserCookieData } from '../types/users';
import { OAuth2Client } from 'google-auth-library';

declare global {
  namespace Express {
    interface Request {
      identifier: string;
    }
  }
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const getAuthToken = (req: Request) => {
  return req.headers.cookie?.split(';')
  .find(c => c.trim().startsWith('auth_token='))
  ?.split('=')[1];
};

export const setAuthToken = (res: Response, user: UserCookieData) => {
  const jwtToken = jwt.sign({ id: user.identifier }, process.env.JWT_SECRET || 'something', { expiresIn: '1h' });
  res.setHeader('Set-Cookie', `auth_token=${jwtToken}; HttpOnly; Secure; SameSite=None; Partitioned; Path=/`);
};

export const decryptAuthToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'something') as { id: string };
};

export const extractGooglePayload = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authToken = getAuthToken(req);
  if (!authToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.identifier = decryptAuthToken(authToken).id;
  next();
};
