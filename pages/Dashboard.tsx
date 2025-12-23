import React from 'react';
import { SIM_LABELS, SIM_COLORS } from '../constants';
import { useData } from '../context/DataContext';

export const Dashboard: React.FC = () => {
  const { transactions, stock } = useData();
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalQuantity = transactions.reduce((sum, t) => sum + t.quantity, 0);

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
    </div>
  );
};
