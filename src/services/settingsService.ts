import { getSupabaseOrNull } from '@/lib/supabase';

export interface SiteConfig {
  siteName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  freeShippingLimit: number;
  currency: string;
  taxRate: number;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  freeShippingThreshold: number;
  maintenanceMode: boolean;
}

export interface PaytrSettings {
  enabled: boolean;
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  testMode: boolean;
}

export interface NavLinkItem {
  id: string;
  title: string;
  url: string;
  icon: string;
  active: boolean;
  featured: boolean;
  order: number;
}

export interface BankAccount {
  bankName: string;
  accountName: string;
  iban: string;
}

const DEFAULT_SITE: SiteConfig = {
  siteName: 'Aquails',
  phone: '0850 123 45 67',
  whatsapp: '0532 123 45 67',
  email: 'info@aquails.com.tr',
  address: 'Teknopark İstanbul, Pendik/İstanbul',
  facebook: 'https://facebook.com/aquails',
  instagram: 'https://instagram.com/aquails',
  twitter: 'https://twitter.com/aquails',
  youtube: 'https://youtube.com/aquails',
  freeShippingLimit: 1500,
  currency: 'TRY',
  taxRate: 20,
};

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'Aquails',
  siteDescription: 'Su arıtma cihazları ve filtre sistemleri',
  contactEmail: 'info@aquails.com.tr',
  contactPhone: '+90 850 000 00 00',
  address: 'İstanbul, Türkiye',
  whatsapp: '',
  instagram: '',
  facebook: '',
  freeShippingThreshold: 500,
  maintenanceMode: false,
};

const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { id: '1', title: 'Ürünleri İncele', url: '/urunler', icon: 'ShoppingBag', active: true, featured: true, order: 1 },
  { id: '2', title: 'WhatsApp Destek', url: 'https://wa.me/905321234567', icon: 'MessageCircle', active: true, featured: true, order: 2 },
  { id: '3', title: 'Su Arıtma Cihazları', url: '/urunler?kategori=su-aritma', icon: 'Droplet', active: true, featured: false, order: 3 },
  { id: '4', title: 'Kampanyalar', url: '/kampanyalar', icon: 'Gift', active: true, featured: false, order: 4 },
  { id: '5', title: 'Filtre Aboneliği', url: '/filtre-aboneligi', icon: 'RefreshCw', active: true, featured: false, order: 5 },
  { id: '6', title: 'Servis Randevusu', url: '/servis-randevusu', icon: 'Wrench', active: true, featured: false, order: 6 },
  { id: '7', title: 'Sipariş Takip', url: '/siparis-takip', icon: 'Truck', active: true, featured: false, order: 7 },
  { id: '8', title: 'Instagram', url: 'https://instagram.com/aquails', icon: 'Instagram', active: true, featured: false, order: 8 },
  { id: '9', title: 'İletişim', url: '/iletisim', icon: 'Phone', active: true, featured: false, order: 9 },
];

function readText(value: Record<string, unknown> | string | null | undefined): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value.text === 'string') return value.text;
  return '';
}

async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return fallback;

  const { data } = await supabase.from('site_settings').select('value').eq('key', key).maybeSingle();
  if (!data?.value || typeof data.value !== 'object') return fallback;
  return { ...fallback, ...(data.value as Record<string, unknown>) } as T;
}

