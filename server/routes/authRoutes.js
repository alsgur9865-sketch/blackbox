import { Router } from 'express';
import { HttpError } from '../lib/httpError.js';
import { signInWithPassword, signOut, signUpWithPassword } from '../lib/supabase.js';
import { validateCredentials } from '../lib/validate.js';

const router = Router();

function sessionResponse(data) {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    user: data.user ? { id: data.user.id, email: data.user.email } : null
  };
}

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = validateCredentials(req.body, { register: true });
    const data = await signUpWithPassword(email, password);
    if (data?.access_token) return res.status(201).json(sessionResponse(data));
    return res.status(202).json({ requiresEmailConfirmation: true, user: data?.id ? { id: data.id, email: data.email } : data?.user ? { id: data.user.id, email: data.user.email } : { email }, message: '회원가입 요청이 완료되었습니다. 이메일 인증 후 로그인해주세요.' });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = validateCredentials(req.body);
    const data = await signInWithPassword(email, password);
    res.json(sessionResponse(data));
  } catch (error) {
    if (error.status === 400 && (error.details?.error === 'invalid_grant' || error.details?.code === 'invalid_credentials')) return next(new HttpError(401, '이메일 또는 비밀번호가 올바르지 않습니다.'));
    next(error);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    const [scheme, token] = String(req.headers.authorization || '').split(' ');
    if (scheme === 'Bearer' && token) await signOut(token);
    res.status(204).end();
  } catch (error) {
    if (error.status === 401) return res.status(204).end();
    next(error);
  }
});

export default router;
