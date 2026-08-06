import { getSupabaseOrNull } from '@/lib/supabase';
import { fail, ok, type MutationResult } from '@/lib/mutationResult';

/** Canonical site settings shared by admin write + public Header/Footer/Contact/Checkout. */
export interface SiteConfig {
  siteName: string;
  siteDescription: string;
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
  maintenanceMode: boolean;
}

/** Admin form alias — same canonical fields as SiteConfig. */
export type SiteSettings = SiteConfig;

export interface PaytrSettings {
  enabled: boolean;
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

export type SettingsResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const DEFAULT_SITE: SiteConfig = {
  siteName: 'Aquails',
  siteDescription: 'Su arıtma cihazları ve filtre sistemleri',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  facebook: '',
  instagram: '',
  twitter: '',
  youtube: '',
  freeShippingLimit: 1500,
  currency: 'TRY',
  taxRate: 20,
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

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readText(value: unknown): string {
  if (typeof value === 'string') return value;
  const rec = asRecord(value);
  if (rec && typeof rec.text === 'string') return rec.text;
  return '';
}

function normalizeSite(raw: Record<string, unknown> | null | undefined): SiteConfig {
  const r = raw ?? {};
  const freeLimit = Number(
    r.freeShippingLimit ?? r.freeShippingThreshold ?? DEFAULT_SITE.freeShippingLimit,
  );
  const tax = Number(r.taxRate ?? DEFAULT_SITE.taxRate);
  return {
    siteName: String(r.siteName ?? DEFAULT_SITE.siteName),
    siteDescription: String(r.siteDescription ?? DEFAULT_SITE.siteDescription),
    phone: String(r.phone ?? r.contactPhone ?? DEFAULT_SITE.phone),
    whatsapp: String(r.whatsapp ?? DEFAULT_SITE.whatsapp),
    email: String(r.email ?? r.contactEmail ?? DEFAULT_SITE.email),
    address: String(r.address ?? DEFAULT_SITE.address),
    facebook: String(r.facebook ?? DEFAULT_SITE.facebook),
    instagram: String(r.instagram ?? DEFAULT_SITE.instagram),
    twitter: String(r.twitter ?? DEFAULT_SITE.twitter),
    youtube: String(r.youtube ?? DEFAULT_SITE.youtube),
    freeShippingLimit: Number.isFinite(freeLimit) && freeLimit >= 0 ? freeLimit : DEFAULT_SITE.freeShippingLimit,
    currency: String(r.currency ?? DEFAULT_SITE.currency),
    taxRate: Number.isFinite(tax) && tax >= 0 && tax <= 100 ? tax : DEFAULT_SITE.taxRate,
    maintenanceMode: r.maintenanceMode === true || r.maintenanceMode === 'true',
  };
}

/** Merge legacy per-key rows into canonical site object when present. */
function mergeLegacyKeys(map: Record<string, unknown>, base: SiteConfig): SiteConfig {
  return normalizeSite({
    ...base,
    siteName: readText(map.site_name) || base.siteName,
    siteDescription: readText(map.site_description) || base.siteDescription,
    email: readText(map.contact_email) || base.email,
    phone: readText(map.contact_phone) || base.phone,
    address: readText(map.address) || base.address,
    whatsapp: readText(map.whatsapp) || base.whatsapp,
    instagram: readText(map.instagram) || base.instagram,
    facebook: readText(map.facebook) || base.facebook,
    freeShippingLimit: Number(readText(map.free_shipping_threshold)) || base.freeShippingLimit,
    maintenanceMode: readText(map.maintenance_mode) === 'true' || base.maintenanceMode,
  });
}

async function fetchSiteRaw(): Promise<SettingsResult<SiteConfig>> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { ok: false, error: 'Ayar servisi yapılandırılmamış.' };

  const { data, error } = await supabase.from('site_settings').select('key, value');
  if (error) return { ok: false, error: error.message };

  const map: Record<string, unknown> = {};
  for (const row of data ?? []) map[row.key] = row.value;

  const siteObj = asRecord(map.site);
  let config = normalizeSite(siteObj);
  if (!siteObj && (data?.length ?? 0) > 0) {
    config = mergeLegacyKeys(map, config);
  }
  return { ok: true, data: config };
}

async function setSetting(key: string, value: Record<string, unknown>): Promise<MutationResult> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return fail('Ayar servisi yapılandırılmamış.');

  const { error } = await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' });
  if (error) return fail(error.message);
  return ok();
}

/** Public read — falls back to defaults only when Supabase is unconfigured. */
export async function getSiteConfig(): Promise<SiteConfig> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { ...DEFAULT_SITE };

  const result = await fetchSiteRaw();
  if (!result.ok) return { ...DEFAULT_SITE };
  return result.data;
}

