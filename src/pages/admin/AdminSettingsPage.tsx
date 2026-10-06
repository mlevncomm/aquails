import { useState, useEffect } from 'react';
import { Globe, Phone, Truck, Save, Loader2, Receipt, Wrench, Plus, X } from 'lucide-react';
import { getAdminSiteSettings, saveSiteSettings, getTechnicians, saveTechnicians, type SiteSettings } from '@/services/settingsService';
import { getTaxConfig, saveTaxConfig, type TaxConfig } from '@/services/shippingService';
import { useToastStore } from '@/components/Toast';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminCard,
  AdminInput,
  AdminLabel,
  AdminButton,
  AdminLoading,
} from '@/components/admin/admin-ui';

function Section({ title, icon: Icon, children, id }: { title: string; icon: React.ElementType; children: React.ReactNode; id?: string }) {
  return (
    <AdminCard className="mb-6">
      <h3 id={id} className="text-[15px] font-semibold text-aq-ink mb-4 flex items-center gap-2 scroll-mt-24">
        <Icon className="w-4 h-4 text-aq-ink" />{title}
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
      <h3 className="text-sm font-semibold text-aq-ink mb-4 flex items-center gap-2">
        <Receipt className="w-4 h-4 text-aq-ink" />KDV / Vergi
      </h3>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 max-w-2xl p-3 rounded-xl bg-aq-cloud border border-aq-border/50">
        <div>
          <p className="text-sm font-medium text-aq-ink">KDV uygula</p>
          <p className="text-xs text-aq-muted mt-0.5">
            {tax.enabled
              ? 'Vitrin, sepet ve ödeme tutarlarına KDV eklenir.'
              : 'KDV pasif — müşteri net fiyatı görür ve öder.'}
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-aq-muted cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={tax.enabled}
            onChange={(e) => setTax({ ...tax, enabled: e.target.checked })}
            className="w-4 h-4 accent-aq-ink"
          />
          {tax.enabled ? 'Aktif' : 'Pasif'}
        </label>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl ${!tax.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <div>
          <AdminLabel>Varsayılan KDV Oranı (%)</AdminLabel>
          <AdminInput
            type="number"
            min={0}
            max={100}
            value={tax.rate}
            onChange={(e) => setTax({ ...tax, rate: Number(e.target.value) })}
            disabled={!tax.enabled}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-aq-muted mt-6 cursor-pointer">
          <input
            type="checkbox"
            checked={tax.displayInCheckout}
            onChange={(e) => setTax({ ...tax, displayInCheckout: e.target.checked })}
            disabled={!tax.enabled}
            className="w-4 h-4 accent-aq-ink"
          />
          Checkout&apos;ta KDV göster
        </label>
      </div>
      <div className="mt-4 p-4 bg-aq-cloud border border-aq-aqua/30 rounded-xl text-xs text-aq-muted leading-relaxed max-w-3xl space-y-2">
        <p>
          <strong>Fiyat girişi KDV hariçtir.</strong> Admin panelinde ürün fiyatını 100₺ ve KDV oranını %20 girerseniz,
          müşteri sepetinde ve vitrinde <strong>120₺</strong> görür.
        </p>
        <p>
          Her ürünün kendi KDV oranı olabilir (ürün düzenleme ekranı). Oran girilmezse yukarıdaki varsayılan kullanılır.
          Kargo ve kapıda ödeme ücretleri KDV hariç girilir; checkout toplamına KDV eklenir.
        </p>
        <p>
          <strong>KDV pasif</strong> edildiğinde ürün, kargo ve kapıda ödeme tutarlarına vergi eklenmez;
          kayıtlı oran korunur, tekrar aktif edilince aynı oranla devam eder.
        </p>
      </div>
      <AdminButton type="button" className="mt-4" disabled={saving} onClick={() => void save()}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        KDV Kaydet
      </AdminButton>
    </AdminCard>
  );
}

function TechniciansSection() {
  const addToast = useToastStore((s) => s.add);
  const [names, setNames] = useState<string[] | null>(null);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void getTechnicians().then(setNames);
  }, []);

  useEffect(() => {
    if (names && window.location.hash === '#teknisyenler') {
      document.getElementById('teknisyenler')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [names]);

  const persist = async (next: string[], message: string) => {
    setSaving(true);
    const res = await saveTechnicians(next);
    setSaving(false);
    if (!res.success) {
      addToast(res.error ?? 'Kaydedilemedi.', 'error');
      return;
    }
    setNames(next);
    addToast(message, 'success');
  };

  const add = () => {
    const name = draft.trim();
    if (!name || !names) return;
    if (names.some((n) => n.toLocaleLowerCase('tr-TR') === name.toLocaleLowerCase('tr-TR'))) {
      addToast('Bu teknisyen zaten listede.', 'error');
      return;
    }
    setDraft('');
    void persist([...names, name], `${name} eklendi.`);
  };

  return (
    <Section title="Teknisyenler" icon={Wrench} id="teknisyenler">
      <p className="text-sm text-aq-muted mb-4">Servis talepleri bu listedeki kişilere atanır.</p>
      {names === null ? (
        <Loader2 className="h-5 w-5 animate-spin text-aq-muted" />
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {names.length === 0 && <p className="text-sm text-aq-muted">Henüz teknisyen eklenmedi.</p>}
            {names.map((n) => (
              <span key={n} className="inline-flex items-center gap-1.5 rounded-full bg-aq-cloud py-1.5 pl-3.5 pr-1.5 text-sm text-aq-ink">
                {n}
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void persist(names.filter((x) => x !== n), `${n} kaldırıldı.`)}
                  className="rounded-full p-1 text-aq-muted hover:bg-white hover:text-red-600"
                  aria-label={`${n} kaldır`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex max-w-md gap-2">
            <AdminInput
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
              placeholder="Ad Soyad"
            />
            <AdminButton type="button" onClick={add} disabled={saving || !draft.trim()}>
              <Plus className="h-4 w-4" /> Ekle
            </AdminButton>
          </div>
        </>
      )}
    </Section>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const addToast = useToastStore((s) => s.add);

  useEffect(() => {
    void getAdminSiteSettings().then((result) => {
      if (!result.ok) {
        setLoadError(result.error);
        return;
      }
      setSettings(result.data);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || saving) return;
    setSaving(true);
    const res = await saveSiteSettings(settings);
    setSaving(false);
    if (!res.success) {
      addToast(res.error ?? 'Kayıt başarısız.', 'error');
      return;
    }
    addToast('Ayarlar kaydedildi.', 'success');
  };

  if (loadError) {
    return (
      <AdminPageShell>
        <AdminPageHeader title="Site Ayarları" description={loadError} />
        <AdminButton type="button" onClick={() => window.location.reload()}>Tekrar Dene</AdminButton>
      </AdminPageShell>
    );
  }

  if (!settings) {
    return (
      <AdminPageShell>
        <AdminLoading variant="spinner" label="Ayarlar yükleniyor..." />
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell>
      <AdminPageHeader title="Site Ayarları" description="İletişim ve genel site bilgileri (Header/Footer/Checkout ile aynı şema)" />

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
              <AdminInput value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
            </div>
            <div>
              <AdminLabel>WhatsApp</AdminLabel>
              <AdminInput value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} />
            </div>
            <div>
              <AdminLabel>E-posta</AdminLabel>
              <AdminInput value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
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
            <div>
              <AdminLabel>YouTube</AdminLabel>
              <AdminInput value={settings.youtube} onChange={(e) => setSettings({ ...settings, youtube: e.target.value })} placeholder="https://youtube.com/@aquails" />
            </div>
            <div>
              <AdminLabel>X (Twitter)</AdminLabel>
              <AdminInput value={settings.twitter} onChange={(e) => setSettings({ ...settings, twitter: e.target.value })} placeholder="https://x.com/aquails" />
            </div>
          </div>
          <p className="text-xs text-aq-muted mt-2">Boş bırakılan hesaplar sitede gösterilmez.</p>
        </Section>

        <Section title="Kargo" icon={Truck}>
          <div className="max-w-xs">
            <AdminLabel>Ücretsiz Kargo Limiti (₺)</AdminLabel>
            <AdminInput
              type="number"
              value={settings.freeShippingLimit}
              onChange={(e) => setSettings({ ...settings, freeShippingLimit: Number(e.target.value) })}
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

      <div className="mt-8">
        <TechniciansSection />
      </div>
    </AdminPageShell>
  );
}
