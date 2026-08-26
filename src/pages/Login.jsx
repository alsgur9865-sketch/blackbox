import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck } from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import FormField from '../components/FormField';
import { getUser, login } from '../utils/auth';

export default function Login() {
  const navigate = useNavigate();
  const currentUser = getUser();
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!validEmail) return setError('올바른 이메일 형식을 입력해주세요.');
    if (password.length < 4) return setError('비밀번호는 4자 이상 입력해주세요.');
    login(email);
    navigate('/reports', { replace: true });
  };

  return (
    <Layout compact>
      <section className="auth-page">
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-icon"><LogIn size={28} /></div>
          <span className="eyebrow">MOCK AUTH</span>
          <h1>BLACKBOX 로그인</h1>
          <p>실제 서버 인증이 아닌 Mission 6용 LocalStorage 로그인 흐름입니다.</p>
          <FormField label="이메일" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          <FormField label="비밀번호" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="4자 이상" autoComplete="current-password" />
          {error && <p className="error-text">{error}</p>}
          <Button type="submit" size="lg" className="auth-submit">로그인</Button>
          <div className="auth-note"><ShieldCheck size={16}/><span>입력값은 이 브라우저에만 저장되며 실제 인증 서버로 전송되지 않습니다.</span></div>
        </form>
      </section>
    </Layout>
  );
}
