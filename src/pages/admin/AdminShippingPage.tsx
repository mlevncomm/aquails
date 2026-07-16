import { useEffect, useState } from 'react';
import { Truck, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { getShippingConfig, saveShippingConfig, type ShippingMethod } from '@/services/shippingService';
import { getSiteSettings, saveSiteSettings } from '@/services/settingsService';
import { useToastStore } from '@/components/Toast';
import { AdminPageHeader, AdminCard, AdminInput, AdminLabel, AdminButton } from '@/components/admin/admin-ui';

export default function AdminShippingPage() {
  const addToast = useToastStore((s) => s.add);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [codFee, setCodFee] = useState(150);
  const [freeShipping, setFreeShipping] = useState(500);

  useEffect(() => {
    void Promise.all([getShippingConfig(), getSiteSettings()]).then(([ship, site]) => {
      setMethods(ship.methods);
      setCodFee(ship.codFee);
      setFreeShipping(site.freeShippingThreshold);
      setLoading(false);
    });
  }, []);

  const updateMethod = (idx: number, field: keyof ShippingMethod, value: string | number) => {
    setMethods((prev) => prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));
  };

  const addMethod = () => {
    setMethods((prev) => [...prev, { id: `m${Date.now()}`, label: 'Yeni Kargo', desc: '', price: 0, days: '3-5' }]);
  };

  const removeMethod = (idx: number) => {
    setMethods((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const [shipRes] = await Promise.all([
      saveShippingConfig({ methods, codFee }),
      saveSiteSettings({
        ...(await getSiteSettings()),
        freeShippingThreshold: freeShipping,
      }),
    ]);
    setSaving(false);
    if (!shipRes.success) addToast(shipRes.error ?? 'Kayıt başarısız.', 'error');
    else addToast('Kargo ayarları kaydedildi.', 'success');
  };

  if (loading) {
    return <div className="flex justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-aq-muted" /></div>;
  }

  return (
    <>
      <AdminPageHeader title="Kargo Modülü" description="Kargo yöntemleri, kapıda ödeme ücreti ve ücretsiz kargo limiti" />

      <form onSubmit={(e) => void handleSave(e)}>
        <AdminCard className="mb-6">
          <h3 className="text-sm font-semibold text-aq-text mb-4 flex items-center gap-2">
            <Truck className="w-4 h-4 text-aq-blue" />Genel
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <div>
              <AdminLabel>Ücretsiz Kargo Limiti (₺)</AdminLabel>
              <AdminInput type="number" value={freeShipping} onChange={(e) => setFreeShipping(Number(e.target.value))} />
            </div>
            <div>
              <AdminLabel>Kapıda Ödeme Ücreti (₺)</AdminLabel>
              <AdminInput type="number" value={codFee} onChange={(e) => setCodFee(Number(e.target.value))} />
            </div>
          </div>
        </AdminCard>

        <AdminCard className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-aq-text">Kargo Yöntemleri</h3>
            <button type="button" onClick={addMethod} className="text-xs text-aq-blue flex items-center gap-1"><Plus className="w-3.5 h-3.5" />Ekle</button>
          </div>
          <div className="space-y-4">
            {methods.map((m, idx) => (
              <div key={m.id} className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 bg-aq-ice rounded-xl border border-aq-border/60">
                <div><AdminLabel>Ad</AdminLabel><AdminInput value={m.label} onChange={(e) => updateMethod(idx, 'label', e.target.value)} /></div>
                <div><AdminLabel>Açıklama</AdminLabel><AdminInput value={m.desc} onChange={(e) => updateMethod(idx, 'desc', e.target.value)} /></div>
                <div><AdminLabel>Fiyat (₺)</AdminLabel><AdminInput type="number" value={m.price} onChange={(e) => updateMethod(idx, 'price', Number(e.target.value))} /></div>
                <div><AdminLabel>Teslimat</AdminLabel><AdminInput value={m.days} onChange={(e) => updateMethod(idx, 'days', e.target.value)} /></div>
                <div className="flex items-end">
                  <button type="button" onClick={() => removeMethod(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminButton type="submit" disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Kaydet
        </AdminButton>
      </form>
    </>
  );
}
