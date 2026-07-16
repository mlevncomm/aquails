import { useState, useEffect, useCallback } from 'react';
import { Star, Eye, Trash2 } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { getReviews, toggleReviewPublished, deleteReview, type AdminReview } from '@/services/reviewService';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToastStore((s) => s.add);

  const load = useCallback(async () => {
    setLoading(true);
    setReviews(await getReviews());
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleApprove = async (id: string, approved: boolean) => {
    const result = await toggleReviewPublished(id, !approved);
    if (result.success) {
      addToast('Durum güncellendi.', 'info');
      void load();
    }
  };

  const remove = async (id: string) => {
    const result = await deleteReview(id);
    if (result.success) {
      addToast('Yorum silindi.', 'success');
      void load();
    }
  };

  return (
    <>
      <h2 className="text-lg font-semibold text-aq-text mb-5">Yorum Yönetimi</h2>
      <div className="bg-white border border-aq-border/60 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-sm text-aq-muted">Yorumlar yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-aq-ice">
                  {['Müşteri', 'Ürün', 'Puan', 'Başlık', 'Tarih', 'Durum', 'İşlem'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-aq-muted uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id} className="border-b border-aq-border/60 last:border-0 hover:bg-aq-ice/50">
                    <td className="px-4 py-3 text-sm font-medium text-aq-text">{r.customer}</td>
                    <td className="px-4 py-3 text-sm text-aq-muted line-clamp-1 max-w-[120px]">{r.product}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-semibold text-aq-text">{r.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-aq-text line-clamp-1 max-w-[150px]">{r.title}</td>
                    <td className="px-4 py-3 text-sm text-aq-muted">{r.date}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => void toggleApprove(r.id, r.approved)}
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.approved ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}
                      >
                        {r.approved ? 'Onaylı' : 'Bekliyor'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-aq-ice text-aq-muted hover:text-aq-blue">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => void remove(r.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-aq-muted hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && reviews.length === 0 && (
          <div className="text-center py-8 text-sm text-aq-muted">Henüz yorum yok</div>
        )}
      </div>
    </>
  );
}
