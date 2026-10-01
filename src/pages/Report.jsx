import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  History,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { api } from '../services/api';

export default function Report() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    let active = true;

    api.getReport(id)
      .then((result) => {
        if (active) setReport(result.report);
      })
      .catch((requestError) => {
        if (!active) return;
        if (requestError.status === 401) {
          navigate(`/login?next=${encodeURIComponent(`/report/${id}`)}`, { replace: true });
        } else {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, navigate]);

  const createAiReview = async () => {
    setAiLoading(true);
    setAiError('');

    try {
      const result = await api.generateAiReview(id);
      setReport((current) => ({
        ...current,
        aiReview: result.aiReview,
        aiReviewModel: result.model,
        aiReviewCreatedAt: result.createdAt
      }));
    } catch (requestError) {
      if (requestError.status === 401) {
        navigate(`/login?next=${encodeURIComponent(`/report/${id}`)}`, { replace: true });
      } else {
        setAiError(requestError.message);
      }
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout compact>
        <section className="analysis-screen">
          <div className="analysis-box">
            <span className="eyebrow">BLACKBOX REPORT</span>
            <h1>리포트를 불러오는 중...</h1>
            <p>서버 DB에서 저장된 분석 결과를 조회하고 있습니다.</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !report) {
    return (
      <Layout compact>
        <section className="analysis-screen">
          <div className="analysis-box">
            <span className="eyebrow">REPORT ERROR</span>
            <h1>리포트를 표시할 수 없습니다.</h1>
            <p>{error || '리포트를 찾을 수 없습니다.'}</p>
            <Button to="/reports">복기 기록으로 돌아가기</Button>
          </div>
        </section>
      </Layout>
    );
  }

  const date = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(report.createdAt));

  return (
    <Layout compact>
      <section className="report-page">
        <div className="container report-container">
          <div className="report-top">
            <div>
              <span className="eyebrow">BLACKBOX SERVER REPORT</span>
              <h1>투자 복기 리포트</h1>
              <p>{date}</p>
            </div>
            <Link to="/reports" className="button button-ghost">
              <History size={17}/> 복기 기록
            </Link>
          </div>

          <div className="score-card">
            <div>
              <span>BLACKBOX SCORE</span>
              <strong>{report.score}</strong>
              <small>/ 100</small>
            </div>
            <div className={`level level-${report.level === '안정' ? 'safe' : report.level === '주의' ? 'warn' : 'risk'}`}>
              {report.level}
            </div>
            <p>
              점수는 수익 가능성이 아니라 서버 분석에서 발견된 행동 위험 신호의
              강도를 반대로 환산한 자기복기 지표입니다.
            </p>
          </div>

          <div className="stats-grid">
            {[
              ['분석 거래', `${report.stats.tradeCount}건`],
              ['손실 거래', `${report.stats.lossCount}건`],
              ['급등 후 진입', `${report.stats.chaseCount}건`],
              ['손실 평균 보유', `${report.stats.avgLossHold}일`]
            ].map(([label, value]) => (
              <div className="stat-card" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <section className="report-section">
            <div className="report-section-head">
              <div>
                <span className="eyebrow">TOP FINDINGS</span>
                <h2>가장 강하게 발견된 패턴</h2>
              </div>
              <BarChart3/>
            </div>

            <div className="pattern-report-list">
              {report.patterns.map((pattern, index) => (
                <article className="pattern-report" key={pattern.key}>
                  <div className="pattern-rank">0{index + 1}</div>
                  <div className="pattern-report-body">
                    <div className="pattern-heading">
                      <h3>{pattern.name}</h3>
                      <strong>{pattern.score}%</strong>
                    </div>
                    <div className="bar large">
                      <i style={{ width: `${pattern.score}%` }}/>
                    </div>
                    <p>{pattern.desc}</p>
                    <div className="action-box">
                      <AlertTriangle size={17}/>
                      <div>
                        <span>NEXT ACTION</span>
                        <p>{pattern.action}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="ai-review-section">
            <div className="ai-review-head">
              <div>
                <span className="eyebrow">MISSION 8 · OPENAI</span>
                <h2>AI 심층 복기 코치</h2>
                <p>
                  기존 Rule 기반 점수는 그대로 두고, 익명화된 행동 데이터만
                  OpenAI가 추가 해석합니다.
                </p>
              </div>
              <div className="ai-orb"><Sparkles size={24}/></div>
            </div>

            {report.aiReview ? (
              <div className="ai-review-result">
                <div className="ai-summary">
                  <span>이번 거래 행동 한줄 복기</span>
                  <p>{report.aiReview.summary}</p>
                </div>

                <div className="ai-insights">
                  {report.aiReview.insights?.map((insight, index) => (
                    <article key={`${insight.title}-${index}`}>
                      <b>0{index + 1}</b>
                      <div>
                        <h3>{insight.title}</h3>
                        <p>{insight.evidence}</p>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="ai-actions">
                  <span>NEXT REVIEW CHECKLIST</span>
                  {report.aiReview.actionPlan?.map((action, index) => (
                    <div key={`${action}-${index}`}>
                      <CheckCircle2 size={17}/>
                      <p>{action}</p>
                    </div>
                  ))}
                </div>

                <p className="ai-disclaimer">{report.aiReview.disclaimer}</p>
                <p className="ai-meta">
                  Model: {report.aiReviewModel || 'OpenAI'} · 저장된 AI 복기 결과
                </p>
              </div>
            ) : (
              <div className="ai-review-empty">
                <Sparkles size={30}/>
                <h3>기본 분석을 AI가 한 번 더 복기합니다.</h3>
                <p>
                  종목명과 실제 가격은 보내지 않고 손익률·보유기간·정보출처·행동
                  패턴만 익명화해 전달합니다.
                </p>
                <Button onClick={createAiReview} disabled={aiLoading}>
                  {aiLoading ? 'AI 복기 생성 중...' : 'AI 심층 복기 생성'}
                </Button>
              </div>
            )}

            {aiLoading && (
              <div className="ai-loading">
                <span/>
                <p>OpenAI가 행동 패턴의 근거와 다음 체크리스트를 정리하고 있습니다.</p>
              </div>
            )}

            {aiError && (
              <div className="ai-review-error">
                <AlertTriangle size={18}/>
                <div>
                  <strong>AI 복기를 생성하지 못했습니다.</strong>
                  <p>{aiError} 기존 BLACKBOX 리포트는 그대로 유지됩니다.</p>
                  <Button onClick={createAiReview} variant="ghost" size="sm">
                    다시 시도
                  </Button>
                </div>
              </div>
            )}
          </section>

          <div className="report-actions">
            <Link to="/diagnosis" className="button button-lg">
              <RotateCcw size={17}/> 다시 진단하기
            </Link>
            <Link to="/" className="button button-ghost button-lg">
              <ArrowLeft size={17}/> 홈으로
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