async function setSetting(key: string, value: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Ayar servisi yapılandırılmamış.' };

  const { error } = await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getSiteConfig(): Promise<SiteConfig> {
  return getSetting<SiteConfig>('site', DEFAULT_SITE);
}

export async function saveSiteConfig(config: SiteConfig): Promise<{ success: boolean; error?: string }> {
  return setSetting('site', config as unknown as Record<string, unknown>);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { ...DEFAULT_SITE_SETTINGS };

  const { data, error } = await supabase.from('site_settings').select('key, value');
  if (error || !data?.length) return { ...DEFAULT_SITE_SETTINGS };

  const map: Record<string, string> = {};
  for (const row of data) {
    map[row.key] = readText(row.value as Record<string, unknown>);
  }

  return {
    siteName: map.site_name || DEFAULT_SITE_SETTINGS.siteName,
    siteDescription: map.site_description || DEFAULT_SITE_SETTINGS.siteDescription,
    contactEmail: map.contact_email || DEFAULT_SITE_SETTINGS.contactEmail,
    contactPhone: map.contact_phone || DEFAULT_SITE_SETTINGS.contactPhone,
    address: map.address || DEFAULT_SITE_SETTINGS.address,
    whatsapp: map.whatsapp || '',
    instagram: map.instagram || '',
    facebook: map.facebook || '',
    freeShippingThreshold: Number(map.free_shipping_threshold) || DEFAULT_SITE_SETTINGS.freeShippingThreshold,
    maintenanceMode: map.maintenance_mode === 'true',
  };
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  const supabase = getSupabaseOrNull();
  if (!supabase) throw new Error('Supabase yapılandırılmamış.');

  const rows: { key: string; value: Record<string, unknown> }[] = [
    { key: 'site_name', value: { text: settings.siteName } },
    { key: 'site_description', value: { text: settings.siteDescription } },
    { key: 'contact_email', value: { text: settings.contactEmail } },
    { key: 'contact_phone', value: { text: settings.contactPhone } },
    { key: 'address', value: { text: settings.address } },
    { key: 'whatsapp', value: { text: settings.whatsapp } },
    { key: 'instagram', value: { text: settings.instagram } },
    { key: 'facebook', value: { text: settings.facebook } },
    { key: 'free_shipping_threshold', value: { text: String(settings.freeShippingThreshold) } },
    { key: 'maintenance_mode', value: { text: String(settings.maintenanceMode) } },
  ];

  for (const row of rows) {
    const { error } = await supabase.from('site_settings').upsert(row, { onConflict: 'key' });
    if (error) throw error;
  }
}

export interface PaytrPublicStatus {
  enabled: boolean;
  testMode: boolean;
}

export async function getPaytrPublicStatus(): Promise<PaytrPublicStatus> {
  return getSetting<PaytrPublicStatus>('paytr_public', { enabled: false, testMode: true });
}

export async function getPaytrSettings(): Promise<PaytrSettings> {
  return getSetting<PaytrSettings>('paytr', {
    enabled: false,
    merchantId: '',
    merchantKey: '',
    merchantSalt: '',
    testMode: true,
  });
}

export async function savePaytrSettings(settings: PaytrSettings): Promise<{ success: boolean; error?: string }> {
  const result = await setSetting('paytr', settings as unknown as Record<string, unknown>);
  if (result.success) {
    await setSetting('paytr_public', {
      enabled: settings.enabled,
      testMode: settings.testMode,
    });
  }
  return result;
}

export async function getNavLinks(): Promise<NavLinkItem[]> {
  const links = await getSetting<{ links: NavLinkItem[] }>('nav_links', { links: DEFAULT_NAV_LINKS });
  return [...links.links].filter((l) => l.active).sort((a, b) => a.order - b.order);
}

export async function saveNavLinks(links: NavLinkItem[]): Promise<{ success: boolean; error?: string }> {
  return setSetting('nav_links', { links });
}

export async function getBankAccounts(): Promise<BankAccount[]> {
  const data = await getSetting<{ accounts: BankAccount[] }>('bank_accounts', {
    accounts: [
      { bankName: 'Ziraat Bankası', accountName: 'Aquails Su Arıtma Ltd. Şti.', iban: 'TR00 0000 0000 0000 0000 0000 00' },
    ],
  });
  return data.accounts;
}

export async function saveBankAccounts(accounts: BankAccount[]): Promise<{ success: boolean; error?: string }> {
  return setSetting('bank_accounts', { accounts });
}

export function isPaytrConfigured(settings: PaytrPublicStatus | PaytrSettings): boolean {
  return Boolean(settings.enabled);
}
