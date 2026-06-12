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

export function askQuestion(productId: string, productName: string, customerName: string, question: string): void {
  const questions = getQuestions();
  questions.unshift({
    id: Date.now().toString(),
    productId,
    productName,
    customerName,
    question,
    status: 'pending',
    createdAt: new Date().toISOString(),
    isPublic: false,
  });
  localStorage.setItem('product-questions', JSON.stringify(questions));
}

export function answerQuestion(id: string, answer: string): void {
  const questions = getQuestions();
  const q = questions.find(q => q.id === id);
  if (q) { q.answer = answer; q.status = 'answered'; q.answeredAt = new Date().toISOString(); q.isPublic = true; }
  localStorage.setItem('product-questions', JSON.stringify(questions));
}

export function getQuestions(): ProductQuestion[] {
  return JSON.parse(localStorage.getItem('product-questions') || '[]');
}

export function getPublicQuestionsForProduct(productId: string): ProductQuestion[] {
  return getQuestions().filter(q => q.productId === productId && q.isPublic && q.status === 'answered');
}

export function deleteQuestion(id: string): void {
  const questions = getQuestions().filter(q => q.id !== id);
  localStorage.setItem('product-questions', JSON.stringify(questions));
}
