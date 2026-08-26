import { Link } from 'react-router-dom';
import { ArrowRight, Upload, ScanSearch, FileText, ShieldCheck, BrainCircuit, CheckCircle2, ChevronRight } from 'lucide-react';
import Layout from '../components/Layout';
import SectionTitle from '../components/SectionTitle';

const patterns = [
  ['FOMO 매수', 74, '급등 이후 뒤늦게 진입하는 패턴'],
  ['손절 지연', 61, '손실 거래를 수익 거래보다 오래 보유'],
  ['정보 과의존', 38, '외부 정보에 의존해 매수 근거가 약해지는 패턴']
];

export default function Home() {
  return (
    <Layout>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">AI INVESTMENT REVIEW · FRONTEND MVP</span>
            <h1>내 투자 실수엔<br/><span>패턴이 있다.</span></h1>
            <p>거래내역과 투자 습관을 바탕으로 반복되는 판단 오류를 찾아 이름 붙여드립니다. 종목 추천이 아닌, 더 나은 의사결정을 위한 투자 복기입니다.</p>
            <div className="hero-actions">
              <Link to="/diagnosis" className="button button-lg">무료로 진단하기 <ArrowRight size={18}/></Link>
              <Link to="/reports" className="button button-ghost button-lg">내 복기 기록</Link>
            </div>
            <div className="trust-row"><ShieldCheck size={16}/><span>실제 주문·계좌 연동 없음 · 브라우저 LocalStorage 저장</span></div>
          </div>
          <div className="hero-report" aria-label="분석 리포트 예시">
            <div className="report-window-head"><span>BLACKBOX FINDING</span><span className="status-dot">SAMPLE</span></div>
            <div className="score-preview"><div><small>BLACKBOX SCORE</small><strong>67</strong></div><span className="risk-badge">주의</span></div>
            <div className="preview-list">{patterns.map(([name, value]) => <div className="preview-row" key={name}><div><span>{name}</span><b>{value}%</b></div><div className="bar"><i style={{width:`${value}%`}}/></div></div>)}</div>
            <p className="fineprint">* 예시 데이터로 구성된 미리보기입니다.</p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <SectionTitle eyebrow="WHY BLACKBOX" title="수익률보다 먼저 봐야 할 것은 내 판단입니다." description="손실이 반복될 때 필요한 건 다음 종목이 아니라, 내가 어떤 상황에서 같은 실수를 반복하는지 확인하는 일입니다." align="center" />
          <div className="problem-grid">
            {[["01","오르면 따라 사고","급등 뒤 진입했는데 왜 샀는지는 설명하기 어렵습니다."],["02","내리면 버티고","정해둔 기준 없이 본전이 올 때까지 기다립니다."],["03","끝나면 잊습니다","거래가 끝난 뒤 결과만 보고 판단 과정을 기록하지 않습니다."]].map(([n,t,d])=><article className="card problem-card" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}
          </div>
        </div>
      </section>

      <section id="how" className="section">
        <div className="container">
          <SectionTitle eyebrow="HOW IT WORKS" title="3단계면 복기가 시작됩니다." description="백엔드나 증권사 연동 없이도 직접 써볼 수 있도록, 이번 MVP는 샘플 데이터·CSV·브라우저 상태 관리만으로 동작합니다." />
          <div className="steps-grid">
            {[[Upload,'STEP 01','거래내역 입력','CSV를 올리거나 준비된 샘플 거래내역으로 바로 체험합니다.'],[BrainCircuit,'STEP 02','투자 습관 답변','매수 근거·손실 대응·검증 루틴 등 핵심 질문에 답합니다.'],[ScanSearch,'STEP 03','패턴 분석','입력값을 규칙 기반으로 계산해 개인화된 복기 리포트를 생성합니다.']].map(([Icon,step,t,d])=><article className="step-card" key={step}><div className="icon-box"><Icon size={22}/></div><span>{step}</span><h3>{t}</h3><p>{d}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container feature-split">
          <div>
            <SectionTitle eyebrow="YOUR FINDINGS" title="결과가 아니라 행동 패턴을 보여줍니다." description="거래 결과와 설문 응답을 함께 보면서 반복되는 행동 신호를 우선순위로 정리합니다." />
            <ul className="check-list">{['입력에 따라 결과가 실제로 달라지는 Rule-based 분석','가장 강한 패턴부터 원인과 개선 행동 제시','페이지를 새로고침해도 복기 기록 유지'].map(x=><li key={x}><CheckCircle2 size={18}/>{x}</li>)}</ul>
            <Link className="text-link" to="/diagnosis">내 패턴 확인하기 <ChevronRight size={17}/></Link>
          </div>
          <div className="finding-stack">{patterns.map(([name,value,desc],i)=><article className="finding-card" key={name}><div className="finding-number">0{i+1}</div><div className="finding-body"><div className="finding-title"><h3>{name}</h3><strong>{value}%</strong></div><p>{desc}</p><div className="bar large"><i style={{width:`${value}%`}}/></div></div></article>)}</div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="container cta-box">
          <FileText size={30}/><span className="eyebrow">START YOUR REVIEW</span><h2>이번 거래가 끝나기 전에,<br/>내 판단부터 복기해보세요.</h2><p>샘플 데이터로 1분 안에 전체 흐름을 체험할 수 있습니다.</p><Link to="/diagnosis" className="button button-lg">무료 진단 시작 <ArrowRight size={18}/></Link>
        </div>
      </section>
    </Layout>
  );
}
