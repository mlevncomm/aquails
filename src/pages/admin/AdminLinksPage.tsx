import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  Plus, Pencil, Trash2, Eye, GripVertical, Check,
  ShoppingBag, Droplet, Filter, Gift, RefreshCw, Wrench,
  Truck, MessageCircle, Phone, Instagram, ExternalLink, Loader2
} from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { cn } from '@/lib/utils';
import { getNavLinks, saveNavLinks, type NavLinkItem } from '@/services/settingsService';

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
  { value: 'ExternalLink', label: 'Dis Link', icon: ExternalLink },
];

type LinkItem = NavLinkItem;

export default function AdminLinksPage() {
  const addToast = useToastStore(s => s.add);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<LinkItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newForm, setNewForm] = useState<Partial<LinkItem>>({ title: '', url: '', icon: 'ExternalLink', active: true, featured: false });

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
    void persistLinks(links.map(l => l.id === id ? { ...l, active: !l.active } : l));
    addToast('Durum güncellendi', 'success');
  };

  const handleToggleFeatured = (id: string) => {
    void persistLinks(links.map(l => l.id === id ? { ...l, featured: !l.featured } : l));
    addToast('Öne çıkan durumu güncellendi', 'success');
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu bağlantıyı silmek istediğinize emin misiniz?')) {
      void persistLinks(links.filter(l => l.id !== id));
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
    void persistLinks(links.map(l => l.id === editForm.id ? editForm : l));
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
    const found = iconOptions.find(o => o.value === iconName);
    return found ? found.icon : ExternalLink;
  };

  const sortedLinks = [...links].sort((a, b) => a.order - b.order);
  const activeCount = links.filter(l => l.active).length;

  if (loading) {
    return <div className="p-6 text-sm text-aq-muted flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Yükleniyor...</div>;
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[13px] text-aq-muted mb-1">
            <Link to="/admin" className="hover:text-aq-blue">Admin</Link>
            <span>/</span>
            <span className="text-aq-muted">Link Sayfasi Yonetimi</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-aq-text">Link Sayfasi Yonetimi</h1>
          <p className="text-sm text-aq-muted mt-1">Instagram bio bağlantı sayfasındaki linkleri yönetin.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/all-links" target="_blank" className="flex items-center gap-2 text-sm font-medium text-aq-blue hover:underline">
            <Eye className="w-4 h-4" /> Sayfayı Görüntüle
          </Link>
          <button onClick={() => { setShowAdd(true); setIsEditing(false); }} className="flex items-center gap-2 bg-aq-blue text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-aq-deep transition-all">
            <Plus className="w-4 h-4" /> Link Ekle
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Toplam Link', value: links.length },
          { label: 'Aktif', value: activeCount },
          { label: 'Pasif', value: links.length - activeCount },
          { label: 'Öne Çıkan', value: links.filter(l => l.featured).length },
        ].map(s => (
          <div key={s.label} className="bg-white border border-aq-border/60 rounded-xl p-4">
            <p className="text-xs text-aq-muted">{s.label}</p>
            <p className="text-2xl font-bold text-aq-text">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-white border border-aq-border/60 rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-aq-text mb-4">Yeni Link Ekle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-aq-muted mb-1.5 block">Başlık *</label>
              <input value={newForm.title} onChange={e => setNewForm({ ...newForm, title: e.target.value })} className="w-full px-3 py-2 text-sm border border-aq-border/60 rounded-lg focus:outline-none focus:border-aq-blue" placeholder="Link basligi" />
            </div>
            <div>
              <label className="text-xs font-medium text-aq-muted mb-1.5 block">URL *</label>
              <input value={newForm.url} onChange={e => setNewForm({ ...newForm, url: e.target.value })} className="w-full px-3 py-2 text-sm border border-aq-border/60 rounded-lg focus:outline-none focus:border-aq-blue" placeholder="/sayfa veya https://..." />
            </div>
            <div>
              <label className="text-xs font-medium text-aq-muted mb-1.5 block">Ikon</label>
              <select value={newForm.icon} onChange={e => setNewForm({ ...newForm, icon: e.target.value })} className="w-full px-3 py-2 text-sm border border-aq-border/60 rounded-lg focus:outline-none focus:border-aq-blue">
                {iconOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button onClick={handleAdd} className="flex items-center gap-2 bg-aq-blue text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-aq-deep transition-all">Ekle</button>
            <button onClick={() => setShowAdd(false)} className="text-sm text-aq-muted hover:text-aq-muted">Iptal</button>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && editForm && (
        <div className="bg-white border border-aq-border/60 rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-aq-text mb-4">Link Duzenle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-aq-muted mb-1.5 block">Başlık *</label>
              <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-3 py-2 text-sm border border-aq-border/60 rounded-lg focus:outline-none focus:border-aq-blue" />
            </div>
            <div>
              <label className="text-xs font-medium text-aq-muted mb-1.5 block">URL *</label>
              <input value={editForm.url} onChange={e => setEditForm({ ...editForm, url: e.target.value })} className="w-full px-3 py-2 text-sm border border-aq-border/60 rounded-lg focus:outline-none focus:border-aq-blue" />
            </div>
            <div>
              <label className="text-xs font-medium text-aq-muted mb-1.5 block">Ikon</label>
              <select value={editForm.icon} onChange={e => setEditForm({ ...editForm, icon: e.target.value })} className="w-full px-3 py-2 text-sm border border-aq-border/60 rounded-lg focus:outline-none focus:border-aq-blue">
                {iconOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button onClick={handleSaveEdit} className="flex items-center gap-2 bg-aq-blue text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-aq-deep transition-all">Kaydet</button>
            <button onClick={() => { setIsEditing(false); setEditForm(null); }} className="text-sm text-aq-muted hover:text-aq-muted">Iptal</button>
          </div>
        </div>
      )}

      {/* Links Table */}
      <div className="bg-white border border-aq-border/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-aq-border/60">
                <th className="text-left px-4 py-3 text-xs font-semibold text-aq-muted">Sira</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-aq-muted">Başlık</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-aq-muted">URL</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-aq-muted">Aktif</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-aq-muted">Öne Çıkan</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-aq-muted">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {sortedLinks.map(link => {
                const Icon = getIcon(link.icon);
                return (
                  <tr key={link.id} className={cn('border-b border-aq-border/60 last:border-0', !link.active && 'opacity-50')}>
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
                      <button onClick={() => handleToggleActive(link.id)} className={cn('w-8 h-5 rounded-full transition-all relative', link.active ? 'bg-aq-aqua' : 'bg-aq-border')}>
                        <div className={cn('w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm', link.active ? 'left-[18px]' : 'left-0.5')} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleToggleFeatured(link.id)} className={cn('p-1.5 rounded-lg transition-all', link.featured ? 'bg-aq-ice text-aq-blue' : 'text-aq-border')}>
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(link)} className="p-1.5 rounded-lg hover:bg-aq-ice text-aq-muted hover:text-aq-blue transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(link.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-aq-muted hover:text-red-500 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview hint */}
      <div className="mt-6 bg-aq-ice border border-aq-border/60 rounded-xl p-4 flex items-start gap-3">
        <Eye className="w-5 h-5 text-aq-blue flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-aq-text">Onizleme</p>
          <p className="text-xs text-aq-muted mt-1">Yaptığınız değişiklikler anında All Links sayfasına yansır. Sayfayı görüntüle butonu ile kontrol edebilirsiniz.</p>
          <p className="text-xs text-aq-muted mt-1">Not: Bu yönetim paneli localStorage üzerinde çalışır. Tarayıcı verileri temizlenirse varsayılan ayarlara döner.</p>
        </div>
      </div>
    </div>
  );
}
