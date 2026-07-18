import { useState, useEffect } from 'react';
import { Search, Users } from 'lucide-react';
import { getCustomers, type CustomerListItem } from '@/services/customerService';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminFilterBar,
  AdminInput,
  AdminLoading,
  AdminEmpty,
  AdminTableWrap,
  AdminDesktopOnly,
  AdminMobileCardList,
  AdminCard,
} from '@/components/admin/admin-ui';

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getCustomers().then((data) => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  const filtered = customers.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Müşteri Yönetimi"
        description="Kayıtlı müşterileri arayın ve sipariş özetlerini görün."
      />

      <AdminFilterBar>
        <div className="relative flex-1 min-w-0 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aq-muted pointer-events-none" />
          <AdminInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Müşteri ara..."
            className="pl-9"
          />
        </div>
      </AdminFilterBar>

      {loading ? (
        <AdminLoading label="Müşteriler yükleniyor..." />
      ) : filtered.length === 0 ? (
        <AdminCard padding={false}>
          <AdminEmpty
            icon={Users}
            title="Müşteri bulunamadı"
            message="Arama kriterlerinize uygun müşteri kaydı yok."
          />
        </AdminCard>
      ) : (
        <>
          <AdminMobileCardList>
            {filtered.map((c) => (
              <AdminCard key={c.id} className="!p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-aq-sky rounded-full flex items-center justify-center text-sm font-semibold text-aq-blue flex-shrink-0">
                    {c.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-aq-text truncate">{c.name}</p>
                    <p className="text-[11px] text-aq-muted truncate">{c.email}</p>
                    <p className="text-[11px] text-aq-muted mt-0.5">{c.phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-aq-border/50 text-center">
                  <div>
                    <p className="text-[10px] text-aq-muted uppercase">Sipariş</p>
                    <p className="text-sm font-semibold text-aq-text">{c.orders}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-aq-muted uppercase">Harcama</p>
                    <p className="text-sm font-semibold text-aq-text">{c.spent.toLocaleString('tr-TR')}₺</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-aq-muted uppercase">Puan</p>
                    <p className="text-sm font-semibold text-aq-blue">{c.loyaltyPoints}</p>
                  </div>
                </div>
              </AdminCard>
            ))}
          </AdminMobileCardList>

          <AdminDesktopOnly>
            <AdminTableWrap stickyFirst>
              <table className="w-full">
                <thead>
                  <tr className="bg-aq-ice">
                    {['Müşteri', 'E-posta', 'Telefon', 'Sipariş', 'Harcama', 'Puan', 'Kayıt'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-[11px] font-semibold text-aq-muted uppercase whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b border-aq-border/60 last:border-0 hover:bg-aq-ice/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 bg-aq-sky rounded-full flex items-center justify-center text-xs font-medium text-aq-blue flex-shrink-0">
                            {c.name[0]}
                          </div>
                          <span className="text-sm font-medium text-aq-text truncate">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-aq-muted">{c.email}</td>
                      <td className="px-4 py-3 text-sm text-aq-muted whitespace-nowrap">{c.phone}</td>
                      <td className="px-4 py-3 text-sm text-aq-text">{c.orders}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-aq-text whitespace-nowrap">
                        {c.spent.toLocaleString('tr-TR')}₺
                      </td>
                      <td className="px-4 py-3 text-sm text-aq-blue">{c.loyaltyPoints}</td>
                      <td className="px-4 py-3 text-[13px] text-aq-muted whitespace-nowrap">{c.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AdminTableWrap>
          </AdminDesktopOnly>
        </>
      )}
    </AdminPageShell>
  );
}
