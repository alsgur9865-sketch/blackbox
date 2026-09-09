import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Box, History, LogIn, LogOut } from 'lucide-react';
import Button from './Button';
import { api } from '../services/api';
import { clearSession, getUser } from '../utils/auth';

export default function Layout({ children, compact = false }) {
  const [user, setUser] = useState(() => getUser());
  const navigate = useNavigate();

  useEffect(() => {
    const sync = () => setUser(getUser());
    window.addEventListener('blackbox-auth-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('blackbox-auth-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const handleLogout = async () => {
    try { await api.logout(); } catch {}
    clearSession();
    setUser(null);
    navigate('/');
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/" aria-label="BLACKBOX 홈">
            <span className="brand-mark"><Box size={17} /></span>
            <span>BLACKBOX</span>
          </Link>
          <nav className="top-nav" aria-label="주요 메뉴">
            {!compact && <a href="/#how">진단 방식</a>}
            {user && <NavLink to="/reports"><History size={16} /> 복기 기록</NavLink>}
            {user ? <button className="nav-auth" onClick={handleLogout} title={user.email}><LogOut size={15}/> 로그아웃</button> : <NavLink className="nav-auth" to="/login"><LogIn size={15}/> 로그인</NavLink>}
            <Button to="/diagnosis" size="sm">무료 진단</Button>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="container footer-inner">
          <div><strong>BLACKBOX</strong><p>React · Express REST API · Supabase PostgreSQL로 동작하는 풀스택 MVP</p></div>
          <p className="fineprint">본 서비스는 투자자문·종목추천 서비스가 아닙니다. 진단 결과는 학습 및 자기복기를 위한 참고용입니다.</p>
        </div>
      </footer>
    </div>
  );
}
