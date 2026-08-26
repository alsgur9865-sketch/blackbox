import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Database, AlertCircle, CheckCircle2, Trash2, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import { sampleTrades } from '../data/sampleTrades';
import { saveDraft } from '../utils/storage';

const initialAnswers = { experience:'', tradeFrequency:'', buyReason:'', lossResponse:'', checkRoutine:'', entryStyle:'' };
const requiredColumns = ['symbol','buyPrice','sellPrice','preRisePct','holdingDays','source'];
const numericColumns = ['buyPrice','sellPrice','preRisePct','holdingDays'];

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) throw new Error('헤더와 1개 이상의 거래 행이 필요합니다.');
  const headers = lines[0].split(',').map(v => v.trim());
  const missing = requiredColumns.filter(key => !headers.includes(key));
  if (missing.length) throw new Error(`필수 컬럼이 없습니다: ${missing.join(', ')}`);

  return lines.slice(1).map((line, index) => {
    const values = line.split(',').map(v => v.trim());
    if (values.length !== headers.length) throw new Error(`${index + 2}번째 행의 컬럼 수가 올바르지 않습니다.`);
    const row = Object.fromEntries(headers.map((h,i)=>[h,values[i]]));
    numericColumns.forEach(k => { row[k] = Number(row[k]); });
    if (!row.symbol || !row.source || numericColumns.some(key => !Number.isFinite(row[key]))) {
      throw new Error(`${index + 2}번째 행의 값이 올바르지 않습니다.`);
    }
    if (row.buyPrice <= 0 || row.sellPrice <= 0 || row.holdingDays < 0) {
      throw new Error(`${index + 2}번째 행에 허용되지 않는 숫자 값이 있습니다.`);
    }
    return row;
  });
}

const questions = [
  ['experience','투자 경험은 어느 정도인가요?',[['under1','1년 미만'],['1to3','1~3년'],['over3','3년 이상']]],
  ['tradeFrequency','평균 매매 빈도는 어떤가요?',[['monthly','월 1~3회'],['weekly','주 1~3회'],['daily','거의 매일']]],
  ['buyReason','주로 무엇을 근거로 매수하나요?',[['analysis','직접 분석'],['news','뉴스·공시'],['social','유튜브·커뮤니티·주변 추천']]],
  ['lossResponse','손실이 커지면 보통 어떻게 대응하나요?',[['cut','정한 기준에서 손절'],['hold','본전까지 기다림'],['averageDown','추가 매수하는 편']]],
  ['checkRoutine','매수 전 근거를 다시 확인하나요?',[['always','항상 체크리스트로 확인'],['sometimes','가끔 확인'],['rare','거의 확인하지 않음']]],
  ['entryStyle','급등 종목을 보면 어떤 편인가요?',[['wait','기다렸다가 판단'],['momentum','추세를 보고 빠르게 진입'],['impulse','놓칠까 봐 즉시 진입']]]
];

export default function Diagnosis() {
  const navigate = useNavigate();
  const [trades,setTrades] = useState([]);
  const [fileName,setFileName] = useState('');
  const [fileError,setFileError] = useState('');
  const [answers,setAnswers] = useState(initialAnswers);
  const [submitted,setSubmitted] = useState(false);
  const completeCount = useMemo(()=>Object.values(answers).filter(Boolean).length,[answers]);

  const useSample = () => { setTrades(sampleTrades); setFileName('BLACKBOX_sample_trades.csv'); setFileError(''); };
  const onFile = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) return setFileError('CSV 파일만 업로드할 수 있습니다.');
    try { const parsed = parseCSV(await file.text()); setTrades(parsed); setFileName(file.name); setFileError(''); }
    catch(e){ setTrades([]); setFileName(''); setFileError(e.message); }
  };
  const submit = () => {
    setSubmitted(true);
    if (!trades.length || completeCount < questions.length) return;
    saveDraft({ trades, answers, createdAt: new Date().toISOString() });
    navigate('/analyzing');
  };

  return <Layout compact>
    <section className="page-hero compact-page"><div className="narrow"><span className="eyebrow">FREE DIAGNOSIS</span><h1>내 투자 패턴 진단하기</h1><p>거래 데이터와 6개의 짧은 질문을 바탕으로 브라우저에서 직접 분석합니다.</p><div className="progress-shell"><div style={{width:`${(Number(Boolean(trades.length))+completeCount/questions.length)/2*100}%`}}/></div></div></section>
    <section className="section form-section"><div className="narrow">
      <div className="form-block"><div className="form-block-head"><span>STEP 01</span><h2>거래내역을 준비해주세요.</h2><p>CSV를 업로드하거나 샘플 데이터로 바로 체험할 수 있습니다.</p></div>
        {!trades.length ? <Card className="upload-panel"><UploadCloud size={30}/><h3>CSV 파일 업로드</h3><p>필수 컬럼: {requiredColumns.join(', ')}</p><label className="button button-ghost file-button">파일 선택<input type="file" accept=".csv,text/csv" onChange={e=>onFile(e.target.files?.[0])}/></label><div className="or"><span/>또는<span/></div><Button onClick={useSample}><Database size={17}/> 샘플 데이터 사용</Button>{fileError && <p className="error-text"><AlertCircle size={16}/>{fileError}</p>}{submitted && !trades.length && <p className="error-text"><AlertCircle size={16}/>거래내역을 먼저 준비해주세요.</p>}</Card> :
        <div className="data-ready"><div><CheckCircle2/><div><strong>{fileName}</strong><p>{trades.length}건의 거래가 준비되었습니다.</p></div></div><button className="icon-button" onClick={()=>{setTrades([]);setFileName('')}} aria-label="거래 데이터 삭제"><Trash2 size={18}/></button></div>}
      </div>

      <div className="form-block"><div className="form-block-head"><span>STEP 02 · {completeCount}/{questions.length}</span><h2>평소 투자 습관을 알려주세요.</h2><p>정답은 없습니다. 평소 행동에 가장 가까운 항목을 선택해주세요.</p></div><div className="question-list">{questions.map(([key,title,options],idx)=><fieldset className={`question-card ${submitted&&!answers[key]?'invalid':''}`} key={key}><legend><span>Q{idx+1}</span>{title}</legend><div className="option-grid">{options.map(([value,label])=><label className={`choice ${answers[key]===value?'selected':''}`} key={value}><input type="radio" name={key} value={value} checked={answers[key]===value} onChange={()=>setAnswers(prev=>({...prev,[key]:value}))}/><span>{label}</span></label>)}</div>{submitted&&!answers[key]&&<p className="error-text"><AlertCircle size={14}/>항목을 선택해주세요.</p>}</fieldset>)}</div></div>
      <div className="submit-zone"><p>입력한 데이터는 서버로 전송되지 않고 이 브라우저에서만 사용됩니다.</p><Button size="lg" onClick={submit}>내 투자 패턴 분석하기 <ArrowRight size={18}/></Button></div>
    </div></section>
  </Layout>;
}
