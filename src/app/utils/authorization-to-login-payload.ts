import { JwtPayload } from '../auth/dto/jwt-payload.dto';

export const authorizationToLoginPayload = (authorization: string): JwtPayload | undefined => {
  if (!authorization) return undefined;

  const authorizationSplitted = authorization.split('.');

  if (authorizationSplitted.length < 3 || !authorizationSplitted[1]) {
    return undefined;
  }

  return JSON.parse(Buffer.from(authorizationSplitted[1], 'base64').toString('ascii'));
};
