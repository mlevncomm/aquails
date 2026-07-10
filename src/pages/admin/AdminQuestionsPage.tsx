import { useState, useEffect, useCallback } from 'react';
import { HelpCircle, Check, Trash2, MessageCircle } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import {
  getQuestions,
  answerQuestion,
  deleteQuestion,
  type ProductQuestion,
} from '@/services/productQuestionService';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR');
}

export default function AdminQuestionsPage() {
  const [items, setItems] = useState<ProductQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerForm, setAnswerForm] = useState({ id: '', text: '' });
  const addToast = useToastStore((s) => s.add);

  const refresh = useCallback(async () => {
    setLoading(true);
    setItems(await getQuestions());
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const submitAnswer = async (id: string) => {
    if (!answerForm.text.trim()) return;
    const result = await answerQuestion(id, answerForm.text.trim());
    if (result.success) {
      addToast('Cevap gönderildi ve yayınlandı.', 'success');
      setAnswerForm({ id: '', text: '' });
      void refresh();
    } else {
      addToast(result.error ?? 'Cevap gönderilemedi.', 'error');
    }
  };

  const remove = async (id: string) => {
    const result = await deleteQuestion(id);
    if (result.success) {
      addToast('Soru silindi.', 'success');
      void refresh();
    }
  };

  return (
    <>
      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Soru & Cevap Yönetimi</h2>

      {loading ? (
        <div className="text-center py-12 text-sm text-[#8B9DAF]">Yükleniyor...</div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-[#E8F0FE] rounded-2xl p-8 text-center text-sm text-[#8B9DAF]">
          Henüz müşteri sorusu bulunmuyor.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((q) => (
            <div key={q.id} className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#F0F6FF] rounded-lg flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-[#1A73E8]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0D2137]">{q.customerName}</p>
                    <p className="text-xs text-[#8B9DAF]">
                      {q.productName} | {formatDate(q.createdAt)}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${q.status === 'answered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}
                >
                  {q.status === 'answered' ? (q.isPublic ? 'Yayında' : 'Cevaplandı') : 'Bekliyor'}
                </span>
              </div>
              <p className="text-sm text-[#5A6B7B] mb-3 pl-10">{q.question}</p>
              {q.answer && (
                <div className="bg-[#F8FBFF] rounded-xl p-3 ml-10 mb-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MessageCircle className="w-3.5 h-3.5 text-[#1A73E8]" />
                    <span className="text-xs font-medium text-[#1A73E8]">Cevap</span>
                  </div>
                  <p className="text-sm text-[#5A6B7B]">{q.answer}</p>
                </div>
              )}
              {q.status === 'pending' && (
                <div className="ml-10 flex gap-2">
                  <input
                    value={answerForm.id === q.id ? answerForm.text : ''}
                    onChange={(e) => setAnswerForm({ id: q.id, text: e.target.value })}
                    placeholder="Cevabınızı yazın..."
                    className="flex-1 px-3 py-2 text-sm border border-[#D6E3F0] rounded-lg bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]"
                  />
                  <button
                    onClick={() => void submitAnswer(q.id)}
                    className="flex items-center gap-1 bg-[#1A73E8] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1557B0]"
                  >
                    <Check className="w-4 h-4" /> Gönder
                  </button>
                </div>
              )}
              <div className="ml-10 mt-3">
                <button
                  onClick={() => void remove(q.id)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
