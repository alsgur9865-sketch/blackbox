import { useState } from 'react';
import { ArrowRight, Upload, ScanSearch, FileText, ShieldCheck, BrainCircuit, CheckCircle2, ChevronDown, Users, CreditCard, ClipboardCheck } from 'lucide-react';
import Layout from '../components/Layout';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import Card from '../components/Card';

const patterns = [
  ['FOMO 매수', 74, '급등 이후 뒤늦게 진입하는 패턴'],
  ['손절 지연', 61, '손실 거래를 수익 거래보다 오래 보유'],
  ['정보 과의존', 38, '외부 정보에 의존해 매수 근거가 약해지는 패턴'],
  ['감정적 재진입', 32, '손실 직후 충동적으로 다시 진입하는 패턴']
];

const faqs = [
  ['실제 투자 종목을 추천하나요?', '아니요. BLACKBOX는 과거 매매 행동을 복기하는 자기진단 서비스이며 종목 추천을 제공하지 않습니다.'],
  ['거래내역은 서버에 저장되나요?', 'Mission 6 MVP에서는 서버로 전송하지 않고 현재 브라우저의 상태와 LocalStorage만 사용합니다.'],
  ['CSV가 없어도 체험할 수 있나요?', '네. 진단 화면의 샘플 데이터 버튼으로 전체 흐름을 바로 체험할 수 있습니다.'],
  ['결과는 실제 AI 분석인가요?', '이번 미션에서는 백엔드 없이 동작해야 하므로 Rule-based 분석을 사용하며 다음 미션에서 API로 교체 가능한 구조로 분리했습니다.']
];

