import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { Search, Users, Download, Mail, Phone, MapPin, Package, Award, Filter, Loader2 } from 'lucide-react';
import { getCustomers, type CustomerListItem } from '@/services/customerService';
import { getCustomerOrders, type CustomerOrder } from '@/services/orderService';
import { getAddresses, type Address } from '@/services/addressService';
import { getLoyaltyHistory } from '@/services/loyaltyService';
import { getFilterDevices, type FilterDevice } from '@/services/filterTrackingService';
import { orderStatusToTr } from '@/lib/orderStatus';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminFilterBar,
  AdminInput,
  AdminSelect,
  AdminLoading,
  AdminEmpty,
  AdminTableWrap,
  AdminDesktopOnly,
  AdminMobileCardList,
  AdminCard,
  AdminButton,
  AdminDrawer,
  AdminOrderStatusBadge,
  AdminStatCard,
} from '@/components/admin/admin-ui';

type Sort = 'newest' | 'spent' | 'orders' | 'points';

interface Detail {
  orders: CustomerOrder[];
  addresses: Address[];
  loyalty: { id: string; amount: number; type: string; description: string; date: string }[];
  devices: FilterDevice[];
}

function exportCsv(rows: CustomerListItem[]) {
  const header = ['Ad Soyad', 'E-posta', 'Telefon', 'Sipariş', 'Harcama (TL)', 'Puan', 'Kayıt'];
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [header, ...rows.map((c) => [c.name, c.email, c.phone, c.orders, c.spent.toFixed(2), c.loyaltyPoints, c.date])]
    .map((r) => r.map(esc).join(';'));
  // BOM so Excel opens Turkish characters correctly.
  const blob = new Blob([`\uFEFF${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aquails-musteriler-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<Sort>('newest');
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CustomerListItem | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);

  useEffect(() => {
    void getCustomers().then((data) => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    setDetail(null);
    void Promise.all([
      getCustomerOrders(selected.id),
      getAddresses(selected.id),
      getLoyaltyHistory(selected.id),
      getFilterDevices(selected.id),
    ]).then(([orders, addresses, loyalty, devices]) => {
      if (!cancelled) setDetail({ orders, addresses, loyalty, devices });
    });
    return () => { cancelled = true; };
  }, [selected]);

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('tr-TR');
    const list = customers.filter((c) => !q || `${c.name} ${c.email} ${c.phone}`.toLocaleLowerCase('tr-TR').includes(q));
    const sorted = [...list];
    if (sort === 'spent') sorted.sort((a, b) => b.spent - a.spent);
    if (sort === 'orders') sorted.sort((a, b) => b.orders - a.orders);
    if (sort === 'points') sorted.sort((a, b) => b.loyaltyPoints - a.loyaltyPoints);
    return sorted;
  }, [customers, search, sort]);

  const totals = useMemo(() => ({
    count: customers.length,
    buyers: customers.filter((c) => c.orders > 0).length,
    revenue: customers.reduce((s, c) => s + c.spent, 0),
  }), [customers]);

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Müşteriler"
        description="Kayıtlı müşterileri arayın; bir müşteriye tıklayarak sipariş, adres, filtre ve puan geçmişini görün."
        action={
          <AdminButton variant="secondary" onClick={() => exportCsv(filtered)} disabled={filtered.length === 0}>
            <Download className="h-4 w-4" /> CSV İndir
          </AdminButton>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <AdminStatCard label="Kayıtlı müşteri" value={totals.count.toLocaleString('tr-TR')} icon={<Users className="h-5 w-5" />} />
        <AdminStatCard label="Sipariş veren" value={totals.buyers.toLocaleString('tr-TR')} sub={totals.count ? `%${Math.round((totals.buyers / totals.count) * 100)} dönüşüm` : undefined} icon={<Package className="h-5 w-5" />} />
        <AdminStatCard label="Toplam harcama" value={`${totals.revenue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺`} icon={<Award className="h-5 w-5" />} />
      </div>

      <AdminFilterBar>
        <div className="relative min-w-0 flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-aq-muted" />
          <AdminInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ad, e-posta veya telefon…" className="pl-9" />
        </div>
        <AdminSelect value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="sm:w-56">
          <option value="newest">En yeni kayıt</option>
          <option value="spent">En çok harcayan</option>
          <option value="orders">En çok sipariş</option>
          <option value="points">En çok puan</option>
        </AdminSelect>
      </AdminFilterBar>

      {loading ? (
        <AdminLoading label="Müşteriler yükleniyor..." />
      ) : filtered.length === 0 ? (
        <AdminCard padding={false}>
          <AdminEmpty icon={Users} title="Müşteri bulunamadı" message="Arama kriterlerinize uygun müşteri kaydı yok." />
        </AdminCard>
      ) : (
        <>
          <AdminMobileCardList>
            {filtered.map((c) => (
              <button key={c.id} type="button" onClick={() => setSelected(c)} className="block w-full text-left">
                <AdminCard className="!p-4">
                  <p className="truncate text-sm font-semibold text-aq-ink">{c.name}</p>
                  <p className="truncate text-xs text-aq-muted">{c.email} · {c.phone}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 border-t border-aq-border/50 pt-3 text-center">
                    <div><p className="text-[10px] uppercase text-aq-muted">Sipariş</p><p className="text-sm font-semibold text-aq-ink">{c.orders}</p></div>
                    <div><p className="text-[10px] uppercase text-aq-muted">Harcama</p><p className="text-sm font-semibold text-aq-ink">{c.spent.toLocaleString('tr-TR')}₺</p></div>
                    <div><p className="text-[10px] uppercase text-aq-muted">Puan</p><p className="text-sm font-semibold text-aq-ink">{c.loyaltyPoints}</p></div>
                  </div>
                </AdminCard>
              </button>
            ))}
          </AdminMobileCardList>

          <AdminDesktopOnly>
            <AdminTableWrap stickyFirst>
              <table className="w-full">
                <thead>
                  <tr>
                    {['Müşteri', 'Telefon', 'Sipariş', 'Harcama', 'Puan', 'Kayıt'].map((h) => (
                      <th key={h} className="whitespace-nowrap px-4 py-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} onClick={() => setSelected(c)} className="cursor-pointer">
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-aq-ink">{c.name}</p>
                        <p className="text-xs text-aq-muted">{c.email}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-aq-muted">{c.phone}</td>
                      <td className="px-4 py-3 text-sm text-aq-ink">{c.orders}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-aq-ink">{c.spent.toLocaleString('tr-TR')}₺</td>
                      <td className="px-4 py-3 text-sm text-aq-ink">{c.loyaltyPoints}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-[13px] text-aq-muted">{c.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AdminTableWrap>
          </AdminDesktopOnly>
        </>
      )}

      <AdminDrawer open={!!selected} title={selected?.name ?? ''} onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 text-[13px]">
              <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-1.5 rounded-full bg-aq-cloud px-3 py-1.5 text-aq-ink hover:bg-aq-cloud"><Mail className="h-3.5 w-3.5" />{selected.email}</a>
              {selected.phone !== '—' && (
                <a href={`tel:${selected.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 rounded-full bg-aq-cloud px-3 py-1.5 text-aq-ink hover:bg-aq-cloud"><Phone className="h-3.5 w-3.5" />{selected.phone}</a>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Sipariş', value: selected.orders },
                { label: 'Harcama', value: `${selected.spent.toLocaleString('tr-TR')}₺` },
                { label: 'Puan', value: selected.loyaltyPoints },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-aq-cloud px-2 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-aq-muted">{s.label}</p>
                  <p className="mt-1 text-base font-bold text-aq-ink">{s.value}</p>
                </div>
              ))}
            </div>

            {!detail ? (
              <div className="flex justify-center py-10 text-aq-muted"><Loader2 className="h-5 w-5 animate-spin" /></div>
            ) : (
              <>
                <section>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-aq-ink"><Package className="h-4 w-4" /> Siparişler</h3>
                  {detail.orders.length === 0 ? (
                    <p className="text-sm text-aq-muted">Henüz sipariş yok.</p>
                  ) : (
                    <ul className="divide-y divide-aq-border/60 rounded-xl ring-1 ring-aq-border/60">
                      {detail.orders.map((o) => (
                        <li key={o.id}>
                          <Link to={`/admin/siparisler/${o.id}`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-aq-cloud/50">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-aq-ink">{o.orderNo}</p>
                              <p className="truncate text-xs text-aq-muted">{o.date} · {o.items.length} ürün</p>
                            </div>
                            <div className="flex flex-shrink-0 items-center gap-2">
                              <span className="text-sm font-semibold text-aq-ink">{o.total.toLocaleString('tr-TR')}₺</span>
                              <AdminOrderStatusBadge status={orderStatusToTr(o.status)} />
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-aq-ink"><MapPin className="h-4 w-4" /> Adresler</h3>
                  {detail.addresses.length === 0 ? (
                    <p className="text-sm text-aq-muted">Kayıtlı adres yok.</p>
                  ) : (
                    <ul className="space-y-2">
                      {detail.addresses.map((a) => (
                        <li key={a.id} className="rounded-xl bg-aq-cloud/60 px-4 py-3 text-sm">
                          <p className="font-semibold text-aq-ink">{a.title}{a.isDefault && <span className="ml-2 text-xs font-medium text-aq-muted">(varsayılan)</span>}</p>
                          <p className="text-aq-ink/75">{a.fullAddress}</p>
                          <p className="text-xs text-aq-muted">{a.district} / {a.city}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-aq-ink"><Filter className="h-4 w-4" /> Filtre cihazları</h3>
                  {detail.devices.length === 0 ? (
                    <p className="text-sm text-aq-muted">Kayıtlı cihaz yok.</p>
                  ) : (
                    <ul className="space-y-2">
                      {detail.devices.map((d) => (
                        <li key={d.id} className="flex items-center justify-between rounded-xl bg-aq-cloud/60 px-4 py-3 text-sm">
                          <span className="text-aq-ink">{d.deviceName || d.filterName}</span>
                          <span className={d.daysRemaining < 0 ? 'font-semibold text-red-600' : 'text-aq-muted'}>
                            {d.daysRemaining < 0 ? `${Math.abs(d.daysRemaining)} gün gecikti` : `${d.daysRemaining} gün kaldı`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-aq-ink"><Award className="h-4 w-4" /> Puan geçmişi</h3>
                    <Link to="/admin/sadakat" className="text-xs font-semibold text-aq-ink underline-offset-4 hover:underline">Puan düzelt</Link>
                  </div>
                  {detail.loyalty.length === 0 ? (
                    <p className="text-sm text-aq-muted">Puan işlemi yok.</p>
                  ) : (
                    <ul className="divide-y divide-aq-border/60">
                      {detail.loyalty.slice(0, 10).map((t) => (
                        <li key={t.id} className="flex justify-between gap-3 py-2 text-sm">
                          <span className="truncate text-aq-ink/80">{t.description || t.type} <span className="text-xs text-aq-muted">· {t.date}</span></span>
                          <span className={t.amount >= 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-red-600'}>{t.amount >= 0 ? '+' : ''}{t.amount}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </>
            )}
          </div>
        )}
      </AdminDrawer>
    </AdminPageShell>
  );
}
