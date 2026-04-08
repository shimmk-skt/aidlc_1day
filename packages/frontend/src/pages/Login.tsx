import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validation';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    if (emailErr) { setError(emailErr); return; }
    if (!password) { setError('비밀번호를 입력해 주세요'); return; }
    setLoading(true); setError('');
    try { await login(email, password); navigate('/'); }
    catch (err) { setError(err instanceof Error ? err.message : '로그인에 실패했습니다'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>
        <form onSubmit={handleSubmit} noValidate>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm" role="alert">{error}</div>}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent" required aria-invalid={!!error} data-testid="login-email" />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent" required data-testid="login-password" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary-500 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50" data-testid="login-submit">{loading ? '로그인 중...' : '로그인'}</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">계정이 없으신가요? <Link to="/register" className="text-primary-500 font-medium">회원가입</Link></p>
      </div>
    </div>
  );
}
