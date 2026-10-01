import { Router } from 'express';
import { HttpError } from '../lib/httpError.js';
import { restRequest } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const fields = 'id,report_id,pattern_key,title,action_text,status,created_at,completed_at';

function toActionPlan(row) {
  return {
    id: row.id,
    reportId: row.report_id,
    patternKey: row.pattern_key,
    title: row.title,
    actionText: row.action_text,
    status: row.status,
    createdAt: row.created_at,
    completedAt: row.completed_at
  };
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
}

router.post('/', async (req, res, next) => {
  try {
    const reportId = String(req.body?.reportId || '');
    const patternKey = String(req.body?.patternKey || '').trim();

    if (!isUuid(reportId)) throw new HttpError(400, '올바른 리포트 ID가 필요합니다.');
    if (!patternKey || patternKey.length > 60) {
      throw new HttpError(400, '개선할 행동 패턴을 선택해주세요.');
    }

    const reports = await restRequest(
      `reports?id=eq.${encodeURIComponent(reportId)}&user_id=eq.${encodeURIComponent(req.user.id)}&select=id,patterns&limit=1`,
      { token: req.accessToken }
    );

    const report = reports?.[0];
    if (!report) throw new HttpError(404, '리포트를 찾을 수 없습니다.');

    const pattern = Array.isArray(report.patterns)
      ? report.patterns.find((item) => item?.key === patternKey)
      : null;

    if (!pattern) throw new HttpError(400, '리포트에 존재하지 않는 행동 패턴입니다.');

    const rows = await restRequest(`action_plans?select=${fields}`, {
      token: req.accessToken,
      method: 'POST',
      prefer: 'return=representation',
      body: {
        user_id: req.user.id,
        report_id: reportId,
        pattern_key: pattern.key,
        title: pattern.name,
        action_text: pattern.action,
        status: 'active'
      }
    });

    if (!rows?.[0]) throw new HttpError(500, '개선 계획을 저장하지 못했습니다.');
    res.status(201).json({ actionPlan: toActionPlan(rows[0]) });
  } catch (error) {
    if (error.status === 409) {
      return next(new HttpError(409, '이미 이 리포트에서 저장한 개선 계획입니다.'));
    }
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const rows = await restRequest(
      `action_plans?user_id=eq.${encodeURIComponent(req.user.id)}&select=${fields}&order=created_at.desc&limit=100`,
      { token: req.accessToken }
    );
    res.json({ actionPlans: (rows || []).map(toActionPlan) });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    if (!isUuid(req.params.id)) throw new HttpError(400, '올바른 개선 계획 ID가 필요합니다.');

    const status = String(req.body?.status || '');
    if (!['active', 'completed'].includes(status)) {
      throw new HttpError(400, '상태는 active 또는 completed만 사용할 수 있습니다.');
    }

    const rows = await restRequest(
      `action_plans?id=eq.${encodeURIComponent(req.params.id)}&user_id=eq.${encodeURIComponent(req.user.id)}&select=${fields}`,
      {
        token: req.accessToken,
        method: 'PATCH',
        prefer: 'return=representation',
        body: {
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        }
      }
    );

    if (!rows?.[0]) throw new HttpError(404, '개선 계획을 찾을 수 없습니다.');
    res.json({ actionPlan: toActionPlan(rows[0]) });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (!isUuid(req.params.id)) throw new HttpError(400, '올바른 개선 계획 ID가 필요합니다.');

    const rows = await restRequest(
      `action_plans?id=eq.${encodeURIComponent(req.params.id)}&user_id=eq.${encodeURIComponent(req.user.id)}&select=id`,
      {
        token: req.accessToken,
        method: 'DELETE',
        prefer: 'return=representation'
      }
    );

    if (!rows?.length) throw new HttpError(404, '개선 계획을 찾을 수 없습니다.');
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
