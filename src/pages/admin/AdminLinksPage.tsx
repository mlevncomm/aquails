import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  Plus, Pencil, Trash2, Eye, GripVertical, Check,
  ShoppingBag, Droplet, Filter, Gift, RefreshCw, Wrench,
  Truck, MessageCircle, Phone, Instagram, ExternalLink, Link2,
} from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { cn } from '@/lib/utils';
import { getNavLinks, saveNavLinks, type NavLinkItem } from '@/services/settingsService';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminBreadcrumb,
  AdminCard,
  AdminInput,
  AdminSelect,
  AdminLabel,
  AdminButton,
  AdminTableWrap,
  AdminLoading,
  AdminEmpty,
  AdminStatCard,
} from '@/components/admin/admin-ui';

const iconOptions = [
  { value: 'ShoppingBag', label: 'Alışveriş', icon: ShoppingBag },
  { value: 'Droplet', label: 'Su', icon: Droplet },
  { value: 'Filter', label: 'Filtre', icon: Filter },
  { value: 'Gift', label: 'Hediye', icon: Gift },
  { value: 'RefreshCw', label: 'Yenile', icon: RefreshCw },
  { value: 'Wrench', label: 'Alet', icon: Wrench },
  { value: 'Truck', label: 'Kargo', icon: Truck },
  { value: 'MessageCircle', label: 'Mesaj', icon: MessageCircle },
  { value: 'Instagram', label: 'Instagram', icon: Instagram },
  { value: 'Phone', label: 'Telefon', icon: Phone },
  { value: 'ExternalLink', label: 'Dış Link', icon: ExternalLink },
];

type LinkItem = NavLinkItem;

