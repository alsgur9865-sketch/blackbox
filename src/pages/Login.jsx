import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, ShieldCheck, UserPlus } from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import FormField from '../components/FormField';
import { api } from '../services/api';
import { getUser, setSession } from '../utils/auth';

function safeNext(value) {
  return value?.startsWith('/') && !value.startsWith('//') ? value : '/reports';
}

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentUser = getUser();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const isRegister = mode === 'register';

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const result = isRegister ? await api.register(email, password) : await api.login(email, password);
      if (result.requiresEmailConfirmation) {
        setInfo(result.message || '이메일 인증 후 로그인해주세요.');
        setMode('login');
        setPassword('');
        return;
      }
      setSession(result);
      navigate(safeNext(searchParams.get('next')), { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode((value) => value === 'login' ? 'register' : 'login');
    setPassword('');
    setError('');
    setInfo('');
  };

  return (
    <Layout compact>
      <section className="auth-page">
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-icon">{isRegister ? <UserPlus size={28} /> : <LogIn size={28} />}</div>
          <span className="eyebrow">MISSION 7 · JWT AUTH</span>
          <h1>{isRegister ? 'BLACKBOX 회원가입' : 'BLACKBOX 로그인'}</h1>
          <p>{isRegister ? 'Supabase Auth가 계정을 만들고 JWT를 발급합니다.' : 'JWT 토큰으로 보호된 리포트 API에 접근합니다.'}</p>
          <FormField label="이메일" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
          <FormField label="비밀번호" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder={isRegister ? '6자 이상' : '비밀번호'} autoComplete={isRegister ? 'new-password' : 'current-password'} required />
          {error && <p className="error-text">{error}</p>}
          {info && <p className="auth-info"><ShieldCheck size={16}/>{info}</p>}
          <Button type="submit" size="lg" className="auth-submit" disabled={loading}>{loading ? '처리 중...' : isRegister ? '회원가입' : '로그인'}</Button>
          <button type="button" className="auth-switch" onClick={switchMode} disabled={loading}>{isRegister ? '이미 계정이 있나요? 로그인' : '계정이 없나요? 회원가입'}</button>
          <div className="auth-note"><ShieldCheck size={16}/><span>리포트 API는 서버에서 JWT 사용자를 검증하고 DB RLS로 본인 데이터만 허용합니다.</span></div>
        </form>
      </section>
    </Layout>
  );
}
