import { useState } from 'react';
import { Wrench, Plus, X, MapPin, Calendar, FileText } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';

interface ServiceReq {
  id: string; type: string; address: string; date: string; description: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
}

export default function CustomerServiceRequestsPage() {
  const [requests, setRequests] = useState<ServiceReq[]>([
    { id: '1', type: 'Filtre Değişimi', address: 'Ev - Pendik/İstanbul', date: '12 Haziran 2025', description: 'Mutfak cihazı filtre değişimi', status: 'pending' },
    { id: '2', type: 'Kurulum', address: 'İş - Kadıköy/İstanbul', date: '15 Haziran 2025', description: 'Yeni Compact cihaz kurulumu', status: 'scheduled' },
    { id: '3', type: 'Bakım', address: 'Ev - Pendik/İstanbul', date: '1 Mayıs 2025', description: 'Yıllık periyodik bakım', status: 'completed' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'Filtre Değişimi', address: 'Ev - Pendik/İstanbul', date: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequests(prev => [{ id: Date.now().toString(), ...form, status: 'pending' }, ...prev]);
    setShowForm(false);
    setForm({ type: 'Filtre Değişimi', address: 'Ev - Pendik/İstanbul', date: '', description: '' });
  };

  const types = ['Filtre Değişimi', 'Kurulum', 'Bakım', 'Arıza', 'Genel Kontrol'];

  return (
      <>      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-[#0D2137]">Servis Taleplerim</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#1A73E8] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#1557B0] transition-all">
          <Plus className="w-3.5 h-3.5" /> Yeni Talep
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-[#E8F0FE] rounded-2xl p-5 mb-5 space-y-3">
          <div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-[#0D2137]">Yeni Servis Talebi</h3><button type="button" onClick={() => setShowForm(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F0F6FF]"><X className="w-4 h-4" /></button></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="text-xs text-[#8B9DAF] mb-1 block">Servis Tipi</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl bg-white">{types.map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label className="text-xs text-[#8B9DAF] mb-1 block">Tercih Tarihi</label><input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl" /></div>
          </div>
          <div><label className="text-xs text-[#8B9DAF] mb-1 block">Adres</label><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl" /></div>
          <div><label className="text-xs text-[#8B9DAF] mb-1 block">Açıklama</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl resize-none" /></div>
          <button type="submit" className="bg-[#1A73E8] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#1557B0]">Talep Oluştur</button>
        </form>
      )}

      {requests.length === 0 ? (
        <div className="bg-white border border-[#E8F0FE] rounded-2xl"><EmptyState icon={<Wrench className="w-7 h-7 text-[#8B9DAF]" />} title="Servis talebiniz yok" description="Yeni bir servis talebi oluşturun." action={<button onClick={() => setShowForm(true)} className="bg-[#1A73E8] text-white px-5 py-2 rounded-full text-sm font-semibold">Talep Oluştur</button>} /></div>
      ) : (
        <div className="space-y-3">
          {requests.map(r => (
            <div key={r.id} className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-sm font-semibold text-[#0D2137] flex items-center gap-1.5"><Wrench className="w-4 h-4 text-[#1A73E8]" />{r.type}</h3>
                  <StatusBadge status={r.status} />
                </div>
                <span className="text-xs text-[#8B9DAF] flex items-center gap-1"><Calendar className="w-3 h-3" />{r.date}</span>
              </div>
              <p className="text-sm text-[#5A6B7B] flex items-start gap-1.5"><FileText className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />{r.description}</p>
              <p className="text-xs text-[#8B9DAF] mt-1.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{r.address}</p>
            </div>
          ))}
        </div>
      )}
      </>
  );
}
