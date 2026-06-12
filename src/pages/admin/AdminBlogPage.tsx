import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, BookOpen } from 'lucide-react';
import { useToastStore } from '@/components/Toast';

const initial = [
  { id: '1', title: 'Su Arıtma Cihazı Nasıl Çalışır?', category: 'Teknik Bilgiler', status: 'published', date: '2026-06-05', views: 1240 },
  { id: '2', title: 'Filtre Değişim Sıklığı', category: 'Bakım Önerileri', status: 'published', date: '2026-06-01', views: 890 },
  { id: '3', title: 'Arıtılmış Su İçmenin Faydaları', category: 'Sağlıklı Yaşam', status: 'draft', date: '2026-05-28', views: 0 },
];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState(initial);
  const addToast = useToastStore(s => s.add);
  const remove = (id: string) => { setPosts(prev => prev.filter(p => p.id !== id)); addToast('Yazı silindi.', 'success'); };
  const toggleStatus = (id: string) => { setPosts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'published' ? 'draft' : 'published' } : p)); addToast('Durum güncellendi.', 'info'); };

  return (
      <>      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-[#0D2137]">Blog Yönetimi</h2>
        <button className="flex items-center gap-2 bg-[#1A73E8] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1557B0]"><Plus className="w-4 h-4" /> Yeni Yazı</button>
      </div>
      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#F8FBFF]">{['Başlık', 'Kategori', 'Durum', 'Tarih', 'Görüntülenme', 'İşlem'].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-[#F0F6FF] rounded-lg flex items-center justify-center"><BookOpen className="w-4 h-4 text-[#1A73E8]" /></div><span className="text-sm font-medium text-[#0D2137] line-clamp-1 max-w-[200px]">{p.title}</span></div></td>
                  <td className="px-4 py-3 text-sm text-[#5A6B7B]">{p.category}</td>
                  <td className="px-4 py-3"><button onClick={() => toggleStatus(p.id)} className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{p.status === 'published' ? 'Yayında' : 'Taslak'}</button></td>
                  <td className="px-4 py-3 text-sm text-[#8B9DAF]">{p.date}</td>
                  <td className="px-4 py-3 text-sm text-[#0D2137]">{p.views.toLocaleString('tr-TR')}</td>
                  <td className="px-4 py-3"><div className="flex gap-1"><button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F6FF] text-[#8B9DAF] hover:text-[#1A73E8]"><Eye className="w-3.5 h-3.5" /></button><button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F6FF] text-[#8B9DAF] hover:text-[#1A73E8]"><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => remove(p.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#8B9DAF] hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
  );
}
