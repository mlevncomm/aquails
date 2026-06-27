import { isSupabaseMode } from '@/lib/dataProvider';
import { requireSupabase } from '@/lib/supabase';

const STORAGE_KEY = 'aquails_product_questions';

export interface ProductQuestion {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  question: string;
  answer?: string;
  isPublished: boolean;
  createdAt: string;
}

function getLocalQuestions(): ProductQuestion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalQuestions(questions: ProductQuestion[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

export async function askQuestion(productId: string, productName: string, customerName: string, question: string): Promise<void> {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('product_questions').insert({
      product_id: productId,
      user_id: user?.id ?? null,
      question,
      is_published: false,
    });
    return;
  }
  const questions = getLocalQuestions();
  questions.unshift({
    id: crypto.randomUUID(),
    productId,
    productName,
    customerName,
    question,
    isPublished: false,
    createdAt: new Date().toISOString(),
  });
  saveLocalQuestions(questions);
}

export async function answerQuestion(id: string, answer: string): Promise<void> {
  if (isSupabaseMode) {
    await requireSupabase().from('product_questions').update({
      answer,
      is_published: true,
      answered_at: new Date().toISOString(),
    }).eq('id', id);
    return;
  }
  const questions = getLocalQuestions();
  const q = questions.find((item) => item.id === id);
  if (q) {
    q.answer = answer;
    q.isPublished = true;
    saveLocalQuestions(questions);
  }
}

export async function getQuestions(): Promise<ProductQuestion[]> {
  if (isSupabaseMode) {
    const { data, error } = await requireSupabase()
      .from('product_questions')
      .select('*, products(name)')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => ({
      id: String(row.id),
      productId: String(row.product_id),
      productName: String((row.products as { name?: string } | null)?.name ?? ''),
      customerName: '',
      question: String(row.question),
      answer: row.answer ? String(row.answer) : undefined,
      isPublished: Boolean(row.is_published),
      createdAt: String(row.created_at),
    }));
  }
  return getLocalQuestions();
}

export async function getPublicQuestionsForProduct(productId: string): Promise<ProductQuestion[]> {
  if (isSupabaseMode) {
    const { data } = await requireSupabase()
      .from('product_questions')
      .select('*')
      .eq('product_id', productId)
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    return (data ?? []).map((row) => ({
      id: String(row.id),
      productId: String(row.product_id),
      productName: '',
      customerName: '',
      question: String(row.question),
      answer: row.answer ? String(row.answer) : undefined,
      isPublished: Boolean(row.is_published),
      createdAt: String(row.created_at),
    }));
  }
  return getLocalQuestions().filter((q) => q.productId === productId && q.isPublished);
}

export async function deleteQuestion(id: string): Promise<void> {
  if (isSupabaseMode) {
    await requireSupabase().from('product_questions').delete().eq('id', id);
    return;
  }
  saveLocalQuestions(getLocalQuestions().filter((q) => q.id !== id));
}
