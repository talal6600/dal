import React from 'react';
import { SIM_LABELS, SIM_COLORS } from '../constants';
import { useData } from '../context/DataContext';

export const Dashboard: React.FC = () => {
  const { transactions, stock, settings } = useData();

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalQuantity = transactions.reduce((sum, t) => sum + t.quantity, 0);

  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const weeklyTransactions = transactions.filter((t) => new Date(t.date) >= startOfWeek);
  const weeklyRevenue = weeklyTransactions.reduce((sum, t) => sum + t.amount, 0);
  const weeklyQty = weeklyTransactions.reduce((sum, t) => sum + t.quantity, 0);
  const progress = Math.min(100, Math.round((weeklyRevenue / (settings.weeklyTarget || 1)) * 100));

  const topSeller = Object.entries(
    transactions.reduce<Record<string, number>>((acc, t) => {
      if (t.type === 'issue' || t.type === 'device') return acc;
      acc[t.type] = (acc[t.type] || 0) + t.quantity;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1])[0];

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <div style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, color: '#475569' }}>إجمالي المبيعات</div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>{totalRevenue.toLocaleString()} ريال</div>
        </div>
        <div style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, color: '#475569' }}>عدد العمليات</div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>{totalQuantity} شريحة</div>
        </div>
        <div style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, color: '#475569' }}>مبيعات هذا الأسبوع</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{weeklyRevenue.toLocaleString()} ريال</div>
          <div style={{ fontSize: 12, color: '#475569' }}>الكمية: {weeklyQty}</div>
          <div style={{ marginTop: 8, width: '100%', background: '#e2e8f0', height: 8, borderRadius: 999 }}>
            <div style={{ width: `${progress}%`, background: '#0ea5e9', height: '100%', borderRadius: 999 }} />
          </div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>الهدف الأسبوعي: {settings.weeklyTarget} ريال</div>
        </div>
        {topSeller && (
          <div style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 12, color: '#475569' }}>الأكثر مبيعاً</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{SIM_LABELS[topSeller[0] as keyof typeof SIM_LABELS]}</div>
            <div style={{ fontSize: 12, color: '#475569' }}>إجمالي القطع: {topSeller[1]}</div>
          </div>
        )}
      </section>

      <section style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>المخزون الحالي</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          {Object.entries(stock).map(([type, quantity]) => (
            <div key={type} style={{ padding: 12, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: SIM_COLORS[type as keyof typeof SIM_COLORS] }}>
                {SIM_LABELS[type as keyof typeof SIM_LABELS]}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{quantity}</div>
            </div>
          ))}
        </div>
      </section>

      {Object.entries(stock).some(([, qty]) => qty < 5) && (
        <section style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>تنبيهات المخزون المنخفض</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {Object.entries(stock)
              .filter(([, qty]) => qty < 5)
              .map(([type, qty]) => (
                <div key={type} style={{ padding: 10, borderRadius: 10, background: '#fff7ed', border: '1px solid #fed7aa' }}>
                  {SIM_LABELS[type as keyof typeof SIM_LABELS]} - متبقي {qty} قطع فقط
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
};
