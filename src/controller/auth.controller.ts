import { Request, Response } from 'express';
import { findUserByEmail } from '../service/user.service';
import { CreateSessionInput } from '../schema/auth.schema';
import log from '../utils/logger';
import { signAccessToken, signRefreshToken } from '../service/auth.service';

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
