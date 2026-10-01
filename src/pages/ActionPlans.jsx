import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Circle, RefreshCw, Target, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { api } from '../services/api';

function formatDate(value) {
  if (!value) return '-';

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(value));
}

export default function ActionPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [workingId, setWorkingId] = useState('');

  useEffect(() => {
    let active = true;

    api.getActionPlans()
      .then((result) => {
        if (active) setPlans(result.actionPlans || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const activePlans = useMemo(
    () => plans.filter((plan) => plan.status === 'active'),
    [plans]
  );

  const completedPlans = useMemo(
    () => plans.filter((plan) => plan.status === 'completed'),
    [plans]
  );

  const changeStatus = async (plan) => {
    const nextStatus = plan.status === 'completed' ? 'active' : 'completed';

    setWorkingId(plan.id);
    setError('');

    try {
      const result = await api.updateActionPlan(plan.id, nextStatus);

      setPlans((current) =>
        current.map((item) =>
          item.id === plan.id ? result.actionPlan : item
        )
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setWorkingId('');
    }
  };

  const remove = async (id) => {
    setWorkingId(id);
    setError('');

    try {
      await api.deleteActionPlan(id);
      setPlans((current) => current.filter((plan) => plan.id !== id));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setWorkingId('');
    }
  };

  const renderPlan = (plan) => (
    <article className={`action-plan-card ${plan.status === 'completed' ? 'completed' : ''}`} key={plan.id}>
      <div className="action-plan-status-icon">
        {plan.status === 'completed'
          ? <CheckCircle2 size={22}/>
          : <Circle size={22}/>}
      </div>

      <div className="action-plan-body">
        <div className="action-plan-title-row">
          <div>
            <span className="action-plan-state">
              {plan.status === 'completed' ? '완료' : '진행 중'}
            </span>
            <h3>{plan.title}</h3>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={() => remove(plan.id)}
            disabled={workingId === plan.id}
            aria-label="개선 계획 삭제"
          >
            <Trash2 size={17}/>
          </button>
        </div>

        <p>{plan.actionText}</p>

        <div className="action-plan-meta">
          <span>시작 {formatDate(plan.createdAt)}</span>
          {plan.completedAt && <span>완료 {formatDate(plan.completedAt)}</span>}
        </div>

        <button
          type="button"
          className="button button-ghost action-plan-toggle"
          onClick={() => changeStatus(plan)}
          disabled={workingId === plan.id}
        >
          {workingId === plan.id
            ? '처리 중...'
            : plan.status === 'completed'
              ? <><RefreshCw size={16}/> 다시 진행하기</>
              : <><CheckCircle2 size={16}/> 완료하기</>}
        </button>
      </div>
    </article>
  );

  return (
    <Layout compact>
      <section className="page-hero compact-page">
        <div className="container action-plan-hero">
          <div>
            <span className="eyebrow">MISSION 8 · USER FEATURE</span>
            <h1>내 개선 계획</h1>
            <p>
              복기 리포트에서 발견한 행동 문제를 실제 개선 행동으로 저장하고
              완료 여부를 관리합니다.
            </p>
          </div>

          <Button to="/reports">복기 기록 보기</Button>
        </div>
      </section>

      <section className="section action-plan-page">
        <div className="container action-plan-container">
          {error && <div className="inline-error">{error}</div>}

          {loading ? (
            <div className="empty-state">
              <Target size={28}/>
              <h2>개선 계획을 불러오는 중...</h2>
              <p>로그인한 계정의 개선 계획을 서버에서 조회하고 있습니다.</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="empty-state">
              <Target size={30}/>
              <h2>아직 저장된 개선 계획이 없습니다.</h2>
              <p>
                복기 리포트에서 가장 먼저 고치고 싶은 행동을
                내 개선 계획으로 저장해보세요.
              </p>
              <Button to="/reports" size="lg">복기 기록에서 선택하기</Button>
            </div>
          ) : (
            <>
              <div className="action-plan-summary">
                <div>
                  <span>진행 중</span>
                  <strong>{activePlans.length}</strong>
                </div>
                <div>
                  <span>완료</span>
                  <strong>{completedPlans.length}</strong>
                </div>
                <div>
                  <span>전체</span>
                  <strong>{plans.length}</strong>
                </div>
              </div>

              <section className="action-plan-group">
                <div className="action-plan-group-head">
                  <div>
                    <span className="eyebrow">IN PROGRESS</span>
                    <h2>지금 개선 중인 행동</h2>
                  </div>
                  <span>{activePlans.length}개</span>
                </div>

                {activePlans.length ? (
                  <div className="action-plan-list">
                    {activePlans.map(renderPlan)}
                  </div>
                ) : (
                  <div className="action-plan-small-empty">
                    모든 개선 계획을 완료했습니다.
                  </div>
                )}
              </section>

              <section className="action-plan-group completed-group">
                <div className="action-plan-group-head">
                  <div>
                    <span className="eyebrow">COMPLETED</span>
                    <h2>완료한 개선 행동</h2>
                  </div>
                  <span>{completedPlans.length}개</span>
                </div>

                {completedPlans.length ? (
                  <div className="action-plan-list">
                    {completedPlans.map(renderPlan)}
                  </div>
                ) : (
                  <div className="action-plan-small-empty">
                    아직 완료한 개선 계획이 없습니다.
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
