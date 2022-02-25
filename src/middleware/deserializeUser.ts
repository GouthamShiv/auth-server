import { Request, Response, NextFunction } from 'express';
import log from '../utils/logger';
import { verifyJWT } from '../utils/jwt';

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = (req.headers.authorization || '').replace(/^Bearer\s/, '');

  if (!accessToken) {
    log.debug(`No access token present in header`);
    return next();
  }

  const decode = verifyJWT(accessToken, 'accessTokenPublicKey') as any;

  if (decode) {
    log.debug(`Access token decoded, user: ${JSON.stringify(decode)}`);
    res.locals.user = decode;
  }
  return next();
};

export default deserializeUser;
