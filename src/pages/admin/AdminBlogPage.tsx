import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, BookOpen, ExternalLink, Pencil, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { useToastStore } from '@/components/Toast';
import {
  getBlogPosts,
  getBlogPostForEdit,
  toggleBlogStatus,
  deleteBlogPost,
  createBlogPost,
  updateBlogPost,
  type BlogPostListItem,
} from '@/services/blogService';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminLabel,
  AdminButton,
  AdminTableWrap,
  AdminLoading,
  AdminEmpty,
  AdminBadge,
  AdminDrawer,
} from '@/components/admin/admin-ui';

const CATEGORIES = ['Genel', 'Su Arıtma', 'Filtre Bakımı', 'Sağlıklı Yaşam', 'Rehber', 'Kampanya'];

interface FormState {
  title: string;
  slug: string;
  category: string;
  content: string;
  status: 'draft' | 'published';
}

const EMPTY: FormState = { title: '', slug: '', category: 'Genel', content: '', status: 'draft' };

export default function AdminBlogPage() {
  const addToast = useToastStore((s) => s.add);
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawer, setDrawer] = useState<{ mode: 'create' } | { mode: 'edit'; id: string } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loadingPost, setLoadingPost] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setPosts(await getBlogPosts());
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const openCreate = () => {
    setForm(EMPTY);
    setDrawer({ mode: 'create' });
  };

  const openEdit = async (id: string) => {
    setDrawer({ mode: 'edit', id });
    setLoadingPost(true);
    const post = await getBlogPostForEdit(id);
    setLoadingPost(false);
    if (!post) {
      addToast('Yazı yüklenemedi.', 'error');
      setDrawer(null);
      return;
    }
    setForm({ title: post.title, slug: post.slug, category: post.category, content: post.content, status: post.status });
  };

  const save = async () => {
    if (!drawer) return;
    if (!form.title.trim()) return addToast('Başlık zorunludur.', 'error');
    if (form.status === 'published' && form.content.trim().length < 50) {
      return addToast('Yayınlamak için en az birkaç cümlelik içerik girin.', 'error');
    }
    setSaving(true);
    if (drawer.mode === 'create') {
      const res = await createBlogPost({ title: form.title.trim(), category: form.category, content: form.content, status: form.status });
      setSaving(false);
      if (!res.success) return addToast(res.error ?? 'Oluşturulamadı.', 'error');
      addToast(form.status === 'published' ? 'Yazı yayınlandı.' : 'Yazı taslak olarak kaydedildi.', 'success');
    } else {
      const res = await updateBlogPost(drawer.id, form);
      if (res.success) {
        const current = posts.find((p) => p.id === drawer.id);
        if (current && current.status !== form.status) await toggleBlogStatus(drawer.id, form.status);
      }
      setSaving(false);
      if (!res.success) return addToast(res.error ?? 'Güncellenemedi.', 'error');
      addToast('Yazı güncellendi.', 'success');
    }
    setDrawer(null);
    void load();
  };

  const remove = async (p: BlogPostListItem) => {
    if (!window.confirm(`"${p.title}" yazısını silmek istediğinize emin misiniz?`)) return;
    const result = await deleteBlogPost(p.id);
    if (!result.success) return addToast(result.error ?? 'Silinemedi.', 'error');
    addToast('Yazı silindi.', 'success');
    setPosts((prev) => prev.filter((x) => x.id !== p.id));
  };

  const toggleStatus = async (p: BlogPostListItem) => {
    const next = p.status === 'published' ? 'draft' : 'published';
    const result = await toggleBlogStatus(p.id, next);
    if (!result.success) return addToast(result.error ?? 'Durum güncellenemedi.', 'error');
    setPosts((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: next } : x)));
    addToast(next === 'published' ? 'Yazı yayınlandı.' : 'Yazı taslağa alındı.', 'info');
  };

  const words = form.content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Blog"
        description="Bilgi merkezi yazılarını oluşturun, düzenleyin ve yayınlayın. Yalnızca yayındaki yazılar sitede görünür."
        action={<AdminButton onClick={openCreate}><Plus className="h-4 w-4" /> Yeni Yazı</AdminButton>}
      />

      {loading ? (
        <AdminLoading label="Yazılar yükleniyor..." />
      ) : posts.length === 0 ? (
        <AdminCard padding={false}>
          <AdminEmpty
            icon={BookOpen}
            title="Henüz blog yazısı yok"
            message="İlk yazınızı oluşturun; taslak olarak kaydedip hazır olduğunda yayınlayabilirsiniz."
            action={<AdminButton onClick={openCreate}><Plus className="h-4 w-4" /> Yazı Oluştur</AdminButton>}
          />
        </AdminCard>
      ) : (
        <AdminTableWrap stickyFirst>
          <table className="w-full min-w-[720px]">
            <thead>
              <tr>
                {['Başlık', 'Kategori', 'Durum', 'Tarih', 'Görüntülenme', ''].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => void openEdit(p.id)} className="max-w-[320px] text-left text-sm font-semibold text-aq-ink hover:underline">
                      <span className="line-clamp-1">{p.title}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-aq-muted">{p.category}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => void toggleStatus(p)} title="Durumu değiştir">
                      <AdminBadge tone={p.status === 'published' ? 'success' : 'warning'}>{p.status === 'published' ? 'Yayında' : 'Taslak'}</AdminBadge>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-aq-muted">{p.date}</td>
                  <td className="px-4 py-3 text-sm text-aq-ink">{p.views.toLocaleString('tr-TR')}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {p.status === 'published' && (
                        <Link to={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="rounded-full p-2 text-aq-muted hover:bg-aq-cloud hover:text-aq-ink" title="Sitede görüntüle">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      )}
                      <button type="button" onClick={() => void openEdit(p.id)} className="rounded-full p-2 text-aq-muted hover:bg-aq-cloud hover:text-aq-ink" aria-label="Düzenle">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => void remove(p)} className="rounded-full p-2 text-aq-muted hover:bg-red-50 hover:text-red-600" aria-label="Sil">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminTableWrap>
      )}

      <AdminDrawer
        open={!!drawer}
        title={drawer?.mode === 'edit' ? 'Yazıyı Düzenle' : 'Yeni Yazı'}
        onClose={() => setDrawer(null)}
        footer={
          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-aq-ink">
              <input
                type="checkbox"
                className="h-4 w-4 accent-aq-ink"
                checked={form.status === 'published'}
                onChange={(e) => setForm({ ...form, status: e.target.checked ? 'published' : 'draft' })}
              />
              Yayında
            </label>
            <div className="flex gap-2">
              <AdminButton variant="ghost" onClick={() => setDrawer(null)}>Vazgeç</AdminButton>
              <AdminButton onClick={() => void save()} disabled={saving || loadingPost}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Kaydet
              </AdminButton>
            </div>
          </div>
        }
      >
        {loadingPost ? (
          <div className="flex justify-center py-16 text-aq-muted"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : (
          <div className="space-y-4">
            <div>
              <AdminLabel>Başlık *</AdminLabel>
              <AdminInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Örn. Su arıtma filtresi ne sıklıkla değişmeli?" />
            </div>
            {drawer?.mode === 'edit' && (
              <div>
                <AdminLabel>Bağlantı (slug)</AdminLabel>
                <AdminInput value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                <p className="mt-1 text-xs text-aq-muted">Yayındaki bir yazının bağlantısını değiştirmek eski linkleri bozar.</p>
              </div>
            )}
            <div>
              <AdminLabel>Kategori</AdminLabel>
              <AdminInput list="blog-categories" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <datalist id="blog-categories">
                {CATEGORIES.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div>
              <AdminLabel>İçerik</AdminLabel>
              <AdminTextarea rows={16} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Paragrafları boş bir satırla ayırın." className="font-[inherit] leading-relaxed" />
              <p className="mt-1 text-xs text-aq-muted">{words} kelime · yaklaşık {Math.max(1, Math.ceil(words / 200))} dk okuma</p>
            </div>
          </div>
        )}
      </AdminDrawer>
    </AdminPageShell>
  );
}
