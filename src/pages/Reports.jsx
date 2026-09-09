import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Plus, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { api } from '../services/api';

export default function Reports(){
  const navigate = useNavigate();
  const [reports,setReports] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [deletingId,setDeletingId] = useState('');

  useEffect(()=>{
    let active = true;
    api.getReports().then((result)=>{ if(active) setReports(result.reports || []); }).catch((requestError)=>{ if (!active) return; if (requestError.status === 401) navigate('/login?next=%2Freports',{replace:true}); else setError(requestError.message); }).finally(()=>{ if(active) setLoading(false); });
    return ()=>{ active = false; };
  },[navigate]);

  const remove = async (id) => {
    setDeletingId(id); setError('');
    try { await api.deleteReport(id); setReports((current)=>current.filter((report)=>report.id !== id)); }
    catch (requestError) { if (requestError.status === 401) navigate('/login?next=%2Freports',{replace:true}); else setError(requestError.message); }
    finally { setDeletingId(''); }
  };

  return <Layout compact><section className="page-hero compact-page"><div className="container history-head"><div><span className="eyebrow">SERVER REVIEW HISTORY</span><h1>나의 복기 기록</h1><p>로그인한 계정의 PostgreSQL 리포트를 API로 불러옵니다.</p></div><Button to="/diagnosis"><Plus size={17}/> 새 진단</Button></div></section><section className="section history-section"><div className="container">{error && <div className="inline-error"><AlertCircle size={18}/><span>{error}</span></div>}{loading ? <div className="empty-state"><h2>복기 기록을 불러오는 중...</h2><p>서버에서 계정별 리포트를 조회하고 있습니다.</p></div> : !reports.length ? <EmptyState title="아직 저장된 복기 기록이 없습니다." description="CSV를 업로드해 첫 리포트를 만들어보세요. 결과는 서버 DB에 자동 저장됩니다." /> : <div className="history-list">{reports.map((report)=><article className="history-card" key={report.id}><Link to={`/report/${report.id}`} className="history-main"><div className="history-date">{new Intl.DateTimeFormat('ko-KR',{month:'short',day:'numeric'}).format(new Date(report.createdAt))}</div><div><span>BLACKBOX SCORE</span><strong>{report.score}</strong></div><div className="history-patterns"><span>{report.patterns?.[0]?.name}</span><span>{report.patterns?.[1]?.name}</span></div><ArrowRight size={20}/></Link><button className="icon-button" onClick={()=>remove(report.id)} disabled={deletingId===report.id} aria-label="기록 삭제"><Trash2 size={17}/></button></article>)}</div>}</div></section></Layout>;
}
