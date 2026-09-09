import { HttpError } from '../lib/httpError.js';

export function notFound(req, _res, next) {
  next(new HttpError(404, `API 경로를 찾을 수 없습니다: ${req.method} ${req.path}`));
}

export function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;
  if (status >= 500) console.error(error);
  res.status(status).json({ message: error.message || '요청을 처리하지 못했습니다.' });
}
