import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Eye, BookOpen, Loader2 } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { getBlogPosts, toggleBlogStatus, deleteBlogPost, createBlogPost, type BlogPostListItem } from '@/services/blogService';
import { AdminPageHeader, AdminCard, AdminInput, AdminLabel, AdminButton, AdminTableWrap } from '@/components/admin/admin-ui';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Genel', content: '' });
  const addToast = useToastStore((s) => s.add);

  const load = useCallback(async () => {
    setLoading(true);
    setPosts(await getBlogPosts());
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createBlogPost(form);
    if (result.success) {
      addToast('Yazı oluşturuldu (taslak).', 'success');
      setShowForm(false);
      setForm({ title: '', category: 'Genel', content: '' });
      void load();
    } else {
      addToast(result.error ?? 'Oluşturulamadı.', 'error');
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Blog Yönetimi"
        action={
          <AdminButton onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Yeni Yazı
          </AdminButton>
        }
      />

      {showForm && (
        <AdminCard className="mb-6">
          <form onSubmit={(e) => void handleCreate(e)} className="space-y-4 max-w-xl">
            <div>
              <AdminLabel>Başlık</AdminLabel>
              <AdminInput required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <AdminLabel>Kategori</AdminLabel>
              <AdminInput value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <AdminButton type="submit">Oluştur</AdminButton>
              <AdminButton type="button" variant="ghost" onClick={() => setShowForm(false)}>İptal</AdminButton>
            </div>
          </form>
        </AdminCard>
      )}

      <AdminTableWrap>
        {loading ? (
          <div className="py-12 text-center text-aq-muted"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-aq-ice">
                  {['Başlık', 'Kategori', 'Durum', 'Tarih', 'Görüntülenme', 'İşlem'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-aq-muted uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id} className="border-b border-aq-border/60 last:border-0 hover:bg-aq-ice/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-aq-ice rounded-lg flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-aq-blue" />
                        </div>
                        <span className="text-sm font-medium text-aq-text line-clamp-1 max-w-[200px]">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-aq-muted">{p.category}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => void toggleStatus(p.id, p.status)}
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}
                      >
                        {p.status === 'published' ? 'Yayında' : 'Taslak'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-aq-muted">{p.date}</td>
                    <td className="px-4 py-3 text-sm text-aq-text">{p.views.toLocaleString('tr-TR')}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-aq-ice text-aq-muted hover:text-aq-blue">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-aq-ice text-aq-muted hover:text-aq-blue">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => void remove(p.id)}
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
        {!loading && posts.length === 0 && (
          <div className="text-center py-8 text-sm text-aq-muted">Henüz blog yazısı yok</div>
        )}
      </AdminTableWrap>
    </>
  );
}
