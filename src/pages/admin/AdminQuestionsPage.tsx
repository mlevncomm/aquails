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
      <h2 className="text-lg font-semibold text-aq-text mb-5">Soru & Cevap Yönetimi</h2>

      {loading ? (
        <div className="text-center py-12 text-sm text-aq-muted">Yükleniyor...</div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-aq-border/60 rounded-2xl p-8 text-center text-sm text-aq-muted">
          Henüz müşteri sorusu bulunmuyor.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((q) => (
            <div key={q.id} className="bg-white border border-aq-border/60 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-aq-ice rounded-lg flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-aq-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-aq-text">{q.customerName}</p>
                    <p className="text-xs text-aq-muted">
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
              <p className="text-sm text-aq-muted mb-3 pl-10">{q.question}</p>
              {q.answer && (
                <div className="bg-aq-ice rounded-xl p-3 ml-10 mb-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MessageCircle className="w-3.5 h-3.5 text-aq-blue" />
                    <span className="text-xs font-medium text-aq-blue">Cevap</span>
                  </div>
                  <p className="text-sm text-aq-muted">{q.answer}</p>
                </div>
              )}
              {q.status === 'pending' && (
                <div className="ml-10 flex gap-2">
                  <input
                    value={answerForm.id === q.id ? answerForm.text : ''}
                    onChange={(e) => setAnswerForm({ id: q.id, text: e.target.value })}
                    placeholder="Cevabınızı yazın..."
                    className="flex-1 px-3 py-2 text-sm border border-aq-border/60 rounded-lg bg-aq-ice focus:outline-none focus:border-aq-blue"
                  />
                  <button
                    onClick={() => void submitAnswer(q.id)}
                    className="flex items-center gap-1 bg-aq-blue text-white px-4 py-2 rounded-xl text-sm hover:bg-aq-deep"
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
