import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Eye, BookOpen } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { getBlogPosts, toggleBlogStatus, deleteBlogPost, type BlogPostListItem } from '@/services/blogService';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToastStore((s) => s.add);

  const load = useCallback(async () => {
    setLoading(true);
    setPosts(await getBlogPosts());
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = async (id: string) => {
    const result = await deleteBlogPost(id);
    if (result.success) {
      addToast('Yazı silindi.', 'success');
      void load();
    }
  };

  const toggleStatus = async (id: string, current: 'draft' | 'published') => {
    const result = await toggleBlogStatus(id, current === 'published' ? 'draft' : 'published');
    if (result.success) {
      addToast('Durum güncellendi.', 'info');
      void load();
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-[#0D2137]">Blog Yönetimi</h2>
        <button className="flex items-center gap-2 bg-[#1A73E8] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1557B0]">
          <Plus className="w-4 h-4" /> Yeni Yazı
        </button>
      </div>
      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-sm text-[#8B9DAF]">Yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FBFF]">
                  {['Başlık', 'Kategori', 'Durum', 'Tarih', 'Görüntülenme', 'İşlem'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#F0F6FF] rounded-lg flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-[#1A73E8]" />
                        </div>
                        <span className="text-sm font-medium text-[#0D2137] line-clamp-1 max-w-[200px]">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5A6B7B]">{p.category}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => void toggleStatus(p.id, p.status)}
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}
                      >
                        {p.status === 'published' ? 'Yayında' : 'Taslak'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#8B9DAF]">{p.date}</td>
                    <td className="px-4 py-3 text-sm text-[#0D2137]">{p.views.toLocaleString('tr-TR')}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F6FF] text-[#8B9DAF] hover:text-[#1A73E8]">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F6FF] text-[#8B9DAF] hover:text-[#1A73E8]">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => void remove(p.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#8B9DAF] hover:text-red-500"
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
        {!loading && posts.length === 0 && (
          <div className="text-center py-8 text-sm text-[#8B9DAF]">Henüz blog yazısı yok</div>
        )}
      </div>
    </>
  );
}
