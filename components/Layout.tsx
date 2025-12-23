import React from 'react';
import { Home, Package, Fuel, BarChart2, Settings, LogOut } from 'lucide-react';
import { useData } from '../context/DataContext';

interface LayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const tabs = [
  { id: 'home', label: 'الرئيسية', icon: Home },
  { id: 'inventory', label: 'المخزون', icon: Package },
  { id: 'fuel', label: 'الوقود', icon: Fuel },
  { id: 'reports', label: 'التقارير', icon: BarChart2 },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
];

export const Layout: React.FC<LayoutProps> = ({ activeTab, onTabChange, children }) => {
  const { logout, currentUser } = useData();

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>متابعة المبيعات</div>
          <div style={{ fontSize: '12px', color: '#475569' }}>مرحباً {currentUser?.name}</div>
        </div>
        <button onClick={logout} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>
          <LogOut size={16} />
          <span>تسجيل خروج</span>
        </button>
      </header>

      <main style={{ padding: '16px', maxWidth: 960, margin: '0 auto' }}>{children}</main>

      <nav style={{ position: 'sticky', bottom: 0, background: 'white', borderTop: '1px solid #e2e8f0', padding: '8px 12px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                border: 'none',
                borderRadius: 10,
                padding: '10px 6px',
                background: active ? '#0ea5e9' : '#f8fafc',
                color: active ? 'white' : '#0f172a',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontSize: 12 }}>
                <Icon size={18} />
                <span>{tab.label}</span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
