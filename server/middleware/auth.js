import { HttpError } from '../lib/httpError.js';
import { getAuthUser } from '../lib/supabase.js';

export async function requireAuth(req, _res, next) {
  try {
    const [scheme, token] = String(req.headers.authorization || '').split(' ');
    if (scheme !== 'Bearer' || !token) throw new HttpError(401, '로그인이 필요합니다.');
    const user = await getAuthUser(token);
    if (!user?.id) throw new HttpError(401, '로그인 정보를 확인할 수 없습니다.');
    req.accessToken = token;
    req.user = { id: user.id, email: user.email };
    next();
  } catch (error) {
    if (error.status === 401 || error.status === 403) return next(new HttpError(401, '로그인 정보가 만료되었거나 올바르지 않습니다.'));
    return next(error);
  }
}
