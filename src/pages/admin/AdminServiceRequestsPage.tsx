import { useState, useEffect, useCallback } from 'react';
import { Wrench, Clock, MapPin, ChevronDown } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { getServiceRequests, updateServiceRequest, type AdminServiceRequest } from '@/services/serviceRequestService';

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
    <>
      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Servis Talepleri</h2>
      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-sm text-[#8B9DAF]">Talepler yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FBFF]">
                  {['Müşteri', 'Cihaz', 'Tip', 'Adres', 'Tarih', 'Durum', 'Teknisyen', 'İşlem'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-[#EBF3FF] rounded-full flex items-center justify-center text-xs font-bold text-[#1A73E8]">
                          {r.customer[0]}
                        </div>
                        <span className="text-sm font-medium text-[#0D2137]">{r.customer}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5A6B7B]">{r.device}</td>
                    <td className="px-4 py-3 text-sm text-[#0D2137] flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5 text-[#8B9DAF]" />
                      {r.type}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5A6B7B] max-w-[140px] truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {r.address}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#8B9DAF] whitespace-nowrap flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {r.date}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-3">
                      {r.tech ? (
                        <span className="text-xs text-[#5A6B7B] bg-[#F0F6FF] px-2 py-1 rounded-md">{r.tech}</span>
                      ) : (
                        <div className="relative">
                          <select
                            onChange={(e) => void assignTech(r.id, e.target.value)}
                            className="text-xs bg-white border border-[#D6E3F0] rounded-lg px-2 py-1 focus:outline-none focus:border-[#1A73E8] pr-6"
                            defaultValue="Ata"
                          >
                            <option>Ata</option>
                            {techs.map((t) => (
                              <option key={t}>{t}</option>
                            ))}
                          </select>
                          <ChevronDown className="w-3 h-3 text-[#8B9DAF] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select
                          onChange={(e) => void updateStatus(r.id, e.target.value as typeof statuses[number])}
                          value={r.status}
                          className="text-xs bg-white border border-[#D6E3F0] rounded-lg px-2 py-1 focus:outline-none pr-6"
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
                        </select>
                        <ChevronDown className="w-3 h-3 text-[#8B9DAF] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && list.length === 0 && (
          <div className="text-center py-8 text-sm text-[#8B9DAF]">Servis talebi bulunamadı</div>
        )}
      </div>
    </>
  );
}
