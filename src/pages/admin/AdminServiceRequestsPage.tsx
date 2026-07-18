import { useState, useEffect, useCallback } from 'react';
import { Wrench, Clock, MapPin, ChevronDown } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { getServiceRequests, updateServiceRequest, type AdminServiceRequest } from '@/services/serviceRequestService';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminCard,
  AdminSelect,
  AdminTableWrap,
  AdminLoading,
  AdminEmpty,
} from '@/components/admin/admin-ui';

const techs = ['Mehmet Tekniker', 'Ali Tekniker', 'Serkan Tekniker'];
const statuses = ['pending', 'scheduled', 'in_progress', 'completed', 'cancelled'] as const;

export default function AdminServiceRequestsPage() {
  const [list, setList] = useState<AdminServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setList(await getServiceRequests());
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const assignTech = async (id: string, tech: string) => {
    if (!tech || tech === 'Ata') return;
    await updateServiceRequest(id, { assigned_to: tech, status: 'scheduled' });
    void load();
  };

  const updateStatus = async (id: string, status: typeof statuses[number]) => {
    await updateServiceRequest(id, { status });
    void load();
  };

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Servis Talepleri"
        description="Kurulum ve bakım taleplerini atayın ve durumlarını güncelleyin."
      />

      {loading ? (
        <AdminLoading label="Talepler yükleniyor..." />
      ) : list.length === 0 ? (
        <AdminCard padding={false}>
          <AdminEmpty icon={Wrench} message="Servis talebi bulunamadı" />
        </AdminCard>
      ) : (
        <AdminTableWrap stickyFirst>
          <table className="w-full">
            <thead>
              <tr className="bg-aq-ice border-b border-aq-border/60">
                {['Müşteri', 'Cihaz', 'Tip', 'Adres', 'Tarih', 'Durum', 'Teknisyen', 'İşlem'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-aq-muted uppercase whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id} className="border-b border-aq-border/60 last:border-0 hover:bg-aq-ice/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-aq-sky rounded-full flex items-center justify-center text-xs font-medium text-aq-blue">
                        {r.customer[0]}
                      </div>
                      <span className="text-sm font-medium text-aq-text">{r.customer}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-aq-muted">{r.device}</td>
                  <td className="px-4 py-3 text-sm text-aq-text">
                    <span className="flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5 text-aq-muted" />
                      {r.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-aq-muted max-w-[140px] truncate">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {r.address}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-aq-muted whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {r.date}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3">
                    {r.tech ? (
                      <span className="text-xs text-aq-muted bg-aq-ice px-2 py-1 rounded-md">{r.tech}</span>
                    ) : (
                      <div className="relative">
                        <AdminSelect
                          onChange={(e) => void assignTech(r.id, e.target.value)}
                          className="text-xs py-1 pr-6"
                          defaultValue="Ata"
                        >
                          <option>Ata</option>
                          {techs.map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </AdminSelect>
                        <ChevronDown className="w-3 h-3 text-aq-muted absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <AdminSelect
                        onChange={(e) => void updateStatus(r.id, e.target.value as typeof statuses[number])}
                        value={r.status}
                        className="text-xs py-1 pr-6"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s === 'pending'
                              ? 'Bekliyor'
                              : s === 'scheduled'
                                ? 'Planlandı'
                                : s === 'in_progress'
                                  ? 'Devam Ediyor'
                                  : s === 'completed'
                                    ? 'Tamamlandı'
                                    : 'İptal'}
                          </option>
                        ))}
                      </AdminSelect>
                      <ChevronDown className="w-3 h-3 text-aq-muted absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminTableWrap>
      )}
    </AdminPageShell>
  );
}
