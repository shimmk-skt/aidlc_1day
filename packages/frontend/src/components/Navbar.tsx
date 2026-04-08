import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useAIPanel } from '../context/AIPanelContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { toggle } = useAIPanel();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="bg-gradient-to-r from-primary-500 to-purple-600 text-white px-4 py-3 shadow-lg" role="navigation" aria-label="메인 네비게이션">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold tracking-tight" data-testid="nav-logo">✨ Inventrix</Link>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="hover:opacity-80 transition-opacity" data-testid="nav-store">스토어</Link>
            {user && <Link to="/orders" className="hover:opacity-80 transition-opacity" data-testid="nav-orders">주문내역</Link>}
            {user?.role === 'admin' && <Link to="/admin" className="hover:opacity-80 transition-opacity" data-testid="nav-admin">관리자</Link>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative hover:opacity-80" data-testid="nav-cart" aria-label={`장바구니 ${totalItems}개`}>
            🛒{totalItems > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">{totalItems}</span>}
          </Link>
          {user && <button onClick={toggle} className="hover:opacity-80" data-testid="nav-ai" aria-label="AI 어시스턴트">🤖</button>}
          {user ? (
            <>
              <span className="hidden sm:inline bg-white/20 px-3 py-1 rounded-full text-sm">👤 {user.name}</span>
              <button onClick={handleLogout} className="bg-white text-primary-500 px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-100 transition" data-testid="nav-logout">로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-white/20 px-4 py-1 rounded-full text-sm hover:bg-white/30 transition" data-testid="nav-login">로그인</Link>
              <Link to="/register" className="bg-white text-primary-500 px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-100 transition" data-testid="nav-register">회원가입</Link>
            </>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1" aria-label="메뉴 열기" data-testid="nav-hamburger">☰</button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden mt-2 flex flex-col gap-2 px-2 pb-2">
          <Link to="/" onClick={() => setMenuOpen(false)} className="py-2 hover:bg-white/10 rounded px-2">스토어</Link>
          {user && <Link to="/orders" onClick={() => setMenuOpen(false)} className="py-2 hover:bg-white/10 rounded px-2">주문내역</Link>}
          {user?.role === 'admin' && <Link to="/admin" onClick={() => setMenuOpen(false)} className="py-2 hover:bg-white/10 rounded px-2">관리자</Link>}
        </div>
      )}
    </nav>
  );
}
