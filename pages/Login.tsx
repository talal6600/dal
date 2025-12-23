import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export const Login: React.FC = () => {
  const { login } = useData();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(username, password);
    setError(ok ? '' : 'بيانات الدخول غير صحيحة');
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: '#f8fafc' }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: 360, padding: 24, borderRadius: 14, background: 'white', border: '1px solid #e2e8f0', display: 'grid', gap: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>تسجيل الدخول</div>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>اسم المستخدم</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: 12, borderRadius: 10, border: '1px solid #cbd5e1' }} />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>كلمة المرور</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: 12, borderRadius: 10, border: '1px solid #cbd5e1' }} />
        </label>
        <button type="submit" style={{ padding: '12px 16px', borderRadius: 10, border: 'none', background: '#0ea5e9', color: 'white', cursor: 'pointer' }}>دخول</button>
        {error && <div style={{ color: '#ef4444', fontSize: 14 }}>{error}</div>}
      </form>
    </div>
  );
};
