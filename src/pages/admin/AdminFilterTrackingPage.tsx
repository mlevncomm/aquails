import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { getServiceRequests } from '@/services/serviceRequestService';
import type { AdminServiceRequest } from '@/services/serviceRequestService';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminTableWrap,
  AdminEmpty,
  AdminLoading,
  AdminBadge,
  AdminCard,
} from '@/components/admin/admin-ui';

export default function AdminFilterTrackingPage() {
  const [requests, setRequests] = useState<AdminServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getServiceRequests().then((all) => {
      setRequests(all.filter((r) => r.type === 'Filtre Değişimi'));
      setLoading(false);
    });
  }, []);

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Filtre Değişim Takipleri"
        description="Filtre değişim servis talepleri"
      />

      {loading ? (
        <AdminLoading />
      ) : requests.length === 0 ? (
        <AdminCard padding={false}>
          <AdminEmpty icon={Filter} message="Filtre değişim talebi bulunamadı" />
        </AdminCard>
      ) : (
        <AdminTableWrap stickyFirst>
          <table className="w-full">
            <thead>
              <tr className="bg-aq-ice border-b border-aq-border/60">
                {['Müşteri', 'Cihaz', 'Adres', 'Tarih', 'Durum', 'Teknisyen'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-aq-muted uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((f) => (
                <tr key={f.id} className="border-b border-aq-border/60 last:border-0 hover:bg-aq-ice/50">
                  <td className="px-4 py-3 text-sm font-medium text-aq-text">{f.customer}</td>
                  <td className="px-4 py-3 text-sm text-aq-muted">{f.device}</td>
                  <td className="px-4 py-3 text-sm text-aq-muted max-w-[200px] truncate">{f.address}</td>
                  <td className="px-4 py-3 text-sm text-aq-muted">{f.date}</td>
                  <td className="px-4 py-3">
                    <AdminBadge tone="info">{f.status}</AdminBadge>
                  </td>
                  <td className="px-4 py-3 text-sm text-aq-muted">{f.tech || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminTableWrap>
      )}
    </AdminPageShell>
  );
}
