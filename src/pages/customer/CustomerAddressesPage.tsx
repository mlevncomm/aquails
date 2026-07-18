import { useState, useEffect } from 'react';
import { MapPin, Plus, Pencil, Trash2, Home, Building2, Star } from 'lucide-react';
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  type Address,
} from '@/services/addressService';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/components/Toast';
import {
  CustomerPageShell,
  CustomerPageHeader,
  CustomerCard,
  CustomerInput,
  CustomerSelect,
  CustomerTextarea,
  CustomerLabel,
  CustomerButton,
  CustomerEmpty,
  CustomerLoading,
  CustomerBadge,
} from '@/components/customer/customer-ui';

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

  const resetForm = () => {
    setForm({
      title: '',
      city: '',
      district: '',
      fullAddress: '',
      type: 'shipping',
      isDefault: false,
    });
    setEditingId(null);
  };

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
    resetForm();
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
    if (!window.confirm('Bu adresi silmek istediğinize emin misiniz?')) return;
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
      <CustomerPageShell>
        <CustomerLoading rows={3} />
      </CustomerPageShell>
    );
  }

  return (
    <CustomerPageShell>
      <CustomerPageHeader
        title="Adreslerim"
        description="Teslimat ve fatura adreslerinizi yönetin."
        action={
          <CustomerButton
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <Plus className="w-4 h-4" /> Yeni Adres
          </CustomerButton>
        }
      />

      {showForm && (
        <CustomerCard className="mb-5">
          <form onSubmit={handleSubmit} className="space-y-3">
            <h3 className="text-sm font-semibold text-aq-text mb-1">
              {editingId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <CustomerLabel>Adres Başlığı</CustomerLabel>
                <CustomerInput
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ev, İş…"
                />
              </div>
              <div>
                <CustomerLabel>Tür</CustomerLabel>
                <CustomerSelect
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as 'shipping' | 'billing' })
                  }
                >
                  <option value="shipping">Teslimat</option>
                  <option value="billing">Fatura</option>
                </CustomerSelect>
              </div>
              <div>
                <CustomerLabel>Şehir</CustomerLabel>
                <CustomerInput
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div>
                <CustomerLabel>İlçe</CustomerLabel>
                <CustomerInput
                  required
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                />
              </div>
            </div>
            <div>
              <CustomerLabel>Açık Adres</CustomerLabel>
              <CustomerTextarea
                required
                value={form.fullAddress}
                onChange={(e) => setForm({ ...form, fullAddress: e.target.value })}
                rows={2}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-aq-muted">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                className="w-4 h-4 accent-aq-blue"
              />
              Varsayılan adres
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              <CustomerButton type="submit" disabled={saving}>
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </CustomerButton>
              <CustomerButton
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                İptal
              </CustomerButton>
            </div>
          </form>
        </CustomerCard>
      )}

      {addresses.length === 0 ? (
        <CustomerCard padding={false}>
          <CustomerEmpty
            icon={MapPin}
            title="Kayıtlı adres yok"
            message="Teslimatı hızlandırmak için bir adres ekleyin."
            action={
              <CustomerButton
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                <Plus className="w-4 h-4" /> Adres Ekle
              </CustomerButton>
            }
          />
        </CustomerCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <CustomerCard key={a.id} className="relative !p-5">
              {a.isDefault && (
                <span className="absolute top-3 right-3">
                  <CustomerBadge tone="info">
                    <Star className="w-3 h-3 mr-1" /> Varsayılan
                  </CustomerBadge>
                </span>
              )}
              <div className="flex items-center gap-2 mb-2 pr-20">
                {a.type === 'shipping' ? (
                  <Home className="w-4 h-4 text-aq-blue flex-shrink-0" />
                ) : (
                  <Building2 className="w-4 h-4 text-aq-deep flex-shrink-0" />
                )}
                <h3 className="text-sm font-semibold text-aq-text truncate">{a.title}</h3>
              </div>
              <div className="flex items-start gap-2 text-sm text-aq-muted">
                <MapPin className="w-4 h-4 mt-0.5 text-aq-muted flex-shrink-0" />
                <p className="leading-relaxed">
                  {a.fullAddress}, {a.district}/{a.city}
                </p>
              </div>
              <div className="flex gap-1 mt-4">
                <button
                  type="button"
                  onClick={() => startEdit(a)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-aq-ice text-aq-muted hover:text-aq-blue transition-colors"
                  aria-label="Düzenle"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => void remove(a.id)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-red-50 text-aq-muted hover:text-red-600 transition-colors"
                  aria-label="Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </CustomerCard>
          ))}
        </div>
      )}
    </CustomerPageShell>
  );
}
