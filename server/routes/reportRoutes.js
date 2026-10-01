import { Router } from 'express';
import { HttpError } from '../lib/httpError.js';
import { restRequest } from '../lib/supabase.js';
import { validateReportInput } from '../lib/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { analyzeInvestment } from '../services/analyzeService.js';
import { generateAiReview } from '../services/openaiReviewService.js';

const router = Router();
router.use(requireAuth);

const fields = 'id,score,level,patterns,stats,ai_review,ai_review_model,ai_review_created_at,created_at';
const detailFields = `${fields},trades,answers`;

const toReport = (row) => ({
  id: row.id,
  score: row.score,
  level: row.level,
  patterns: row.patterns,
  stats: row.stats,
  aiReview: row.ai_review,
  aiReviewModel: row.ai_review_model,
  aiReviewCreatedAt: row.ai_review_created_at,
  createdAt: row.created_at
});

router.post('/', async (req, res, next) => {
  try {
    const { trades, answers } = validateReportInput(req.body);
    const result = analyzeInvestment(trades, answers);
    const rows = await restRequest(`reports?select=${fields}`, {
      token: req.accessToken,
      method: 'POST',
      prefer: 'return=representation',
      body: {
        user_id: req.user.id,
        score: result.score,
        level: result.level,
        patterns: result.patterns,
        stats: result.stats,
        trades,
        answers
      }
    });
    if (!rows?.[0]) throw new HttpError(500, '리포트를 저장하지 못했습니다.');
    res.status(201).json({ report: toReport(rows[0]) });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const rows = await restRequest(
      `reports?user_id=eq.${encodeURIComponent(req.user.id)}&select=${fields}&order=created_at.desc&limit=50`,
      { token: req.accessToken }
    );
    res.json({ reports: (rows || []).map(toReport) });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/ai-review', async (req, res, next) => {
  try {
    const rows = await restRequest(
      `reports?id=eq.${encodeURIComponent(req.params.id)}&user_id=eq.${encodeURIComponent(req.user.id)}&select=${detailFields}&limit=1`,
      { token: req.accessToken }
    );

    const report = rows?.[0];
    if (!report) throw new HttpError(404, '리포트를 찾을 수 없습니다.');

    if (report.ai_review) {
      return res.json({
        aiReview: report.ai_review,
        model: report.ai_review_model,
        createdAt: report.ai_review_created_at,
        cached: true
      });
    }

    const { review, model } = await generateAiReview(report);
    const createdAt = new Date().toISOString();

    const updated = await restRequest(
      `reports?id=eq.${encodeURIComponent(req.params.id)}&user_id=eq.${encodeURIComponent(req.user.id)}&select=ai_review,ai_review_model,ai_review_created_at`,
      {
        token: req.accessToken,
        method: 'PATCH',
        prefer: 'return=representation',
        body: {
          ai_review: review,
          ai_review_model: model,
          ai_review_created_at: createdAt
        }
      }
    );

    if (!updated?.[0]) throw new HttpError(500, 'AI 복기 결과를 저장하지 못했습니다.');

    res.status(201).json({
      aiReview: updated[0].ai_review,
      model: updated[0].ai_review_model,
      createdAt: updated[0].ai_review_created_at,
      cached: false
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const rows = await restRequest(
      `reports?id=eq.${encodeURIComponent(req.params.id)}&user_id=eq.${encodeURIComponent(req.user.id)}&select=${fields}&limit=1`,
      { token: req.accessToken }
    );
    if (!rows?.[0]) throw new HttpError(404, '리포트를 찾을 수 없습니다.');
    res.json({ report: toReport(rows[0]) });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const rows = await restRequest(
      `reports?id=eq.${encodeURIComponent(req.params.id)}&user_id=eq.${encodeURIComponent(req.user.id)}&select=id`,
      {
        token: req.accessToken,
        method: 'DELETE',
        prefer: 'return=representation'
      }
    );
    if (!rows?.length) throw new HttpError(404, '리포트를 찾을 수 없습니다.');
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
