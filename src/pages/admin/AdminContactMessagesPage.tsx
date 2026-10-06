import { useCallback, useEffect, useMemo, useState } from 'react';
import { Mail, Phone, Trash2, Inbox, Reply, Archive, CheckCheck } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import {
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
  type AdminContactMessage,
  type ContactMessageStatus,
} from '@/services/contactService';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminLoading,
  AdminEmpty,
  AdminBadge,
  AdminTabs,
  type AdminTone,
} from '@/components/admin/admin-ui';
import { cn } from '@/lib/utils';

const STATUS_META: Record<ContactMessageStatus, { label: string; tone: AdminTone }> = {
  new: { label: 'Yeni', tone: 'purple' },
  read: { label: 'Okundu', tone: 'neutral' },
  replied: { label: 'Yanıtlandı', tone: 'success' },
  archived: { label: 'Arşiv', tone: 'neutral' },
};

type Filter = 'all' | ContactMessageStatus;

export default function AdminContactMessagesPage() {
  const addToast = useToastStore((s) => s.add);
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('new');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setMessages(await getContactMessages());
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: messages.length, new: 0, read: 0, replied: 0, archived: 0 };
    for (const m of messages) c[m.status] += 1;
    return c;
  }, [messages]);

  const visible = filter === 'all' ? messages : messages.filter((m) => m.status === filter);
  const selected = messages.find((m) => m.id === selectedId) ?? null;

  const setStatus = async (id: string, status: ContactMessageStatus, quiet = false) => {
    const res = await updateContactMessageStatus(id, status);
    if (!res.success) {
      addToast(res.error ?? 'Güncellenemedi.', 'error');
      return;
    }
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    if (!quiet) addToast(`Mesaj "${STATUS_META[status].label}" olarak işaretlendi.`, 'success');
  };

  const open = (m: AdminContactMessage) => {
    setSelectedId(m.id);
    if (m.status === 'new') void setStatus(m.id, 'read', true);
  };

  const remove = async (id: string) => {
    if (!window.confirm('Bu mesajı kalıcı olarak silmek istediğinize emin misiniz?')) return;
    const res = await deleteContactMessage(id);
    if (!res.success) {
      addToast(res.error ?? 'Silinemedi.', 'error');
      return;
    }
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setSelectedId(null);
    addToast('Mesaj silindi.', 'success');
  };

  const replyHref = (m: AdminContactMessage) =>
    `mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent(`Re: ${m.subject} — Aquails`)}&body=${encodeURIComponent(`Merhaba ${m.name},\n\n\n\n---\n${m.message}`)}`;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="İletişim Mesajları"
        description="İletişim formundan gelen mesajlar. Mesajı açtığınızda otomatik olarak okundu işaretlenir."
      />

      <AdminTabs
        className="mb-5"
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'new', label: 'Yeni', count: counts.new },
          { value: 'read', label: 'Okundu', count: counts.read },
          { value: 'replied', label: 'Yanıtlandı', count: counts.replied },
          { value: 'archived', label: 'Arşiv', count: counts.archived },
          { value: 'all', label: 'Tümü', count: counts.all },
        ]}
      />

      {loading ? (
        <AdminLoading />
      ) : visible.length === 0 ? (
        <AdminCard padding={false}>
          <AdminEmpty icon={Inbox} title="Mesaj yok" message="Bu filtrede gösterilecek mesaj bulunmuyor." />
        </AdminCard>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <AdminCard padding={false} className="overflow-hidden">
            <ul className="divide-y divide-aq-border/60">
              {visible.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => open(m)}
                    className={cn(
                      'w-full px-5 py-4 text-left transition-colors hover:bg-aq-cloud/50',
                      selectedId === m.id && 'bg-aq-cloud/70',
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className={cn('truncate text-sm text-aq-ink', m.status === 'new' ? 'font-bold' : 'font-medium')}>{m.name}</p>
                      <span className="flex-shrink-0 text-[11px] text-aq-muted">{new Date(m.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <AdminBadge tone={STATUS_META[m.status].tone}>{STATUS_META[m.status].label}</AdminBadge>
                      <p className="truncate text-[13px] text-aq-ink/70">{m.subject}</p>
                    </div>
                    <p className="mt-1.5 line-clamp-1 text-[13px] text-aq-muted">{m.message}</p>
                  </button>
                </li>
              ))}
            </ul>
          </AdminCard>

          <AdminCard className="lg:sticky lg:top-24 lg:self-start">
            {!selected ? (
              <AdminEmpty icon={Mail} title="Bir mesaj seçin" message="Ayrıntıları görmek için soldaki listeden bir mesaj seçin." />
            ) : (
              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-aq-muted">{selected.subject}</p>
                    <h2 className="mt-1 text-xl font-bold text-aq-ink">{selected.name}</h2>
                    <p className="mt-1 text-[13px] text-aq-muted">{new Date(selected.createdAt).toLocaleString('tr-TR')}</p>
                  </div>
                  <AdminBadge tone={STATUS_META[selected.status].tone}>{STATUS_META[selected.status].label}</AdminBadge>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-[13px]">
                  <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-1.5 rounded-full bg-aq-cloud px-3 py-1.5 text-aq-ink hover:bg-aq-cloud">
                    <Mail className="h-3.5 w-3.5" /> {selected.email}
                  </a>
                  {selected.phone && (
                    <a href={`tel:${selected.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 rounded-full bg-aq-cloud px-3 py-1.5 text-aq-ink hover:bg-aq-cloud">
                      <Phone className="h-3.5 w-3.5" /> {selected.phone}
                    </a>
                  )}
                </div>

                <p className="mt-5 whitespace-pre-line rounded-xl bg-aq-cloud/60 p-4 text-sm leading-relaxed text-aq-ink/85">{selected.message}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <a
                    href={replyHref(selected)}
                    onClick={() => { if (selected.status !== 'replied') void setStatus(selected.id, 'replied', true); }}
                    className="inline-flex items-center gap-2 rounded-full bg-aq-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-aq-ink-soft"
                  >
                    <Reply className="h-4 w-4" /> E-posta ile Yanıtla
                  </a>
                  {selected.status !== 'replied' && (
                    <AdminButton variant="secondary" onClick={() => void setStatus(selected.id, 'replied')}>
                      <CheckCheck className="h-4 w-4" /> Yanıtlandı
                    </AdminButton>
                  )}
                  {selected.status !== 'archived' && (
                    <AdminButton variant="secondary" onClick={() => void setStatus(selected.id, 'archived')}>
                      <Archive className="h-4 w-4" /> Arşivle
                    </AdminButton>
                  )}
                  <AdminButton variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => void remove(selected.id)}>
                    <Trash2 className="h-4 w-4" /> Sil
                  </AdminButton>
                </div>
              </div>
            )}
          </AdminCard>
        </div>
      )}
    </AdminPageShell>
  );
}
