import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Trash2, Plus } from 'lucide-react';
import Layout from '../components/Layout';
import { deleteReport, getReports } from '../utils/storage';

export default function Reports(){
  const [reports,setReports]=useState(()=>getReports());
  return <Layout compact><section className="page-hero compact-page"><div className="container history-head"><div><span className="eyebrow">REVIEW HISTORY</span><h1>나의 복기 기록</h1><p>이 브라우저에 저장된 최근 분석 리포트를 다시 확인할 수 있습니다.</p></div><Link to="/diagnosis" className="button"><Plus size={17}/> 새 진단</Link></div></section><section className="section history-section"><div className="container">{!reports.length?<div className="empty-state"><div className="icon-box"><FileText/></div><h2>아직 저장된 복기 기록이 없습니다.</h2><p>샘플 데이터로 첫 리포트를 만들어보세요. 결과는 LocalStorage에 자동 저장됩니다.</p><Link className="button button-lg" to="/diagnosis">첫 진단 시작 <ArrowRight size={18}/></Link></div>:<div className="history-list">{reports.map(report=><article className="history-card" key={report.id}><Link to={`/report/${report.id}`} className="history-main"><div className="history-date">{new Intl.DateTimeFormat('ko-KR',{month:'short',day:'numeric'}).format(new Date(report.createdAt))}</div><div><span>BLACKBOX SCORE</span><strong>{report.score}</strong></div><div className="history-patterns"><span>{report.patterns[0]?.name}</span><span>{report.patterns[1]?.name}</span></div><ArrowRight size={20}/></Link><button className="icon-button" onClick={()=>setReports(deleteReport(report.id))} aria-label="기록 삭제"><Trash2 size={17}/></button></article>)}</div>}</div></section></Layout>;
}
