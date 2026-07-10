import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { getServiceRequests } from '@/services/serviceRequestService';
import type { AdminServiceRequest } from '@/services/serviceRequestService';
import { AdminPageHeader, AdminTableWrap, AdminEmpty } from '@/components/admin/admin-ui';

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
    <>
      <AdminPageHeader
        title="Filtre Değişim Takipleri"
        description="Filtre değişim servis talepleri"
      />

      <AdminTableWrap>
        {loading ? (
          <div className="py-12 text-center text-slate-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Müşteri', 'Cihaz', 'Adres', 'Tarih', 'Durum', 'Teknisyen'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan={6}><AdminEmpty message="Filtre değişim talebi bulunamadı" /></td></tr>
              ) : requests.map((f) => (
                <tr key={f.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{f.customer}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{f.device}</td>
                  <td className="px-4 py-3 text-sm text-slate-500 max-w-[200px] truncate">{f.address}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{f.date}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">{f.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{f.tech || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminTableWrap>
    </>
  );
}
