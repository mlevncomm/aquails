import { useState } from 'react';
import { HelpCircle, Check, Trash2, MessageCircle } from 'lucide-react';
import { useToastStore } from '@/components/Toast';

const initial = [
  { id: '1', customer: 'Ahmet Y.', product: 'PurePro 7 Aşamalı', question: 'Filtre değişimi ne kadar sürer?', answer: 'Ortalama 15-20 dakika sürmektedir.', status: 'answered', date: '2026-06-10' },
  { id: '2', customer: 'Zeynep K.', product: 'Compact', question: 'Kurulum için musluk değişimi gerekli mi?', answer: '', status: 'pending', date: '2026-06-09' },
];

export default function AdminQuestionsPage() {
  const [items, setItems] = useState(initial);
  const [answerForm, setAnswerForm] = useState({ id: '', text: '' });
  const addToast = useToastStore(s => s.add);

  const submitAnswer = (id: string) => {
    if (!answerForm.text) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, answer: answerForm.text, status: 'answered' as const } : i));
    addToast('Cevap gönderildi.', 'success');
    setAnswerForm({ id: '', text: '' });
  };
  const remove = (id: string) => { setItems(prev => prev.filter(i => i.id !== id)); addToast('Soru silindi.', 'success'); };

  return (
      <>      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Soru & Cevap Yönetimi</h2>
      <div className="space-y-4">
        {items.map(q => (
          <div key={q.id} className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#F0F6FF] rounded-lg flex items-center justify-center"><HelpCircle className="w-4 h-4 text-[#1A73E8]" /></div>
                <div>
                  <p className="text-sm font-semibold text-[#0D2137]">{q.customer}</p>
                  <p className="text-xs text-[#8B9DAF]">{q.product} | {q.date}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${q.status === 'answered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{q.status === 'answered' ? 'Cevaplandı' : 'Bekliyor'}</span>
            </div>
            <p className="text-sm text-[#5A6B7B] mb-3 pl-10">{q.question}</p>
            {q.answer && (
              <div className="bg-[#F8FBFF] rounded-xl p-3 ml-10 mb-3">
                <div className="flex items-center gap-1.5 mb-1"><MessageCircle className="w-3.5 h-3.5 text-[#1A73E8]" /><span className="text-xs font-medium text-[#1A73E8]">Cevap</span></div>
                <p className="text-sm text-[#5A6B7B]">{q.answer}</p>
              </div>
            )}
            {q.status === 'pending' && (
              <div className="ml-10 flex gap-2">
                <input value={answerForm.id === q.id ? answerForm.text : ''} onChange={e => setAnswerForm({ id: q.id, text: e.target.value })} placeholder="Cevap yazın..." className="flex-1 px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]" />
                <button onClick={() => submitAnswer(q.id)} className="bg-[#1A73E8] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#1557B0]"><Check className="w-4 h-4" /></button>
              </div>
            )}
            <div className="flex justify-end mt-3">
              <button onClick={() => remove(q.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#8B9DAF] hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
      </>
  );
}
