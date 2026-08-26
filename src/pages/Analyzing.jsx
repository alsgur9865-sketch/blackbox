import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanSearch, CheckCircle2 } from 'lucide-react';
import Layout from '../components/Layout';
import { analyzeInvestment } from '../utils/analyze';
import { clearDraft, getDraft, saveReport } from '../utils/storage';

export default function Analyzing(){
  const navigate=useNavigate(); const [step,setStep]=useState(0);
  useEffect(()=>{
    const draft=getDraft(); if(!draft){navigate('/diagnosis',{replace:true});return;}
    const timers=[setTimeout(()=>setStep(1),500),setTimeout(()=>setStep(2),1050),setTimeout(()=>setStep(3),1550),setTimeout(()=>{
      const result=analyzeInvestment(draft.trades,draft.answers); const id=`report-${Date.now()}`;
      saveReport({id,createdAt:new Date().toISOString(),...result}); clearDraft(); navigate(`/report/${id}`,{replace:true});
    },2150)]; return()=>timers.forEach(clearTimeout);
  },[navigate]);
  const labels=['거래 패턴 읽는 중','손실 행동 비교 중','투자 습관 교차분석 중'];
  return <Layout compact><section className="analysis-screen"><div className="analysis-box"><div className="scan-icon"><ScanSearch size={34}/></div><span className="eyebrow">BLACKBOX ANALYSIS</span><h1>거래 속 반복 신호를 찾고 있어요.</h1><p>입력값에 따라 결과가 달라지는 Rule-based 분석을 실행합니다.</p><div className="analysis-steps">{labels.map((label,i)=><div className={step>i?'done':step===i?'active':''} key={label}>{step>i?<CheckCircle2 size={18}/>:<span>{i+1}</span>}<p>{label}</p></div>)}</div></div></section></Layout>;
}