export default function AdminLinksPage() {
  const addToast = useToastStore((s) => s.add);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<LinkItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newForm, setNewForm] = useState<Partial<LinkItem>>({
    title: '',
    url: '',
    icon: 'ExternalLink',
    active: true,
    featured: false,
  });

  useEffect(() => {
    void getNavLinks().then((data) => {
      setLinks(data);
      setLoading(false);
    });
  }, []);

  const persistLinks = async (next: LinkItem[]) => {
    setLinks(next);
    const res = await saveNavLinks(next);
    if (!res.success) addToast(res.error ?? 'Kaydedilemedi.', 'error');
  };

  const handleToggleActive = (id: string) => {
    void persistLinks(links.map((l) => (l.id === id ? { ...l, active: !l.active } : l)));
    addToast('Durum güncellendi', 'success');
  };

  const handleToggleFeatured = (id: string) => {
    void persistLinks(links.map((l) => (l.id === id ? { ...l, featured: !l.featured } : l)));
    addToast('Öne çıkan durumu güncellendi', 'success');
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu bağlantıyı silmek istediğinize emin misiniz?')) {
      void persistLinks(links.filter((l) => l.id !== id));
      addToast('Bağlantı silindi', 'success');
    }
  };

  const handleEdit = (link: LinkItem) => {
    setEditForm({ ...link });
    setIsEditing(true);
    setShowAdd(false);
  };

  const handleSaveEdit = () => {
    if (!editForm?.title || !editForm?.url) {
      addToast('Başlık ve URL zorunludur.', 'error');
      return;
    }
    void persistLinks(links.map((l) => (l.id === editForm.id ? editForm : l)));
    setIsEditing(false);
    setEditForm(null);
    addToast('Bağlantı güncellendi', 'success');
  };

  const handleAdd = () => {
    if (!newForm.title || !newForm.url) {
      addToast('Başlık ve URL zorunludur.', 'error');
      return;
    }
    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: newForm.title || '',
      url: newForm.url || '',
      icon: newForm.icon || 'ExternalLink',
      active: true,
      featured: false,
      order: links.length + 1,
    };
    void persistLinks([...links, newLink]);
    setShowAdd(false);
    setNewForm({ title: '', url: '', icon: 'ExternalLink', active: true, featured: false });
    addToast('Yeni bağlantı eklendi', 'success');
  };

  const getIcon = (iconName: string) => {
    const found = iconOptions.find((o) => o.value === iconName);
    return found ? found.icon : ExternalLink;
  };

  const sortedLinks = [...links].sort((a, b) => a.order - b.order);
  const activeCount = links.filter((l) => l.active).length;

  return (
    <AdminPageShell>
      <AdminBreadcrumb items={[{ label: 'Admin', to: '/admin' }, { label: 'Link Sayfası Yönetimi' }]} />
      <AdminPageHeader
        title="Link Sayfası Yönetimi"
        description="Instagram bio bağlantı sayfasındaki linkleri yönetin."
        action={
          <div className="flex items-center gap-3">
            <Link
              to="/all-links"
              target="_blank"
              className="flex items-center gap-2 text-sm font-medium text-aq-blue hover:underline"
            >
              <Eye className="w-4 h-4" /> Sayfayı Görüntüle
            </Link>
            <AdminButton
              onClick={() => {
                setShowAdd(true);
                setIsEditing(false);
              }}
            >
              <Plus className="w-4 h-4" /> Link Ekle
            </AdminButton>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <AdminStatCard label="Toplam Link" value={links.length} />
        <AdminStatCard label="Aktif" value={activeCount} />
        <AdminStatCard label="Pasif" value={links.length - activeCount} />
        <AdminStatCard label="Öne Çıkan" value={links.filter((l) => l.featured).length} />
      </div>

      {showAdd && (
        <AdminCard className="mb-6">
          <p className="text-sm font-semibold text-aq-text mb-4">Yeni Link Ekle</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <AdminLabel>Başlık *</AdminLabel>
              <AdminInput
                value={newForm.title}
                onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                placeholder="Link başlığı"
              />
            </div>
            <div>
              <AdminLabel>URL *</AdminLabel>
              <AdminInput
                value={newForm.url}
                onChange={(e) => setNewForm({ ...newForm, url: e.target.value })}
                placeholder="/sayfa veya https://..."
              />
            </div>
            <div>
              <AdminLabel>İkon</AdminLabel>
              <AdminSelect
                value={newForm.icon}
                onChange={(e) => setNewForm({ ...newForm, icon: e.target.value })}
              >
                {iconOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </AdminSelect>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <AdminButton onClick={handleAdd}>Ekle</AdminButton>
            <AdminButton variant="ghost" onClick={() => setShowAdd(false)}>
              İptal
            </AdminButton>
          </div>
        </AdminCard>
      )}

      {isEditing && editForm && (
        <AdminCard className="mb-6">
          <p className="text-sm font-semibold text-aq-text mb-4">Link Düzenle</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <AdminLabel>Başlık *</AdminLabel>
              <AdminInput
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div>
              <AdminLabel>URL *</AdminLabel>
              <AdminInput
                value={editForm.url}
                onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
              />
            </div>
            <div>
              <AdminLabel>İkon</AdminLabel>
              <AdminSelect
                value={editForm.icon}
                onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
              >
                {iconOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </AdminSelect>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <AdminButton onClick={handleSaveEdit}>Kaydet</AdminButton>
            <AdminButton
              variant="ghost"
              onClick={() => {
                setIsEditing(false);
                setEditForm(null);
              }}
            >
              İptal
            </AdminButton>
          </div>
        </AdminCard>
      )}

      {loading ? (
        <AdminLoading label="Linkler yükleniyor..." />
      ) : sortedLinks.length === 0 ? (
        <AdminCard padding={false}>
          <AdminEmpty icon={Link2} message="Henüz link yok." />
        </AdminCard>
      ) : (
        <AdminTableWrap stickyFirst>
          <table className="w-full">
            <thead>
              <tr className="bg-aq-ice border-b border-aq-border/60">
                {['Sıra', 'Başlık', 'URL', 'Aktif', 'Öne Çıkan', 'İşlemler'].map((h) => (
                  <th
                    key={h}
                    className={cn(
                      'px-4 py-3 text-[11px] font-semibold text-aq-muted uppercase whitespace-nowrap',
                      h === 'Aktif' || h === 'Öne Çıkan' ? 'text-center' : h === 'İşlemler' ? 'text-right' : 'text-left',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedLinks.map((link) => {
                const Icon = getIcon(link.icon);
                return (
                  <tr
                    key={link.id}
                    className={cn(
                      'border-b border-aq-border/60 last:border-0 hover:bg-aq-ice/50',
                      !link.active && 'opacity-50',
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3.5 h-3.5 text-aq-border" />
                        <span className="text-xs text-aq-muted">{link.order}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-aq-ice rounded-lg flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5 text-aq-blue" />
                        </div>
                        <span className="text-sm font-medium text-aq-text">{link.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-aq-muted truncate max-w-[200px] block">{link.url}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(link.id)}
                        className={cn(
                          'w-8 h-5 rounded-full transition-all relative',
                          link.active ? 'bg-aq-aqua' : 'bg-aq-border',
                        )}
                      >
                        <div
                          className={cn(
                            'w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm',
                            link.active ? 'left-[18px]' : 'left-0.5',
                          )}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(link.id)}
                        className={cn(
                          'p-1.5 rounded-lg transition-all',
                          link.featured ? 'bg-aq-ice text-aq-blue' : 'text-aq-border',
                        )}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(link)}
                          className="p-1.5 rounded-lg hover:bg-aq-ice text-aq-muted hover:text-aq-blue transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(link.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-aq-muted hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </AdminTableWrap>
      )}

      <AdminCard className="mt-6">
        <div className="flex items-start gap-3">
          <Eye className="w-5 h-5 text-aq-blue flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-aq-text">Önizleme</p>
            <p className="text-xs text-aq-muted mt-1">
              Yaptığınız değişiklikler anında All Links sayfasına yansır. Sayfayı görüntüle butonu ile
              kontrol edebilirsiniz.
            </p>
            <p className="text-xs text-aq-muted mt-1">
              Not: Bu yönetim paneli localStorage üzerinde çalışır. Tarayıcı verileri temizlenirse
              varsayılan ayarlara döner.
            </p>
          </div>
        </div>
      </AdminCard>
    </AdminPageShell>
  );
}
