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

const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { id: '1', title: 'Ürünleri İncele', url: '/urunler', icon: 'ShoppingBag', active: true, featured: false, order: 1 },
  { id: '2', title: 'Su Arıtma Cihazları', url: '/urunler?kategori=su-aritma', icon: 'Droplet', active: true, featured: true, order: 2 },
  { id: '3', title: 'Kampanyalar', url: '/kampanyalar', icon: 'Gift', active: true, featured: false, order: 3 },
  { id: '4', title: 'Filtre Aboneliği', url: '/filtre-aboneligi', icon: 'RefreshCw', active: true, featured: false, order: 4 },
  { id: '5', title: 'Servis Randevusu Al', url: '/servis-randevusu', icon: 'Wrench', active: true, featured: true, order: 5 },
  { id: '6', title: 'Sipariş Takip', url: '/siparis-takip', icon: 'Truck', active: true, featured: false, order: 6 },
  { id: '7', title: 'WhatsApp Destek', url: 'https://wa.me/905321234567', icon: 'MessageCircle', active: true, featured: false, order: 7 },
  { id: '8', title: 'Instagram', url: 'https://instagram.com/aquails', icon: 'Instagram', active: true, featured: false, order: 8 },
  { id: '9', title: 'İletişim', url: '/iletisim', icon: 'Phone', active: true, featured: false, order: 9 },
];

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
  return setSetting('paytr', settings as unknown as Record<string, unknown>);
}

export async function getNavLinks(): Promise<NavLinkItem[]> {
  const links = await getSetting<{ links: NavLinkItem[] }>('nav_links', { links: DEFAULT_NAV_LINKS });
  return [...links.links].sort((a, b) => a.order - b.order);
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

export function isPaytrConfigured(settings: PaytrSettings): boolean {
  return Boolean(
    settings.enabled &&
      settings.merchantId.trim() &&
      settings.merchantKey.trim() &&
      settings.merchantSalt.trim()
  );
}
