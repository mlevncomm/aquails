import { useState, useEffect } from 'react';
import { Wrench, Plus, X, MapPin, Calendar, FileText } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/components/Toast';
import { getAddresses, type Address } from '@/services/addressService';
import {
  getCustomerServiceRequests,
  createServiceRequest,
  labelToServiceType,
  type CustomerServiceRequest,
} from '@/services/serviceRequestService';
import {
  CustomerPageShell,
  CustomerPageHeader,
  CustomerCard,
  CustomerEmpty,
  CustomerLoading,
  CustomerInput,
  CustomerSelect,
  CustomerTextarea,
  CustomerLabel,
  CustomerButton,
  CustomerBadge,
} from '@/components/customer/customer-ui';

const types = ['Filtre Değişimi', 'Kurulum', 'Bakım', 'Arıza', 'Genel Kontrol'];

function formatAddressLabel(a: Address): string {
  return `${a.title} - ${a.district}/${a.city}`;
}

function serviceTone(status: string): 'success' | 'warning' | 'info' | 'neutral' {
  if (status === 'completed' || status === 'done') return 'success';
  if (status === 'pending') return 'warning';
  if (status === 'scheduled' || status === 'in_progress') return 'info';
  return 'neutral';
}

export default function CustomerServiceRequestsPage() {
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.add);
  const [requests, setRequests] = useState<CustomerServiceRequest[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: 'Filtre Değişimi',
    address: '',
    date: '',
    description: '',
  });

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
      if (data.length > 0) {
        setForm((f) => (f.address ? f : { ...f, address: formatAddressLabel(data[0]) }));
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
      <CustomerPageShell>
        <CustomerLoading rows={3} />
      </CustomerPageShell>
    );
  }

  return (
    <CustomerPageShell>
      <CustomerPageHeader
        title="Servis Taleplerim"
        description="Kurulum, bakım ve filtre değişim talepleriniz."
        action={
          <CustomerButton onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Yeni Talep
          </CustomerButton>
        }
      />

      {showForm && (
        <CustomerCard className="mb-5">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-aq-text">Yeni Servis Talebi</h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-aq-ice text-aq-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <CustomerLabel>Servis Tipi</CustomerLabel>
                <CustomerSelect
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {types.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </CustomerSelect>
              </div>
              <div>
                <CustomerLabel>Tercih Tarihi</CustomerLabel>
                <CustomerInput
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
            </div>
            <div>
              <CustomerLabel>Adres</CustomerLabel>
              {addresses.length > 0 ? (
                <CustomerSelect
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                >
                  {addresses.map((a) => (
                    <option key={a.id} value={formatAddressLabel(a)}>
                      {formatAddressLabel(a)}
                    </option>
                  ))}
                </CustomerSelect>
              ) : (
                <CustomerInput
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Adres girin"
                />
              )}
            </div>
            <div>
              <CustomerLabel>Açıklama</CustomerLabel>
              <CustomerTextarea
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
              />
            </div>
            <CustomerButton type="submit" disabled={saving}>
              {saving ? 'Oluşturuluyor...' : 'Talep Oluştur'}
            </CustomerButton>
          </form>
        </CustomerCard>
      )}

      {requests.length === 0 ? (
        <CustomerCard padding={false}>
          <CustomerEmpty
            icon={Wrench}
            title="Servis talebiniz yok"
            message="Yeni bir servis talebi oluşturun."
            action={
              <CustomerButton onClick={() => setShowForm(true)}>Talep Oluştur</CustomerButton>
            }
          />
        </CustomerCard>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <CustomerCard key={r.id}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-sm font-semibold text-aq-text flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-aq-blue" />
                    {r.type}
                  </h3>
                  <CustomerBadge tone={serviceTone(r.status)}>{r.status}</CustomerBadge>
                </div>
                <span className="text-xs text-aq-muted flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {r.date}
                </span>
              </div>
              <p className="text-sm text-aq-muted flex items-start gap-1.5">
                <FileText className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                {r.description}
              </p>
              <p className="text-xs text-aq-muted mt-1.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {r.address}
              </p>
            </CustomerCard>
          ))}
        </div>
      )}
    </CustomerPageShell>
  );
}
