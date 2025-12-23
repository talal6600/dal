import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { User } from '../types';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, users, addUser, deleteUser, exportData, importData, syncToCloud, syncFromCloud, isSyncing } = useData();
  const [name, setName] = useState(settings.name);
  const [weeklyTarget, setWeeklyTarget] = useState(settings.weeklyTarget);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ username: '', password: '', name: '', role: 'user' });
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState('');

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ name, weeklyTarget });
    setMessage('تم حفظ الإعدادات');
  };

  const addNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password) return;
    addUser(newUser);
    setNewUser({ username: '', password: '', name: '', role: 'user' });
  };

  const importDataHandler = () => {
    const ok = importData(importText);
    setMessage(ok ? 'تم الاستيراد بنجاح' : 'فشل الاستيراد');
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <section style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>إعدادات الحساب</div>
        <form onSubmit={saveSettings} style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>الاسم</span>
            <input value={name} onChange={(e) => setName(e.target.value)} style={{ padding: 10, borderRadius: 10, border: '1px solid #cbd5e1' }} />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>الهدف الأسبوعي (ريال)</span>
            <input type="number" min={0} value={weeklyTarget} onChange={(e) => setWeeklyTarget(Number(e.target.value))} style={{ padding: 10, borderRadius: 10, border: '1px solid #cbd5e1' }} />
          </label>
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <button type="submit" style={{ padding: '12px 16px', borderRadius: 10, border: 'none', background: '#0ea5e9', color: 'white', cursor: 'pointer' }}>حفظ</button>
          </div>
        </form>
        {message && <div style={{ marginTop: 8, color: '#0ea5e9' }}>{message}</div>}
      </section>

      <section style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>إدارة المستخدمين</div>
        <form onSubmit={addNewUser} style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          <input placeholder="اسم الدخول" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} style={{ padding: 10, borderRadius: 10, border: '1px solid #cbd5e1' }} />
          <input placeholder="كلمة المرور" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} style={{ padding: 10, borderRadius: 10, border: '1px solid #cbd5e1' }} />
          <input placeholder="الاسم" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} style={{ padding: 10, borderRadius: 10, border: '1px solid #cbd5e1' }} />
          <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })} style={{ padding: 10, borderRadius: 10, border: '1px solid #cbd5e1' }}>
            <option value="user">مستخدم</option>
            <option value="admin">مدير</option>
          </select>
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <button type="submit" style={{ padding: '12px 16px', borderRadius: 10, border: 'none', background: '#0ea5e9', color: 'white', cursor: 'pointer' }}>إضافة</button>
          </div>
        </form>
        <div style={{ marginTop: 12, display: 'grid', gap: 6 }}>
          {users.map((u) => (
            <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{u.name || u.username}</div>
                <div style={{ fontSize: 12, color: '#475569' }}>{u.role}</div>
              </div>
              <button onClick={() => deleteUser(u.id)} style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}>حذف</button>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>نسخ احتياطي</div>
        <div style={{ display: 'grid', gap: 10 }}>
          <textarea value={exportData()} readOnly style={{ width: '100%', minHeight: 160, borderRadius: 10, border: '1px solid #cbd5e1', padding: 10 }} />
          <textarea value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="لصق البيانات هنا للاستيراد" style={{ width: '100%', minHeight: 120, borderRadius: 10, border: '1px solid #cbd5e1', padding: 10 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={importDataHandler} style={{ padding: '10px 14px', borderRadius: 10, border: 'none', background: '#0ea5e9', color: 'white', cursor: 'pointer' }}>استيراد</button>
            <button onClick={syncToCloud} disabled={isSyncing} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>رفع للسحابة</button>
            <button onClick={syncFromCloud} disabled={isSyncing} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>تحميل من السحابة</button>
          </div>
          {isSyncing && <div style={{ color: '#0ea5e9' }}>جاري المزامنة...</div>}
        </div>
      </section>
    </div>
  );
};
