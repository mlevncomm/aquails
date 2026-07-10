import { useState, useEffect } from 'react';
import { Filter, Bell, BellOff, ShoppingCart, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { useAuthStore } from '@/stores/authStore';
import { getFilterDevices, toggleFilterReminder, type FilterDevice } from '@/services/filterTrackingService';

function computeNextChange(f: FilterDevice): string {
  const days = f.daysRemaining;
  const next = new Date();
  next.setDate(next.getDate() + days);
  return next.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function CustomerFilterTrackingPage() {
  const user = useAuthStore((s) => s.user);
  const [filters, setFilters] = useState<FilterDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    void getFilterDevices(user.id).then((data) => {
      setFilters(data);
      setLoading(false);
    });
  }, [user]);

  const handleToggleReminder = async (id: string, enabled: boolean) => {
    await toggleFilterReminder(id, !enabled);
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, reminderEnabled: !enabled } : f)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-[#8B9DAF]">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Yükleniyor...
      </div>
    );
  }

  return (
    <>
      <h2 className="text-lg font-bold text-[#0D2137] mb-5">Filtre Değişim Hatırlatıcıları</h2>

      <div className="bg-gradient-to-r from-[#E8F4FD] to-[#D4E9FA] rounded-2xl p-5 mb-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1A73E8]/10 rounded-xl flex items-center justify-center"><Filter className="w-5 h-5 text-[#1A73E8]" /></div>
          <div><p className="text-sm font-semibold text-[#0D2137]">Filtrenizin değişim zamanı yaklaşıyor mu?</p><p className="text-xs text-[#5A6B7B]">Hemen yeni filtre seti sipariş edin.</p></div>
        </div>
        <Link to="/urunler" className="flex items-center gap-1.5 bg-[#1A73E8] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#1557B0] transition-all whitespace-nowrap">
          <ShoppingCart className="w-3.5 h-3.5" /> Filtre Satın Al
        </Link>
      </div>

      {filters.length === 0 ? (
        <div className="bg-white border border-[#E8F0FE] rounded-2xl p-8 text-center text-sm text-[#8B9DAF]">
          Henüz filtre takibiniz yok. Cihazınıza filtre eklediğinizde burada görünecek.
        </div>
      ) : (
        <div className="space-y-3">
          {filters.map((f) => (
            <div key={f.id} className={`bg-white border rounded-2xl p-5 ${f.daysRemaining <= 14 ? 'border-amber-200 bg-amber-50/30' : 'border-[#E8F0FE]'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-[#0D2137]">{f.filterName}</p>
                    {f.daysRemaining <= 14 && <span className="bg-amber-100 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">Yakında</span>}
                  </div>
                  <p className="text-xs text-[#8B9DAF]">{f.deviceName}</p>
                  <div className="flex gap-4 mt-2 text-xs text-[#5A6B7B]">
                    <span>Son Değişim: <span className="font-medium text-[#0D2137]">{f.lastChangedAt ?? f.installedAt}</span></span>
                    <span>Sonraki: <span className="font-medium text-[#0D2137]">{computeNextChange(f)}</span></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${f.daysRemaining <= 14 ? 'text-amber-600' : 'text-[#1A73E8]'}`}>{Math.max(0, f.daysRemaining)}</p>
                    <p className="text-[10px] text-[#8B9DAF]">gün kaldı</p>
                  </div>
                  <button
                    onClick={() => void handleToggleReminder(f.id, f.reminderEnabled)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${f.reminderEnabled ? 'bg-[#EBF3FF] text-[#1A73E8]' : 'bg-gray-100 text-gray-400'}`}
                  >
                    {f.reminderEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="mt-3 h-1.5 bg-[#E8F0FE] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${f.daysRemaining <= 14 ? 'bg-amber-400' : f.daysRemaining <= 60 ? 'bg-[#F5A623]' : 'bg-emerald-400'}`}
                  style={{ width: `${Math.min(100, Math.max(5, (f.daysRemaining / f.changeIntervalDays) * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
