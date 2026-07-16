import { useState, useEffect } from 'react';
import { MapPin, Plus, Pencil, Trash2, Home, Building2, Star, Loader2 } from 'lucide-react';
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  type Address,
} from '@/services/addressService';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/components/Toast';

export default function CustomerAddressesPage() {
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.add);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    city: '',
    district: '',
    fullAddress: '',
    type: 'shipping' as 'shipping' | 'billing',
    isDefault: false,
  });

  const loadAddresses = async () => {
    if (!user) return;
    const data = await getAddresses(user.id);
    setAddresses(data);
    setLoading(false);
  };

  useEffect(() => {
    void loadAddresses();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const res = editingId
      ? await updateAddress(editingId, user.id, form)
      : await createAddress(user.id, form);
    setSaving(false);
    if (!res.success) {
      addToast(res.error ?? 'Adres kaydedilemedi.', 'error');
      return;
    }
    addToast(editingId ? 'Adres güncellendi.' : 'Adres eklendi.', 'success');
    setShowForm(false);
    setEditingId(null);
    setForm({ title: '', city: '', district: '', fullAddress: '', type: 'shipping', isDefault: false });
    void loadAddresses();
  };

  const startEdit = (a: Address) => {
    setForm({
      title: a.title,
      city: a.city,
      district: a.district,
      fullAddress: a.fullAddress,
      type: a.type,
      isDefault: a.isDefault,
    });
    setEditingId(a.id);
    setShowForm(true);
  };

  const remove = async (id: string) => {
    const res = await deleteAddress(id);
    if (res.success) {
      addToast('Adres silindi.', 'success');
      void loadAddresses();
    } else {
      addToast(res.error ?? 'Silinemedi.', 'error');
    }
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
        <h2 className="text-lg font-semibold text-aq-text">Adreslerim</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm({ title: '', city: '', district: '', fullAddress: '', type: 'shipping', isDefault: false });
          }}
          className="flex items-center gap-2 bg-aq-blue text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-aq-deep hover:text-white"
        >
          <Plus className="w-3.5 h-3.5" /> Yeni Adres
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-aq-border/60 rounded-2xl p-5 mb-5 space-y-3">
          <h3 className="text-sm font-semibold text-aq-text">{editingId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Adres Başlığı" className="px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'shipping' | 'billing' })} className="px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-white">
              <option value="shipping">Teslimat</option>
              <option value="billing">Fatura</option>
            </select>
            <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Şehir" className="px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl" />
            <input required value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} placeholder="İlçe" className="px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl" />
          </div>
          <textarea required value={form.fullAddress} onChange={(e) => setForm({ ...form, fullAddress: e.target.value })} placeholder="Açık Adres" rows={2} className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl resize-none" />
          <label className="flex items-center gap-2 text-sm text-aq-muted">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="w-4 h-4 accent-aq-deep" />
            Varsayılan adres
          </label>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="bg-aq-deep text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-60">
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-aq-border/60 px-5 py-2 rounded-full text-sm">İptal</button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="bg-white border border-aq-border/60 rounded-2xl p-8 text-center text-sm text-aq-muted">
          Henüz kayıtlı adresiniz yok. Yeni adres ekleyin.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <div key={a.id} className="bg-white border border-aq-border/60 rounded-2xl p-5 relative">
              {a.isDefault && (
                <span className="absolute top-3 right-3 flex items-center gap-1 bg-aq-sky text-aq-blue text-[10px] font-medium px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3" />Varsayılan
                </span>
              )}
              <div className="flex items-center gap-2 mb-2">
                {a.type === 'shipping' ? <Home className="w-4 h-4 text-aq-blue" /> : <Building2 className="w-4 h-4 text-[#8B5CF6]" />}
                <h3 className="text-sm font-semibold">{a.title}</h3>
              </div>
              <div className="flex items-start gap-2 text-sm text-aq-muted">
                <MapPin className="w-4 h-4 mt-0.5 text-aq-muted" />
                <p>{a.fullAddress}, {a.district}/{a.city}</p>
              </div>
              <div className="flex gap-1 mt-3">
                <button onClick={() => startEdit(a)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-aq-ice"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => void remove(a.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
