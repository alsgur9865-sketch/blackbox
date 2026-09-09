import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ScanSearch } from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { api } from '../services/api';
import { clearDraft, getDraft } from '../utils/storage';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Analyzing(){
  const navigate = useNavigate();
  const [step,setStep] = useState(0);
  const [error,setError] = useState('');
  const requestRef = useRef(null);

  useEffect(()=>{
    const draft = getDraft();
    if(!draft){ navigate('/diagnosis',{replace:true}); return undefined; }
    if (!requestRef.current) requestRef.current = api.createReport({ trades: draft.trades, answers: draft.answers });
    const timers = [setTimeout(()=>setStep(1),450),setTimeout(()=>setStep(2),900),setTimeout(()=>setStep(3),1350)];
    let active = true;
    Promise.all([requestRef.current, delay(1600)])
      .then(([result]) => { if (!active) return; clearDraft(); navigate(`/report/${result.report.id}`, { replace:true }); })
      .catch((requestError) => { if (!active) return; if (requestError.status === 401) navigate('/login?next=%2Fanalyzing', { replace:true }); else setError(requestError.message); });
    return () => { active = false; timers.forEach(clearTimeout); };
  },[navigate]);

  const labels=['요청 데이터 검증 중','행동 패턴 서버 분석 중','리포트 DB 저장 중'];
  return <Layout compact><section className="analysis-screen"><div className="analysis-box"><div className="scan-icon"><ScanSearch size={34}/></div><span className="eyebrow">BLACKBOX API ANALYSIS</span><h1>{error ? '분석 요청을 완료하지 못했습니다.' : '서버에서 반복 신호를 찾고 있어요.'}</h1><p>{error || 'Express API가 입력값을 검증하고 분석한 뒤 PostgreSQL에 리포트를 저장합니다.'}</p>{error ? <div className="analysis-error"><AlertCircle size={22}/><Button onClick={()=>window.location.reload()}>다시 시도</Button><Button to="/diagnosis" variant="ghost">입력 화면</Button></div> : <div className="analysis-steps">{labels.map((label,i)=><div className={step>i?'done':step===i?'active':''} key={label}>{step>i?<CheckCircle2 size={18}/>:<span>{i+1}</span>}<p>{label}</p></div>)}</div>}</div></section></Layout>;
}
