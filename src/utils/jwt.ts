import jwt from 'jsonwebtoken';
import config from 'config';
import log from './logger';

export function signJWT(
  object: Object,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options?: jwt.SignOptions | undefined,
) {
  const expiresIn = keyName === 'accessTokenPrivateKey' ? '15m' : '1d';
  const signingKey = config.get<string>(keyName).replace(/\\n/g, '\n') as string;
  log.debug(`Access and Refresh tokens created for: ${JSON.stringify(object)}`);
  // deepcode ignore CopyPasteError: this is a format for spreading an object
  return jwt.sign(object, signingKey, { ...(options && options), algorithm: 'RS256', expiresIn });
}

export function verifyJWT<T>(token: string, keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'): T | null {
  const publicKey = config.get<string>(keyName).replace(/\\n/g, '\n') as string;
  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as T;
    return decoded;
  } catch (e) {
    log.warn(`Token verification failed: ${e}`);
    return null;
  }
}
