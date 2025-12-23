import React, { useState } from 'react';
import { SIM_LABELS } from '../constants';
import { useData } from '../context/DataContext';
import { SimType } from '../types';

export const Inventory: React.FC = () => {
  const { stock, damaged, updateStock, stockLogs } = useData();
  const [type, setType] = useState<SimType>('jawwy');
  const [quantity, setQuantity] = useState(1);
  const [action, setAction] = useState<'add' | 'return_company' | 'to_damaged' | 'recover' | 'flush'>('add');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;
    updateStock(type, quantity, action);
    setQuantity(1);
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <section style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>تحديث المخزون</div>
        <form onSubmit={submit} style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>النوع</span>
            <select value={type} onChange={(e) => setType(e.target.value as SimType)} style={{ padding: 10, borderRadius: 10, border: '1px solid #cbd5e1' }}>
              <option value="jawwy">جوي</option>
              <option value="sawa">سوا</option>
              <option value="multi">متعدد</option>
            </select>
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>الكمية</span>
            <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} style={{ padding: 10, borderRadius: 10, border: '1px solid #cbd5e1' }} />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>الإجراء</span>
            <select value={action} onChange={(e) => setAction(e.target.value as typeof action)} style={{ padding: 10, borderRadius: 10, border: '1px solid #cbd5e1' }}>
              <option value="add">إضافة</option>
              <option value="return_company">إرجاع للشركة</option>
              <option value="to_damaged">محول إلى تالف</option>
              <option value="recover">استرجاع من التالف</option>
              <option value="flush">إتلاف</option>
            </select>
          </label>
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <button type="submit" style={{ padding: '12px 16px', borderRadius: 10, border: 'none', background: '#0ea5e9', color: 'white', cursor: 'pointer' }}>
              تحديث
            </button>
          </div>
        </form>
      </section>

      <section style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>الوضع الحالي</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          {Object.entries(stock).map(([key, value]) => (
            <div key={key} style={{ background: '#f8fafc', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 600 }}>{SIM_LABELS[key as SimType]}</div>
              <div>سليم: {value}</div>
              <div>تالف: {damaged[key as SimType]}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>سجل الحركات</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {stockLogs.slice().reverse().map((log) => (
            <div key={log.id} style={{ padding: 10, borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div style={{ fontWeight: 600 }}>{SIM_LABELS[log.type]}</div>
              <div style={{ fontSize: 12, color: '#475569' }}>{new Date(log.date).toLocaleString()}</div>
              <div style={{ fontSize: 14 }}>الإجراء: {log.action} — كمية: {log.quantity}</div>
            </div>
          ))}
          {stockLogs.length === 0 && <div style={{ color: '#94a3b8' }}>لا يوجد سجلات بعد</div>}
        </div>
      </section>
    </div>
  );
};
