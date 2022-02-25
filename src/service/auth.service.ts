import { DocumentType } from '@typegoose/typegoose';
import { signJWT } from '../utils/jwt';
import { User } from '../model/user.model';
import SessionModel from '../model/session.model';

export function signAccessToken(user: DocumentType<User>) {
  const payload = user.toJSON();
  const accessToken = signJWT(payload, 'accessTokenPrivateKey');
  return accessToken;
}

export async function createSession({ userId }: { userId: string }) {
  return SessionModel.create({ user: userId });
}

export async function signRefreshToken({ userId }: { userId: string }) {
  const session = await createSession({
    userId,
  });

  const refreshToken = signJWT({ session: session.id }, 'refreshTokenPrivateKey');
  return refreshToken;
}
