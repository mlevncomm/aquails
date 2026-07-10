import { getSupabaseOrNull } from '@/lib/supabase';

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

const DEFAULTS: SiteSettings = {
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

function readText(value: Record<string, unknown> | string | null | undefined): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value.text === 'string') return value.text;
  return '';
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { ...DEFAULTS };

  const { data, error } = await supabase.from('site_settings').select('key, value');
  if (error || !data?.length) return { ...DEFAULTS };

  const map: Record<string, string> = {};
  for (const row of data) {
    map[row.key] = readText(row.value as Record<string, unknown>);
  }

  return {
    siteName: map.site_name || DEFAULTS.siteName,
    siteDescription: map.site_description || DEFAULTS.siteDescription,
    contactEmail: map.contact_email || DEFAULTS.contactEmail,
    contactPhone: map.contact_phone || DEFAULTS.contactPhone,
    address: map.address || DEFAULTS.address,
    whatsapp: map.whatsapp || '',
    instagram: map.instagram || '',
    facebook: map.facebook || '',
    freeShippingThreshold: Number(map.free_shipping_threshold) || DEFAULTS.freeShippingThreshold,
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

export interface NavLink {
  id: string;
  label: string;
  url: string;
  sortOrder: number;
}

export async function getNavLinks(): Promise<NavLink[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .like('key', 'nav_link_%');

  if (error) return [];

  const links: NavLink[] = [];
  for (const row of data ?? []) {
    const parsed = row.value as { label?: string; url?: string; sortOrder?: number };
    if (parsed.label && parsed.url) {
      links.push({
        id: row.key,
        label: parsed.label,
        url: parsed.url,
        sortOrder: parsed.sortOrder ?? 0,
      });
    }
  }
  return links.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function saveNavLinks(links: Omit<NavLink, 'id'>[]): Promise<void> {
  const supabase = getSupabaseOrNull();
  if (!supabase) throw new Error('Supabase yapılandırılmamış.');

  const { data: existing } = await supabase
    .from('site_settings')
    .select('key')
    .like('key', 'nav_link_%');

  for (const row of existing ?? []) {
    await supabase.from('site_settings').delete().eq('key', row.key);
  }

  for (let i = 0; i < links.length; i++) {
    const key = `nav_link_${i}`;
    const { error } = await supabase.from('site_settings').upsert(
      {
        key,
        value: { ...links[i], sortOrder: i },
      },
      { onConflict: 'key' },
    );
    if (error) throw error;
  }
}
