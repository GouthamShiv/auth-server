import { Request, Response, NextFunction } from 'express';
import log from '../utils/logger';
import { verifyJWT } from '../utils/jwt';

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = (req.headers.authorization || '').replace(/^Bearer\s/, '');

  if (!accessToken) {
    log.debug(`No access token present in header for user with Id: ${JSON.stringify(req.body.id || req.params.id)}`);
    return next();
  }

  const decode = verifyJWT(accessToken, 'accessTokenPublicKey') as any;

  if (decode) {
    log.debug(`Access token decoded, user Id: ${JSON.stringify(decode)}`);
    res.locals.user = decode;
  }
  return next();
};

export default deserializeUser;
