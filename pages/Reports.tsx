import React, { useState } from 'react';
import { SIM_LABELS, SIM_COLORS } from '../constants';
import { useData } from '../context/DataContext';
import { TransactionType } from '../types';

export const Reports: React.FC = () => {
  const { transactions, removeTransaction, addTransaction } = useData();
  const [type, setType] = useState<TransactionType>('jawwy');
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(0);

  const grouped = transactions.reduce<Record<string, { amount: number; qty: number }>>((acc, t) => {
    const key = t.type;
    acc[key] = acc[key] || { amount: 0, qty: 0 };
    acc[key].amount += t.amount;
    acc[key].qty += t.quantity;
    return acc;
  }, {});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction(type, amount, quantity);
    setAmount(0);
    setQuantity(1);
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <section style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>إضافة عملية</div>
        <form onSubmit={submit} style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>النوع</span>
            <select value={type} onChange={(e) => setType(e.target.value as TransactionType)} style={{ padding: 10, borderRadius: 10, border: '1px solid #cbd5e1' }}>
              <option value="jawwy">جوي</option>
              <option value="sawa">سوا</option>
              <option value="multi">متعدد</option>
              <option value="device">جهاز</option>
              <option value="issue">لم يكتمل</option>
            </select>
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>الكمية</span>
            <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} style={{ padding: 10, borderRadius: 10, border: '1px solid #cbd5e1' }} />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>المبلغ</span>
            <input type="number" min={0} value={amount} onChange={(e) => setAmount(Number(e.target.value))} style={{ padding: 10, borderRadius: 10, border: '1px solid #cbd5e1' }} />
          </label>
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <button type="submit" style={{ padding: '12px 16px', borderRadius: 10, border: 'none', background: '#0ea5e9', color: 'white', cursor: 'pointer' }}>حفظ</button>
          </div>
        </form>
      </section>

      <section style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>ملخص سريع</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          {Object.entries(grouped).map(([typeKey, data]) => (
            <div key={typeKey} style={{ padding: 12, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 600, color: SIM_COLORS[typeKey as keyof typeof SIM_COLORS] }}>{SIM_LABELS[typeKey as keyof typeof SIM_LABELS]}</div>
              <div>العمليات: {data.qty}</div>
              <div>الإيراد: {data.amount} ريال</div>
            </div>
          ))}
          {transactions.length === 0 && <div style={{ color: '#94a3b8' }}>لا توجد بيانات حتى الآن</div>}
        </div>
      </section>

      <section style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>قائمة العمليات</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {transactions.slice().reverse().map((t) => (
            <div key={t.id} style={{ padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', display: 'grid', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{SIM_LABELS[t.type]}</strong>
                <button onClick={() => removeTransaction(t.id)} style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}>حذف</button>
              </div>
              <div style={{ fontSize: 12, color: '#475569' }}>{new Date(t.date).toLocaleString()}</div>
              <div>الكمية: {t.quantity} — المبلغ: {t.amount} ريال</div>
            </div>
          ))}
          {transactions.length === 0 && <div style={{ color: '#94a3b8' }}>لا توجد عمليات مسجلة</div>}
        </div>
      </section>
    </div>
  );
};
