import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword, validateName } from '../utils/validation';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const emailErr = validateEmail(form.email); if (emailErr) errs.email = emailErr;
    const passErr = validatePassword(form.password); if (passErr) errs.password = passErr;
    const nameErr = validateName(form.name); if (nameErr) errs.name = nameErr;
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true); setErrors({});
    try { await register(form.email, form.password, form.name); navigate('/'); }
    catch (err) { setErrors({ form: err instanceof Error ? err.message : '회원가입에 실패했습니다' }); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>
        <form onSubmit={handleSubmit} noValidate>
          {errors.form && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm" role="alert">{errors.form}</div>}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input id="name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined} data-testid="register-name" />
            {errors.name && <p id="name-err" className="text-red-500 text-xs mt-1" role="alert">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input id="email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined} data-testid="register-email" />
            {errors.email && <p id="email-err" className="text-red-500 text-xs mt-1" role="alert">{errors.email}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input id="password" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500" aria-invalid={!!errors.password} aria-describedby={errors.password ? 'pass-err' : undefined} data-testid="register-password" />
            {errors.password && <p id="pass-err" className="text-red-500 text-xs mt-1" role="alert">{errors.password}</p>}
            <p className="text-xs text-gray-400 mt-1">8자 이상, 영문+숫자 조합</p>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary-500 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50" data-testid="register-submit">{loading ? '가입 중...' : '회원가입'}</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">이미 계정이 있으신가요? <Link to="/login" className="text-primary-500 font-medium">로그인</Link></p>
      </div>
    </div>
  );
}
