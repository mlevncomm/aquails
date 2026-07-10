import { useState, useEffect } from 'react';
import { Globe, Phone, Truck, Save, Loader2 } from 'lucide-react';
import { getSiteSettings, saveSiteSettings, type SiteSettings } from '@/services/settingsService';
import { useToastStore } from '@/components/Toast';
import { AdminPageHeader, AdminCard, AdminInput, AdminLabel, AdminButton } from '@/components/admin/admin-ui';

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
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <AdminCard className="mb-6">
      <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Icon className="w-4 h-4 text-sky-600" />{title}
      </h3>
      {children}
    </AdminCard>
  );

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
          </div>
        </Section>

        <AdminButton type="submit" disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Ayarları Kaydet
        </AdminButton>
      </form>
    </>
  );
}