export default function Home() {
  const [checked, setChecked] = useState([false,false,false]);
  const [openFaq, setOpenFaq] = useState(0);
  const toggleCheck = (index) => setChecked(prev => prev.map((v,i)=>i===index?!v:v));

  return (
    <Layout>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">AI INVESTMENT REVIEW · FRONTEND MVP</span>
            <h1>내 투자 실수엔<br/><span>패턴이 있다.</span></h1>
            <p>거래내역과 투자 습관을 바탕으로 반복되는 판단 오류를 찾아 이름 붙입니다. 종목 추천이 아닌, 더 나은 의사결정을 위한 투자 복기입니다.</p>
            <div className="hero-actions"><Button to="/diagnosis" size="lg">무료로 진단하기 <ArrowRight size={18}/></Button><Button to="/reports" variant="ghost" size="lg">내 복기 기록</Button></div>
            <div className="trust-row"><ShieldCheck size={16}/><span>실제 주문·계좌 연동 없음 · 브라우저 LocalStorage 저장</span></div>
          </div>
          <div className="hero-report" aria-label="분석 리포트 예시">
            <div className="report-window-head"><span>BLACKBOX FINDING</span><span className="status-dot">SAMPLE</span></div>
            <div className="score-preview"><div><small>BLACKBOX SCORE</small><strong>67</strong></div><span className="risk-badge">주의</span></div>
            <div className="preview-list">{patterns.slice(0,3).map(([name, value]) => <div className="preview-row" key={name}><div><span>{name}</span><b>{value}%</b></div><div className="bar"><i style={{width:`${value}%`}}/></div></div>)}</div>
            <p className="fineprint">* 예시 데이터로 구성된 미리보기입니다.</p>
          </div>
        </div>
      </section>

      <section className="section section-alt"><div className="container"><SectionTitle eyebrow="PROBLEM" title="손실은 기억나는데, 이유는 기억나지 않습니다." description="결과만 보는 대신 어떤 판단이 반복됐는지 구조적으로 복기해야 다음 거래에서 같은 실수를 줄일 수 있습니다." align="center"/><div className="problem-grid">{[['01','왜 샀는지 설명이 안 된다','뉴스나 영상 직후 매수했지만 근거는 남아 있지 않습니다.'],['02','손절 기준이 계속 바뀐다','손실이 커질수록 처음 정한 기준을 뒤로 미룹니다.'],['03','거래가 끝나면 잊는다','결과만 확인하고 판단 과정을 기록하지 않습니다.']].map(([n,t,d])=><Card className="problem-card" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></Card>)}</div></div></section>

      <section id="how" className="section"><div className="container"><SectionTitle eyebrow="HOW IT WORKS" title="3단계면 복기가 시작됩니다." description="백엔드나 증권사 연동 없이도 직접 써볼 수 있도록 샘플 데이터·CSV·브라우저 상태 관리만으로 동작합니다."/><div className="steps-grid">{[[Upload,'STEP 01','거래내역 입력','CSV를 올리거나 준비된 샘플 데이터로 바로 체험합니다.'],[BrainCircuit,'STEP 02','투자 습관 답변','매수 근거·손실 대응·검증 루틴 등 핵심 질문에 답합니다.'],[ScanSearch,'STEP 03','패턴 분석','입력값을 규칙 기반으로 계산해 개인화된 리포트를 생성합니다.']].map(([Icon,step,t,d])=><Card className="step-card" key={step}><div className="icon-box"><Icon size={22}/></div><span>{step}</span><h3>{t}</h3><p>{d}</p></Card>)}</div></div></section>

      <section className="section section-alt"><div className="container"><SectionTitle eyebrow="PATTERN LIBRARY" title="반복되는 실수에 이름을 붙입니다." description="거래 데이터와 설문 답변을 함께 보며 네 가지 행동 신호를 계산합니다."/><div className="pattern-grid">{patterns.map(([name,value,desc])=><Card className="pattern-library-card" key={name}><div className="finding-title"><h3>{name}</h3><strong>{value}%</strong></div><p>{desc}</p><div className="bar large"><i style={{width:`${value}%`}}/></div></Card>)}</div></div></section>

      <section className="section"><div className="container feature-split"><div><SectionTitle eyebrow="SAMPLE REPORT" title="무료 진단에서 이런 결과를 받습니다." description="점수 자체보다 가장 강한 패턴과 다음 행동을 이해하기 쉽게 구조화합니다."/><ul className="check-list">{['BLACKBOX SCORE와 위험 단계','상위 행동 패턴 4개와 근거','다음 거래에서 확인할 교정 행동'].map(x=><li key={x}><CheckCircle2 size={18}/>{x}</li>)}</ul><Button to="/diagnosis">샘플 데이터로 체험 <ArrowRight size={17}/></Button></div><div className="sample-report-card"><div className="report-window-head"><span>BLACKBOX REPORT</span><span>47 TRADES</span></div><div className="sample-finding"><small>FINDING 01</small><h3>뉴스 직후 추격 매수</h3><p>급등 보도 이후 24시간 안에 진입하는 거래가 반복적으로 발견되었습니다.</p></div><div className="sample-finding"><small>NEXT ACTION</small><h3>매수 전 24시간 대기</h3><p>급등 직후에는 진입 근거를 두 줄로 적은 뒤 다음 날 다시 확인하세요.</p></div></div></div></section>

      <section className="section section-alt"><div className="container feature-split"><div><SectionTitle eyebrow="PRE-TRADE CHECKLIST" title="복기 결과를 다음 행동으로 연결합니다." description="체크박스를 직접 눌러보며 실제 서비스의 상호작용을 체험할 수 있습니다."/><div className="interactive-checklist">{['매수 근거를 한 문장으로 쓸 수 있는가?','손절 라인을 매수 전에 정했는가?','지금 급하다고 느끼고 있지는 않은가?'].map((label,i)=><label className={checked[i]?'checked':''} key={label}><input type="checkbox" checked={checked[i]} onChange={()=>toggleCheck(i)}/><span><ClipboardCheck size={18}/>{label}</span></label>)}</div></div><Card className="community-card"><Users size={28}/><span className="eyebrow">COMMUNITY</span><h3>혼자 반성하면 3일이면 끝납니다.</h3><p>복기 결과를 카드 형태로 공유하고 비슷한 패턴을 가진 사람들과 학습하는 확장 흐름을 제안합니다.</p><div className="share-chip">FOMO 매수 · 손절 지연</div></Card></div></section>

      <section className="section"><div className="container"><SectionTitle eyebrow="PRICING" title="먼저 무료로 확인해보세요." description="현재는 결제 없는 프론트엔드 MVP이며 가격 영역은 제품 흐름을 보여주는 Fake Door입니다." align="center"/><div className="pricing-grid"><Card className="pricing-card"><span className="eyebrow">FREE</span><h3>기본 진단</h3><strong>0원</strong><p>거래내역 분석 · 핵심 FINDING · 기본 체크리스트</p><Button to="/diagnosis">무료로 시작</Button></Card><Card className="pricing-card featured"><CreditCard/><span className="eyebrow">DEEP REPORT</span><h3>심층 리포트</h3><strong>9,900원</strong><p>전체 FINDING · 유형별 가이드 · 저장/공유 기능</p><button className="button button-ghost" type="button" onClick={()=>alert('Mission 6 MVP에서는 결제가 진행되지 않습니다.')}>기능 미리보기</button></Card></div></div></section>

      <section className="section section-alt"><div className="container faq-wrap"><SectionTitle eyebrow="FAQ" title="자주 묻는 질문"/><div className="faq-list">{faqs.map(([q,a],i)=><article className={`faq-item ${openFaq===i?'open':''}`} key={q}><button onClick={()=>setOpenFaq(openFaq===i?-1:i)}><span>{q}</span><ChevronDown size={18}/></button>{openFaq===i&&<p>{a}</p>}</article>)}</div></div></section>

      <section className="section final-cta"><div className="container cta-box"><FileText size={30}/><span className="eyebrow">START YOUR REVIEW</span><h2>같은 실수를<br/>세 번째 반복하기 전에.</h2><p>샘플 데이터로 1분 안에 전체 흐름을 체험할 수 있습니다.</p><Button to="/diagnosis" size="lg">무료 진단 시작 <ArrowRight size={18}/></Button></div></section>
    </Layout>
  );
}
