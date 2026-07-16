import { useState, useEffect } from 'react';
import { Wrench, Plus, X, MapPin, Calendar, FileText, Loader2 } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/components/Toast';
import { getAddresses, type Address } from '@/services/addressService';
import {
  getCustomerServiceRequests,
  createServiceRequest,
  labelToServiceType,
  type CustomerServiceRequest,
} from '@/services/serviceRequestService';

const types = ['Filtre Değişimi', 'Kurulum', 'Bakım', 'Arıza', 'Genel Kontrol'];

function formatAddressLabel(a: Address): string {
  return `${a.title} - ${a.district}/${a.city}`;
}

export default function CustomerServiceRequestsPage() {
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.add);
  const [requests, setRequests] = useState<CustomerServiceRequest[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'Filtre Değişimi', address: '', date: '', description: '' });

  const loadRequests = async () => {
    if (!user) return;
    const data = await getCustomerServiceRequests(user.id);
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    void loadRequests();
    void getAddresses(user.id).then((data) => {
      setAddresses(data);
      if (data.length > 0 && !form.address) {
        setForm((f) => ({ ...f, address: formatAddressLabel(data[0]) }));
      }
    });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const res = await createServiceRequest({
      userId: user.id,
      type: labelToServiceType(form.type),
      address: form.address,
      description: form.description,
      preferredDate: form.date || undefined,
    });
    setSaving(false);
    if (!res.success) {
      addToast(res.error ?? 'Talep oluşturulamadı.', 'error');
      return;
    }
    addToast('Servis talebiniz oluşturuldu.', 'success');
    setShowForm(false);
    setForm({
      type: 'Filtre Değişimi',
      address: addresses[0] ? formatAddressLabel(addresses[0]) : '',
      date: '',
      description: '',
    });
    void loadRequests();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-aq-muted">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Yükleniyor...
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-aq-text">Servis Taleplerim</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-aq-blue text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-aq-deep hover:text-white transition-all">
          <Plus className="w-3.5 h-3.5" /> Yeni Talep
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-aq-border/60 rounded-2xl p-5 mb-5 space-y-3">
          <div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-aq-text">Yeni Servis Talebi</h3><button type="button" onClick={() => setShowForm(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-aq-ice"><X className="w-4 h-4" /></button></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="text-xs text-aq-muted mb-1 block">Servis Tipi</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 text-sm border border-aq-border/60 rounded-xl bg-white">{types.map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label className="text-xs text-aq-muted mb-1 block">Tercih Tarihi</label><input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 text-sm border border-aq-border/60 rounded-xl" /></div>
          </div>
          <div>
            <label className="text-xs text-aq-muted mb-1 block">Adres</label>
            {addresses.length > 0 ? (
              <select required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 text-sm border border-aq-border/60 rounded-xl bg-white">
                {addresses.map(a => <option key={a.id} value={formatAddressLabel(a)}>{formatAddressLabel(a)}</option>)}
              </select>
            ) : (
              <input required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Adres girin" className="w-full px-3 py-2 text-sm border border-aq-border/60 rounded-xl" />
            )}
          </div>
          <div><label className="text-xs text-aq-muted mb-1 block">Açıklama</label><textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 text-sm border border-aq-border/60 rounded-xl resize-none" /></div>
          <button type="submit" disabled={saving} className="bg-aq-blue text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white disabled:opacity-60">
            {saving ? 'Oluşturuluyor...' : 'Talep Oluştur'}
          </button>
        </form>
      )}

      {requests.length === 0 ? (
        <div className="bg-white border border-aq-border/60 rounded-2xl"><EmptyState icon={<Wrench className="w-7 h-7 text-aq-muted" />} title="Servis talebiniz yok" description="Yeni bir servis talebi oluşturun." action={<button onClick={() => setShowForm(true)} className="bg-aq-blue hover:bg-aq-deep text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors">Talep Oluştur</button>} /></div>
      ) : (
        <div className="space-y-3">
          {requests.map(r => (
            <div key={r.id} className="bg-white border border-aq-border/60 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-sm font-semibold text-aq-text flex items-center gap-1.5"><Wrench className="w-4 h-4 text-aq-blue" />{r.type}</h3>
                  <StatusBadge status={r.status} />
                </div>
                <span className="text-xs text-aq-muted flex items-center gap-1"><Calendar className="w-3 h-3" />{r.date}</span>
              </div>
              <p className="text-sm text-aq-muted flex items-start gap-1.5"><FileText className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />{r.description}</p>
              <p className="text-xs text-aq-muted mt-1.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{r.address}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
