import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { Check, Lock, XCircle } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { getOrderByNumber, pollOrderPaymentStatus } from '@/services/orderService';
import { useToastStore } from '@/components/Toast';

export default function CheckoutResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.add);
  const orderNo = searchParams.get('order') ?? '';
  const isSuccess = window.location.pathname.includes('basarili');
  const [status, setStatus] = useState<'checking' | 'paid' | 'pending' | 'failed'>('checking');
  const polled = useRef(false);

  useEffect(() => {
    if (!orderNo) {
      navigate('/sepet', { replace: true });
      return;
    }

    if (!isSuccess) {
      setStatus('failed');
      return;
    }

    if (polled.current) return;
    polled.current = true;

    void (async () => {
      const order = await getOrderByNumber(orderNo);
      if (order?.paymentStatus === 'paid') {
        setStatus('paid');
        return;
      }
      if (order?.id) {
        const result = await pollOrderPaymentStatus(order.id, 8);
        setStatus(result === 'paid' ? 'paid' : result === 'failed' ? 'failed' : 'pending');
      } else {
        setStatus('pending');
      }
    })();
  }, [orderNo, isSuccess, navigate]);

  useEffect(() => {
    if (status === 'paid') {
      addToast('Ödemeniz onaylandı!', 'success');
    }
  }, [status, addToast]);

  return (
    <PageLayout>
      <div className="max-w-[600px] mx-auto px-6 py-20 text-center">
        {isSuccess ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                status === 'failed' ? 'bg-red-50' : 'bg-aqua-success/10'
              }`}
            >
              {status === 'failed' ? (
                <XCircle className="w-10 h-10 text-red-500" />
              ) : (
                <Check className="w-10 h-10 text-aqua-success" />
              )}
            </motion.div>
            <h1 className="text-2xl font-bold text-aqua-secondary mt-6">
              {status === 'checking' && 'Ödeme doğrulanıyor...'}
              {status === 'paid' && 'Ödeme Başarılı!'}
              {status === 'pending' && 'Ödeme Alındı'}
              {status === 'failed' && 'Ödeme Başarısız'}
            </h1>
            <p className="text-sm text-aqua-text-secondary mt-3">
              Sipariş No: <strong>{orderNo}</strong>
            </p>
            {status === 'pending' && (
              <p className="text-sm text-aqua-text-muted mt-2">
                Ödemeniz işleniyor. Onaylandığında e-posta ile bilgilendirileceksiniz.
              </p>
            )}
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-aqua-secondary mt-6">Ödeme Tamamlanamadı</h1>
            <p className="text-sm text-aqua-text-secondary mt-3">
              Sipariş No: <strong>{orderNo}</strong> — Tekrar deneyebilir veya farklı ödeme yöntemi seçebilirsiniz.
            </p>
          </>
        )}

        <div className="flex justify-center gap-3 mt-8">
          <Link
            to="/hesabim/siparisler"
            className="bg-aqua-primary text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-aqua-primary-dark transition-colors"
          >
            Siparişlerim
          </Link>
          <Link
            to={isSuccess ? '/' : '/odeme'}
            className="border-2 border-aqua-border text-aqua-text-secondary px-6 py-3 rounded-full font-semibold text-sm hover:border-aqua-primary hover:text-aqua-primary transition-all"
          >
            {isSuccess ? 'Ana Sayfa' : 'Ödemeye Dön'}
          </Link>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-aqua-text-muted">
          <Lock className="w-3.5 h-3.5" />
          Güvenli ödeme altyapısı PayTR
        </div>
      </div>
    </PageLayout>
  );
}
