import { useMemo } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, History, RotateCcw, AlertTriangle, BarChart3 } from 'lucide-react';
import Layout from '../components/Layout';
import { getReport } from '../utils/storage';

export default function Report(){
  const {id}=useParams(); const report=useMemo(()=>getReport(id),[id]);
  if(!report) return <Navigate to="/reports" replace/>;
  const date=new Intl.DateTimeFormat('ko-KR',{year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(report.createdAt));
  return <Layout compact><section className="report-page"><div className="container report-container"><div className="report-top"><div><span className="eyebrow">BLACKBOX REPORT</span><h1>투자 복기 리포트</h1><p>{date}</p></div><Link to="/reports" className="button button-ghost"><History size={17}/> 복기 기록</Link></div>
    <div className="score-card"><div><span>BLACKBOX SCORE</span><strong>{report.score}</strong><small>/ 100</small></div><div className={`level level-${report.level==='안정'?'safe':report.level==='주의'?'warn':'risk'}`}>{report.level}</div><p>점수는 수익 가능성이 아니라, 이번 입력에서 발견된 행동 위험 신호의 강도를 반대로 환산한 자기복기 지표입니다.</p></div>
    <div className="stats-grid">{[['분석 거래',`${report.stats.tradeCount}건`],['손실 거래',`${report.stats.lossCount}건`],['급등 후 진입',`${report.stats.chaseCount}건`],['손실 평균 보유',`${report.stats.avgLossHold}일`]].map(([a,b])=><div className="stat-card" key={a}><span>{a}</span><strong>{b}</strong></div>)}</div>
    <section className="report-section"><div className="report-section-head"><div><span className="eyebrow">TOP FINDINGS</span><h2>가장 강하게 발견된 패턴</h2></div><BarChart3/></div><div className="pattern-report-list">{report.patterns.map((p,i)=><article className="pattern-report" key={p.key}><div className="pattern-rank">0{i+1}</div><div className="pattern-report-body"><div className="pattern-heading"><h3>{p.name}</h3><strong>{p.score}%</strong></div><div className="bar large"><i style={{width:`${p.score}%`}}/></div><p>{p.desc}</p><div className="action-box"><AlertTriangle size={17}/><div><span>NEXT ACTION</span><p>{p.action}</p></div></div></div></article>)}</div></section>
    <div className="report-actions"><Link to="/diagnosis" className="button button-lg"><RotateCcw size={17}/> 다시 진단하기</Link><Link to="/" className="button button-ghost button-lg"><ArrowLeft size={17}/> 홈으로</Link></div>
  </div></section></Layout>;
}
