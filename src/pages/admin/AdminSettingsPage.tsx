import { useState } from 'react';
import { Globe, Phone, Mail, MapPin, Truck, CreditCard, Image, Save, CheckCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Aquails', phone: '0850 123 45 67', whatsapp: '0532 123 45 67', email: 'info@aquails.com.tr',
    address: 'Teknopark İstanbul, Pendik/İstanbul',
    facebook: 'https://facebook.com/aquails', instagram: 'https://instagram.com/aquails',
    twitter: 'https://twitter.com/aquails', youtube: 'https://youtube.com/aquails',
    freeShippingLimit: '1500', currency: 'TRY', taxRate: '20',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6 mb-5">
      <h3 className="text-sm font-semibold text-[#0D2137] mb-4 flex items-center gap-2"><Icon className="w-4 h-4 text-[#1A73E8]" />{title}</h3>
      {children}
    </div>
  );

  return (
      <>      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Site Ayarları</h2>

      {saved && <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-3 rounded-xl text-sm font-medium mb-5"><CheckCircle className="w-4 h-4" />Ayarlar kaydedildi.</div>}

      <form onSubmit={handleSave}>
        <Section title="Genel" icon={Globe}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="text-xs text-[#8B9DAF] mb-1 block">Site Adı</label><input value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" /></div>
            <div><label className="text-xs text-[#8B9DAF] mb-1 block">Logo</label><div className="border-2 border-dashed border-[#D6E3F0] rounded-xl p-4 text-center hover:border-[#1A73E8] cursor-pointer transition-colors"><Image className="w-5 h-5 text-[#D6E3F0] mx-auto" /><p className="text-xs text-[#8B9DAF] mt-1">Logo yükleyin</p></div></div>
          </div>
        </Section>

        <Section title="İletişim" icon={Phone}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="text-xs text-[#8B9DAF] mb-1 block flex items-center gap-1"><Phone className="w-3 h-3" />Telefon</label><input value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" /></div>
            <div><label className="text-xs text-[#8B9DAF] mb-1 block">WhatsApp</label><input value={settings.whatsapp} onChange={e => setSettings({ ...settings, whatsapp: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" /></div>
            <div><label className="text-xs text-[#8B9DAF] mb-1 block flex items-center gap-1"><Mail className="w-3 h-3" />E-posta</label><input value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" /></div>
            <div><label className="text-xs text-[#8B9DAF] mb-1 block flex items-center gap-1"><MapPin className="w-3 h-3" />Adres</label><input value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" /></div>
          </div>
        </Section>

        <Section title="Sosyal Medya" icon={Globe}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(['facebook', 'instagram', 'twitter', 'youtube'] as const).map(social => (
              <div key={social}>
                <label className="text-xs text-[#8B9DAF] mb-1 block capitalize">{social}</label>
                <input value={settings[social]} onChange={e => setSettings({ ...settings, [social]: e.target.value })} placeholder={`https://${social}.com/...`} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Kargo & Ödeme" icon={Truck}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="text-xs text-[#8B9DAF] mb-1 block flex items-center gap-1"><Truck className="w-3 h-3" />Ücretsiz Kargo Limiti (₺)</label><input value={settings.freeShippingLimit} onChange={e => setSettings({ ...settings, freeShippingLimit: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" /></div>
            <div><label className="text-xs text-[#8B9DAF] mb-1 block flex items-center gap-1"><CreditCard className="w-3 h-3" />Para Birimi</label><select value={settings.currency} onChange={e => setSettings({ ...settings, currency: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl bg-white"><option value="TRY">Türk Lirası (₺)</option><option value="USD">Dolar ($)</option><option value="EUR">Euro (€)</option></select></div>
            <div><label className="text-xs text-[#8B9DAF] mb-1 block">KDV Oranı (%)</label><input value={settings.taxRate} onChange={e => setSettings({ ...settings, taxRate: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" /></div>
          </div>
        </Section>

        <button type="submit" className="flex items-center gap-2 bg-[#1A73E8] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#1557B0] transition-all">
          <Save className="w-4 h-4" /> Ayarları Kaydet
        </button>
      </form>
      </>
  );
}
