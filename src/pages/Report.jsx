import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  History,
  RotateCcw,
  Target
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
  const [savingKey, setSavingKey] = useState('');
  const [savedKeys, setSavedKeys] = useState([]);
  const [planMessage, setPlanMessage] = useState('');

  useEffect(() => {
    let active = true;

    Promise.all([api.getReport(id), api.getActionPlans()])
      .then(([reportResult, planResult]) => {
        if (!active) return;

        setReport(reportResult.report);

        const currentReportKeys = (planResult.actionPlans || [])
          .filter((plan) => plan.reportId === id)
          .map((plan) => plan.patternKey);

        setSavedKeys(currentReportKeys);
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

  const saveActionPlan = async (pattern) => {
    setSavingKey(pattern.key);
    setPlanMessage('');

    try {
      await api.createActionPlan(id, pattern.key);
      setSavedKeys((current) => [...new Set([...current, pattern.key])]);
      setPlanMessage(`"${pattern.name}"을(를) 내 개선 계획에 저장했습니다.`);
    } catch (requestError) {
      if (requestError.status === 401) {
        navigate(`/login?next=${encodeURIComponent(`/report/${id}`)}`, { replace: true });
      } else if (requestError.status === 409) {
        setSavedKeys((current) => [...new Set([...current, pattern.key])]);
        setPlanMessage('이미 저장된 개선 계획입니다.');
      } else {
        setPlanMessage(requestError.message);
      }
    } finally {
      setSavingKey('');
    }
  };

  if (loading) {
    return (
      <Layout compact>
        <section className="analysis-screen">
          <div className="analysis-box">
            <span className="eyebrow">BLACKBOX REPORT</span>
            <h1>리포트를 불러오는 중...</h1>
            <p>서버 DB에서 저장된 분석 결과와 개선 계획을 조회하고 있습니다.</p>
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

            <div className="report-top-actions">
              <Link to="/action-plans" className="button button-ghost">
                <Target size={17}/> 개선 계획
              </Link>
              <Link to="/reports" className="button button-ghost">
                <History size={17}/> 복기 기록
              </Link>
            </div>
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

            {planMessage && (
              <div className="plan-feedback">
                <CheckCircle2 size={18}/>
                <span>{planMessage}</span>
              </div>
            )}

            <div className="pattern-report-list">
              {report.patterns.map((pattern, index) => {
                const isSaved = savedKeys.includes(pattern.key);

                return (
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

                      <div className="action-box action-box-plan">
                        <AlertTriangle size={17}/>
                        <div>
                          <span>NEXT ACTION</span>
                          <p>{pattern.action}</p>
                        </div>

                        <button
                          type="button"
                          className={`plan-save-button ${isSaved ? 'saved' : ''}`}
                          onClick={() => saveActionPlan(pattern)}
                          disabled={isSaved || savingKey === pattern.key}
                        >
                          {isSaved
                            ? '저장됨'
                            : savingKey === pattern.key
                              ? '저장 중...'
                              : '내 개선 계획으로 저장'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <div className="report-actions">
            <Link to="/action-plans" className="button button-lg">
              <Target size={17}/> 내 개선 계획 보기
            </Link>

            <Link to="/diagnosis" className="button button-ghost button-lg">
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
