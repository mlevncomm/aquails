import { useState, useEffect } from 'react';
import { Globe, Phone, Truck, Save, Loader2, Receipt } from 'lucide-react';
import { getSiteSettings, saveSiteSettings, type SiteSettings } from '@/services/settingsService';
import { getTaxConfig, saveTaxConfig, type TaxConfig } from '@/services/shippingService';
import { useToastStore } from '@/components/Toast';
import { AdminPageHeader, AdminCard, AdminInput, AdminLabel, AdminButton } from '@/components/admin/admin-ui';

// Bilesen icinde tanimlanirsa her renderda yeni tip olusur ve icindeki
// inputlar remount olup odak kaybeder; bu yuzden modul seviyesinde.
function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <AdminCard className="mb-6">
      <h3 className="text-sm font-semibold text-aq-text mb-4 flex items-center gap-2">
        <Icon className="w-4 h-4 text-aq-blue" />{title}
      </h3>
      {children}
    </AdminCard>
  );
}

function TaxSection() {
  const addToast = useToastStore((s) => s.add);
  const [tax, setTax] = useState<TaxConfig | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void getTaxConfig().then(setTax);
  }, []);

  const save = async () => {
    if (!tax) return;
    setSaving(true);
    const res = await saveTaxConfig({ ...tax, priceIncludesVat: false });
    setSaving(false);
    addToast(res.success ? 'KDV ayarları kaydedildi.' : (res.error ?? 'Hata'), res.success ? 'success' : 'error');
  };

  if (!tax) return null;

  return (
    <AdminCard className="mb-6">
      <h3 className="text-sm font-semibold text-aq-text mb-4 flex items-center gap-2">
        <Receipt className="w-4 h-4 text-aq-blue" />KDV / Vergi
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        <div>
          <AdminLabel>Varsayılan KDV Oranı (%)</AdminLabel>
          <AdminInput type="number" value={tax.rate} onChange={(e) => setTax({ ...tax, rate: Number(e.target.value) })} />
        </div>
        <label className="flex items-center gap-2 text-sm text-aq-muted mt-6">
          <input type="checkbox" checked={tax.displayInCheckout} onChange={(e) => setTax({ ...tax, displayInCheckout: e.target.checked })} />
          Checkout&apos;ta KDV göster
        </label>
      </div>
      <div className="mt-4 p-4 bg-aq-sky border border-aq-aqua/30 rounded-xl text-xs text-aq-muted leading-relaxed max-w-3xl space-y-2">
        <p>
          <strong>Fiyat girişi KDV hariçtir.</strong> Admin panelinde ürün fiyatını 100₺ ve KDV oranını %20 girerseniz,
          müşteri sepetinde ve vitrinde <strong>120₺</strong> görür.
        </p>
        <p>
          Her ürünün kendi KDV oranı olabilir (ürün düzenleme ekranı). Oran girilmezse yukarıdaki varsayılan kullanılır.
          Kargo ve kapıda ödeme ücretleri KDV hariç girilir; checkout toplamına KDV eklenir.
        </p>
      </div>
      <AdminButton type="button" className="mt-4" disabled={saving} onClick={() => void save()}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        KDV Kaydet
      </AdminButton>
    </AdminCard>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const addToast = useToastStore((s) => s.add);

  useEffect(() => {
    void getSiteSettings().then(setSettings);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await saveSiteSettings(settings);
      addToast('Ayarlar kaydedildi.', 'success');
    } catch {
      addToast('Kayıt başarısız.', 'error');
    }
    setSaving(false);
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center py-24 text-aq-muted">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader title="Site Ayarları" description="İletişim ve genel site bilgileri" />

      <form onSubmit={(e) => void handleSave(e)}>
        <Section title="Genel" icon={Globe}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <AdminLabel>Site Adı</AdminLabel>
              <AdminInput value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
            </div>
            <div>
              <AdminLabel>Site Açıklaması</AdminLabel>
              <AdminInput value={settings.siteDescription} onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })} />
            </div>
          </div>
        </Section>

        <Section title="İletişim" icon={Phone}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <AdminLabel>Telefon</AdminLabel>
              <AdminInput value={settings.contactPhone} onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })} />
            </div>
            <div>
              <AdminLabel>WhatsApp</AdminLabel>
              <AdminInput value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} />
            </div>
            <div>
              <AdminLabel>E-posta</AdminLabel>
              <AdminInput value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} />
            </div>
            <div>
              <AdminLabel>Adres</AdminLabel>
              <AdminInput value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
            </div>
          </div>
        </Section>

        <Section title="Sosyal Medya" icon={Globe}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <AdminLabel>Instagram</AdminLabel>
              <AdminInput value={settings.instagram} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} />
            </div>
            <div>
              <AdminLabel>Facebook</AdminLabel>
              <AdminInput value={settings.facebook} onChange={(e) => setSettings({ ...settings, facebook: e.target.value })} />
            </div>
          </div>
        </Section>

        <Section title="Kargo" icon={Truck}>
          <div className="max-w-xs">
            <AdminLabel>Ücretsiz Kargo Limiti (₺)</AdminLabel>
            <AdminInput
              type="number"
              value={settings.freeShippingThreshold}
              onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
            />
            <p className="text-xs text-aq-muted mt-1">Detaylı kargo yöntemleri için Kargo Modülü sayfasını kullanın.</p>
          </div>
        </Section>

        <TaxSection />

        <AdminButton type="submit" disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Ayarları Kaydet
        </AdminButton>
      </form>
    </>
  );
}