/** Admin read — surfaces DB errors instead of silent defaults. */
export async function getAdminSiteSettings(): Promise<SettingsResult<SiteSettings>> {
  return fetchSiteRaw();
}

/** @deprecated Prefer getAdminSiteSettings for admin UI */
export async function getSiteSettings(): Promise<SiteSettings> {
  const result = await fetchSiteRaw();
  if (!result.ok) return { ...DEFAULT_SITE };
  return result.data;
}

export async function saveSiteSettings(settings: SiteSettings): Promise<MutationResult> {
  const canonical: SiteConfig = normalizeSite({
    ...settings,
    freeShippingLimit: settings.freeShippingLimit,
    phone: settings.phone,
    email: settings.email,
  });
  return setSetting('site', canonical as unknown as Record<string, unknown>);
}

export async function saveSiteConfig(config: SiteConfig): Promise<MutationResult> {
  return saveSiteSettings(config);
}

export interface PaytrPublicStatus {
  enabled: boolean;
  testMode: boolean;
}

export async function getPaytrPublicStatus(): Promise<PaytrPublicStatus> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { enabled: false, testMode: true };
  const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'paytr_public').maybeSingle();
  if (error || !data?.value) return { enabled: false, testMode: true };
  const v = asRecord(data.value) ?? {};
  return { enabled: v.enabled === true, testMode: v.testMode !== false };
}

export async function getPaytrSettings(): Promise<SettingsResult<PaytrSettings>> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { ok: false, error: 'Ayar servisi yapılandırılmamış.' };
  const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'paytr_public').maybeSingle();
  if (error) return { ok: false, error: error.message };
  const v = asRecord(data?.value) ?? {};
  return { ok: true, data: { enabled: v.enabled === true, testMode: v.testMode !== false } };
}

export async function savePaytrSettings(settings: PaytrSettings): Promise<MutationResult> {
  return setSetting('paytr_public', { enabled: settings.enabled, testMode: settings.testMode });
}

/** Public — active links only. */
export async function getNavLinks(): Promise<NavLinkItem[]> {
  const all = await getAdminNavLinks();
  if (!all.ok) return DEFAULT_NAV_LINKS.filter((l) => l.active).sort((a, b) => a.order - b.order);
  return all.data.filter((l) => l.active).sort((a, b) => a.order - b.order);
}

/** Admin — includes inactive links. */
export async function getAdminNavLinks(): Promise<SettingsResult<NavLinkItem[]>> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { ok: false, error: 'Ayar servisi yapılandırılmamış.' };

  const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'nav_links').maybeSingle();
  if (error) return { ok: false, error: error.message };

  const links = asRecord(data?.value)?.links;
  if (!Array.isArray(links) || links.length === 0) {
    return { ok: true, data: [...DEFAULT_NAV_LINKS] };
  }
  return {
    ok: true,
    data: [...(links as NavLinkItem[])].sort((a, b) => a.order - b.order),
  };
}

export async function saveNavLinks(links: NavLinkItem[]): Promise<MutationResult> {
  return setSetting('nav_links', { links });
}

/** No fake TR00 placeholder — empty means bank transfer unavailable. */
export async function getBankAccounts(): Promise<BankAccount[]> {
  const result = await getAdminBankAccounts();
  if (!result.ok) return [];
  return result.data;
}

export async function getAdminBankAccounts(): Promise<SettingsResult<BankAccount[]>> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { ok: false, error: 'Ayar servisi yapılandırılmamış.' };

  const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'bank_accounts').maybeSingle();
  if (error) return { ok: false, error: error.message };

  const accounts = asRecord(data?.value)?.accounts;
  if (!Array.isArray(accounts)) return { ok: true, data: [] };

  const cleaned = (accounts as BankAccount[]).filter(
    (a) => a.bankName?.trim() && a.iban?.trim() && !/^TR0+$/i.test(a.iban.replace(/\s/g, '')),
  );
  return { ok: true, data: cleaned };
}

export async function saveBankAccounts(accounts: BankAccount[]): Promise<MutationResult> {
  const cleaned = accounts.filter((a) => a.bankName?.trim() && a.iban?.trim());
  return setSetting('bank_accounts', { accounts: cleaned });
}

export function isPaytrConfigured(settings: PaytrPublicStatus | PaytrSettings): boolean {
  return Boolean(settings.enabled);
}

export function hasConfiguredBankAccounts(accounts: BankAccount[]): boolean {
  return accounts.some(
    (a) => a.bankName?.trim() && a.iban?.trim() && !/^TR0+$/i.test(a.iban.replace(/\s/g, '')),
  );
}

/** Compat getter used by cart pricing — freeShippingLimit from canonical site. */
export async function getFreeShippingThreshold(): Promise<number> {
  const cfg = await getSiteConfig();
  return cfg.freeShippingLimit;
}
