import React, { useState } from 'react';
import { FUEL_LABELS } from '../constants';
import { useData } from '../context/DataContext';
import { FuelLog } from '../types';

const fuelTypes: FuelLog['fuelType'][] = ['91', '95', 'diesel'];

export const Fuel: React.FC = () => {
  const { fuelLogs, addFuelLog, removeFuelLog } = useData();
  const [form, setForm] = useState<Omit<FuelLog, 'id'>>({
    date: new Date().toISOString().slice(0, 10),
    fuelType: '91',
    amount: 0,
    liters: 0,
    km: 0,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addFuelLog(form);
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <section style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>تسجيل تعبئة</div>
        <form onSubmit={submit} style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>التاريخ</span>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={{ padding: 10, borderRadius: 10, border: '1px solid #cbd5e1' }} />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>النوع</span>
            <select value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value as FuelLog['fuelType'] })} style={{ padding: 10, borderRadius: 10, border: '1px solid #cbd5e1' }}>
              {fuelTypes.map((type) => (
                <option key={type} value={type}>{FUEL_LABELS[type]}</option>
              ))}
            </select>
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>التكلفة (ريال)</span>
            <input type="number" min={0} value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} style={{ padding: 10, borderRadius: 10, border: '1px solid #cbd5e1' }} />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>اللترات</span>
            <input type="number" min={0} value={form.liters} onChange={(e) => setForm({ ...form, liters: Number(e.target.value) })} style={{ padding: 10, borderRadius: 10, border: '1px solid #cbd5e1' }} />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>العداد (كم)</span>
            <input type="number" min={0} value={form.km} onChange={(e) => setForm({ ...form, km: Number(e.target.value) })} style={{ padding: 10, borderRadius: 10, border: '1px solid #cbd5e1' }} />
          </label>
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <button type="submit" style={{ padding: '12px 16px', borderRadius: 10, border: 'none', background: '#0ea5e9', color: 'white', cursor: 'pointer' }}>حفظ</button>
          </div>
        </form>
      </section>

      <section style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>السجلات</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {fuelLogs.slice().reverse().map((log) => (
            <div key={log.id} style={{ padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', display: 'grid', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{FUEL_LABELS[log.fuelType]}</strong>
                <button onClick={() => removeFuelLog(log.id)} style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}>حذف</button>
              </div>
              <div style={{ fontSize: 12, color: '#475569' }}>{new Date(log.date).toLocaleDateString()}</div>
              <div>التكلفة: {log.amount} ريال — لتر: {log.liters}</div>
              <div>العداد: {log.km} كم</div>
            </div>
          ))}
          {fuelLogs.length === 0 && <div style={{ color: '#94a3b8' }}>لا توجد بيانات وقود بعد</div>}
        </div>
      </section>
    </div>
  );
};
