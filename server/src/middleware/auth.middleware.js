import { verifyAuthToken } from '../utils/auth.js';

export function requireAuth(request, response, next) {
  const authorization = request.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  const payload = verifyAuthToken(token);

  if (!payload) {
    return response.status(401).json({ message: 'Unauthorized' });
  }

  request.user = payload;
  return next();
}

