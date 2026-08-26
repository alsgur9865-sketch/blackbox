import { Link, NavLink } from 'react-router-dom';
import { Box, History } from 'lucide-react';

export default function Layout({ children, compact = false }) {
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
            <NavLink to="/reports"><History size={16} /> 복기 기록</NavLink>
            <Link className="button button-sm" to="/diagnosis">무료 진단</Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="container footer-inner">
          <div><strong>BLACKBOX</strong><p>과거 매매를 복기하고 투자 습관을 진단하는 프론트엔드 MVP</p></div>
          <p className="fineprint">본 서비스는 투자자문·종목추천 서비스가 아닙니다. 진단 결과는 학습 및 자기복기를 위한 참고용입니다.</p>
        </div>
      </footer>
    </div>
  );
}
