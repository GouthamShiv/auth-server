import { Request, Response } from 'express';
import { get } from 'lodash';
import { findUserByEmail, findUserById } from '../service/user.service';
import { CreateSessionInput } from '../schema/auth.schema';
import log from '../utils/logger';
import { verifyJWT } from '../utils/jwt';
import { findSessionById, signAccessToken, signRefreshToken } from '../service/auth.service';

export async function createSessionHandler(req: Request<{}, {}, CreateSessionInput>, res: Response) {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  const errMsg = 'Invalid email or password';

  if (!user) {
    log.warn(errMsg);
    return res.json(errMsg);
  }

  if (!user.verified) {
    return res.json('Please verify your email');
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    log.warn(`${errMsg}\nPassword validation failed`);
    return res.json(errMsg);
  }

  const accessToken = signAccessToken(user);
  const refreshToken = await signRefreshToken({ userId: user.id });

  return res.send({
    accessToken,
    refreshToken,
  });
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
  const refreshToken = get(req, 'headers.x-refresh');
  const decoded = verifyJWT<{ session: string }>(refreshToken, 'refreshTokenPublicKey');
  const errMsg = `Could not refresh access token, please login back`;
  const errLog = `Was unable to refresh access token`;

  if (!decoded) {
    log.error(errLog);
    return res.status(401).json(errMsg);
  }

  const session = await findSessionById(decoded.session);

  if (!session || !session.valid) {
    log.error(errLog);
    return res.status(401).json(errMsg);
  }

  const user = await findUserById(String(session.user));
  if (!user) {
    log.error(`${errLog} for ${session}`);
    return res.status(401).json(errMsg);
  }

  const accessToken = signAccessToken(user);
  if (!accessToken) {
    log.error(`${errLog} for ${session}`);
    return res.status(401).json(errMsg);
  }

  return res.json({ accessToken });
}
