import { getSupabaseOrNull } from '@/lib/supabase';
import { getCurrentUser } from '@/services/authService';

export interface ProductQuestion {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  question: string;
  answer?: string;
  status: 'pending' | 'answered';
  createdAt: string;
  answeredAt?: string;
  isPublic: boolean;
}

type QuestionWithProduct = {
  id: string;
  product_id: string;
  customer_name: string;
  question: string;
  answer: string | null;
  is_published: boolean;
  answered_at: string | null;
  created_at: string;
  products: { name: string } | null;
};

function mapQuestion(row: QuestionWithProduct): ProductQuestion {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.products?.name ?? 'Ürün',
    customerName: row.customer_name,
    question: row.question,
    answer: row.answer ?? undefined,
    status: row.answer ? 'answered' : 'pending',
    createdAt: row.created_at,
    answeredAt: row.answered_at ?? undefined,
    isPublic: row.is_published,
  };
}

export async function askQuestion(
  productId: string,
  _productName: string,
  customerName: string,
  question: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const user = await getCurrentUser();

  const { error } = await supabase.from('product_questions').insert({
    product_id: productId,
    user_id: user?.id ?? null,
    customer_name: customerName,
    question,
    is_published: false,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function answerQuestion(
  id: string,
  answer: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { error } = await supabase
    .from('product_questions')
    .update({
      answer,
      is_published: true,
      answered_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getQuestions(): Promise<ProductQuestion[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('product_questions')
    .select('*, products(name)')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return (data as unknown as QuestionWithProduct[]).map(mapQuestion);
}

export async function getPublicQuestionsForProduct(productId: string): Promise<ProductQuestion[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('product_questions')
    .select('*, products(name)')
    .eq('product_id', productId)
    .eq('is_published', true)
    .not('answer', 'is', null)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return (data as unknown as QuestionWithProduct[]).map(mapQuestion);
}

export async function deleteQuestion(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { error } = await supabase.from('product_questions').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getPendingQuestionCount(): Promise<number> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return 0;

  const { count } = await supabase
    .from('product_questions')
    .select('*', { count: 'exact', head: true })
    .is('answer', null);

  return count ?? 0;
}
