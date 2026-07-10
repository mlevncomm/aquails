import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, Lock, CreditCard, Building2, Truck, Shield, Lock as LockIcon,
  CheckCircle, MapPin, User, Wrench, Tag, Calendar, Clock
} from 'lucide-react';
import { getSlotsForDate } from '@/services/serviceCalendarService';
import type { ServiceSlot } from '@/services/serviceCalendarService';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useCartStore } from '@/stores/cartStore';
import { validateCoupon, incrementCouponUsage } from '@/services/couponService';
import { createOrder } from '@/services/orderService';
import { completeAbandonedCart, syncAbandonedCart } from '@/services/abandonedCartService';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/components/Toast';
import { cn } from '@/lib/utils';



const steps = [
  { label: 'Sepet', href: '/sepet' },
  { label: 'Ödeme', href: '/odeme' },
  { label: 'Onay', href: '#' },
];

const paymentMethods = [
  { id: 'card', label: 'Kredi / Banka Kartı', desc: 'Tüm banka kartlarına 3-6-9 taksit imkanı', icon: CreditCard },
  { id: 'transfer', label: 'Havale / EFT', desc: '%5 ek indirim avantajı', icon: Building2 },
  { id: 'cod', label: 'Kapıda Ödeme', desc: 'Nakit veya kredi kartı ile kapıda ödeme (+150₺)', icon: Truck },
];

const shippingMethods = [
  { id: 'standard', label: 'Standart Kargo', desc: '3-5 iş günü içinde teslimat', price: 0, priceLabel: 'Ücretsiz' },
  { id: 'fast', label: 'Hızlı Kargo', desc: '1-2 iş günü içinde teslimat', price: 49, priceLabel: '49₺' },
  { id: 'same', label: 'Aynı Gün Teslimat', desc: 'Bugün teslimat (İstanbul)', price: 99, priceLabel: '99₺' },
];

const paymentMethodLabels: Record<string, string> = {
  card: 'Kredi Kartı',
  transfer: 'Havale/EFT',
  cod: 'Kapıda Ödeme',
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.add);
  const [currentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState<ServiceSlot[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedOrderNo, setCompletedOrderNo] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: string } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = getSubtotal();
  const codFee = paymentMethod === 'cod' ? 150 : 0;
  const shippingCost = shippingMethods.find((s) => s.id === shippingMethod)?.price || 0;
  const couponDiscount = appliedCoupon?.discount || 0;
  const isFreeShipping = appliedCoupon?.type === 'shipping';
  const effectiveShipping = isFreeShipping ? 0 : shippingCost;
  const discount = couponDiscount > 0 ? couponDiscount : 0;
  const total = subtotal + effectiveShipping + codFee - discount;

  useEffect(() => {
    if (isCompleted) return;
    if (items.length === 0) {
      addToast('Sepetiniz boş. Ödeme sayfasına erişmek için önce ürün ekleyin.', 'error');
      navigate('/sepet', { replace: true });
      return;
    }
    syncAbandonedCart(
      items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images?.[0],
      })),
      user?.name ?? 'Misafir',
      user?.email
    );
  }, [items, isCompleted, navigate, addToast, user?.name, user?.email]);

  const handleCompleteOrder = async () => {
    if (!items.length) {
      addToast('Sepetiniz boş.', 'error');
      navigate('/sepet', { replace: true });
      return;
    }

    if (!user) {
      addToast('Sipariş vermek için giriş yapmalısınız.', 'error');
      navigate('/giris?redirect=/odeme');
      return;
    }

    const shippingAddr = {
      title: 'Teslimat',
      city: 'İstanbul',
      district: '',
      full_address: 'İstanbul',
    };

    const result = await createOrder({
      userId: user.id,
      items: items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        qty: item.quantity,
        price: item.product.price,
      })),
      subtotal,
      shippingCost,
      discount,
      total,
      paymentMethod: paymentMethodLabels[paymentMethod] ?? paymentMethod,
      shippingAddress: shippingAddr,
      installationSlot: selectedDate || undefined,
    });

    if (!result.success || !result.order) {
      addToast(result.error ?? 'Sipariş oluşturulamadı.', 'error');
      return;
    }

    if (appliedCoupon?.code) {
      await incrementCouponUsage(appliedCoupon.code);
    }

    await completeAbandonedCart();
    clearCart();
    setCompletedOrderNo(result.order.orderNo);
    setIsCompleted(true);
    addToast('Siparişiniz başarıyla oluşturuldu.', 'success');
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { addToast('Kupon kodu girin.', 'error'); return; }
    setCouponLoading(true);
    const result = await validateCoupon(couponCode, subtotal);
    setCouponLoading(false);
    if (result.valid && result.coupon) {
      if (result.coupon.type === 'shipping') {
        setAppliedCoupon({ code: result.coupon.code, discount: 0, type: 'shipping' });
        addToast('Kargo ücretsiz kuponu uygulandı!', 'success');
      } else {
        setAppliedCoupon({ code: result.coupon.code, discount: result.discount, type: result.coupon.type });
        addToast(`${result.coupon.code} kuponu uygulandı! ${result.discount.toLocaleString('tr-TR')}₺ indirim`, 'success');
      }
    } else {
      addToast(result.message || 'Geçersiz kupon.', 'error');
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    addToast('Kupon kaldırıldı.', 'info');
  };

  if (isCompleted) {
    return (
      <PageLayout>
        <div className="max-w-[600px] mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="w-20 h-20 bg-aqua-success/10 rounded-full flex items-center justify-center mx-auto"
          >
            <Check className="w-10 h-10 text-aqua-success" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-bold text-aqua-secondary mt-6"
          >
            Siparişiniz Alındı!
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-4"
          >
            <span className="inline-block bg-aqua-primary/10 text-aqua-primary font-semibold px-4 py-2 rounded-lg">
              Sipariş No: {completedOrderNo}
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[15px] text-aqua-text-secondary leading-relaxed mt-4"
          >
            Siparişiniz başarıyla oluşturuldu. Kargo takip bilgileri e-posta adresinize gönderilecektir.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex justify-center gap-3 mt-8"
          >
            <Link
              to="/hesabim/siparisler"
              className="bg-aqua-primary text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-aqua-primary-dark transition-colors"
            >
              Siparişlerim
            </Link>
            <Link
              to="/"
              className="border-2 border-aqua-border text-aqua-text-secondary px-6 py-3 rounded-full font-semibold text-sm hover:border-aqua-primary hover:text-aqua-primary transition-all"
            >
              Ana Sayfaya Dön
            </Link>
          </motion.div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Progress Bar */}
      <div className="bg-white border-b border-aqua-border-light py-6">
        <div className="max-w-[1080px] mx-auto px-6">
          <div className="flex items-center justify-center gap-0">
            {steps.map((step, index) => (
              <div key={step.label} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all',
                      index < currentStep
                        ? 'bg-aqua-primary border-aqua-primary text-white'
                        : index === currentStep
                        ? 'border-aqua-primary text-aqua-primary bg-white'
                        : 'border-aqua-border text-aqua-text-muted bg-white'
                    )}
                  >
                    {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium hidden sm:block',
                      index <= currentStep ? 'text-aqua-secondary' : 'text-aqua-text-muted'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-12 md:w-16 h-0.5 mx-3',
                      index < currentStep ? 'bg-aqua-primary' : 'bg-aqua-border-light'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1080px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
          {/* Left - Forms */}
          <div className="space-y-5">
            {/* Contact */}
            <ScrollReveal>
              <div className="bg-white border border-aqua-border-light rounded-2xl p-6">
                <h3 className="text-base font-bold text-aqua-secondary flex items-center gap-2">
                  <User className="w-5 h-5 text-aqua-primary" />
                  İletişim Bilgileri
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-aqua-secondary mb-1 block">Ad Soyad</label>
                    <input type="text" placeholder="Adınız ve Soyadınız" className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary focus:ring-2 focus:ring-aqua-primary/10" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-aqua-secondary mb-1 block">E-posta</label>
                    <input type="email" placeholder="ornek@email.com" className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary focus:ring-2 focus:ring-aqua-primary/10" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-aqua-secondary mb-1 block">Telefon</label>
                    <input type="tel" placeholder="05XX XXX XX XX" className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary focus:ring-2 focus:ring-aqua-primary/10" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-aqua-secondary mb-1 block">Sipariş Notu</label>
                    <textarea placeholder="Teslimat ile ilgili notunuz (opsiyel)" rows={1} className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary focus:ring-2 focus:ring-aqua-primary/10 resize-none" />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Address */}
            <ScrollReveal delay={0.1}>
              <div className="bg-white border border-aqua-border-light rounded-2xl p-6">
                <h3 className="text-base font-bold text-aqua-secondary flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-aqua-primary" />
                  Teslimat Adresi
                </h3>
                <label className="flex items-center gap-2.5 mt-4 cursor-pointer">
                  <div className="w-4 h-4 rounded bg-aqua-primary border border-aqua-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-aqua-text-secondary">Fatura adresim teslimat adresi ile aynı</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-aqua-secondary mb-1 block">Adres Başlığı</label>
                    <input type="text" placeholder="Örn: Ev, İş" className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-aqua-secondary mb-1 block">Şehir</label>
                    <select className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary bg-white">
                      <option>İstanbul</option>
                      <option>Ankara</option>
                      <option>İzmir</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-aqua-secondary mb-1 block">Açık Adres</label>
                    <textarea placeholder="Sokak, mahalle, bina no, daire no" rows={2} className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary resize-none" />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Installation */}
            <ScrollReveal delay={0.15}>
              <div className="bg-white border border-aqua-border-light rounded-2xl p-6">
                <h3 className="text-base font-bold text-aqua-secondary flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-aqua-primary" />
                  Kurulum ve Servis
                </h3>
                <label className="flex items-center gap-2.5 mt-4 cursor-pointer">
                  <div className="w-4 h-4 rounded bg-aqua-primary border border-aqua-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-aqua-text-secondary">Ücretsiz profesyonel kurulum istiyorum</span>
                </label>

                {/* Installation Slot Selection */}
                <div className="mt-5 pt-5 border-t border-aqua-border-light">
                  <h4 className="text-sm font-semibold text-aqua-secondary flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-aqua-primary" />
                    Kurulum Tarihi ve Saati Seçin
                  </h4>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedSlot('');
                      if (e.target.value) {
                        setAvailableSlots(getSlotsForDate(e.target.value));
                      }
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl bg-aqua-bg focus:outline-none focus:border-aqua-primary mb-3"
                  />
                  {selectedDate && (
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.filter(s => s.available).length === 0 ? (
                        <p className="text-xs text-aqua-text-muted col-span-2">Bu tarihte müsait slot bulunmuyor. Başka tarih seçin.</p>
                      ) : (
                        availableSlots.filter(s => s.available).map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot.id)}
                            className={cn(
                              'flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all',
                              selectedSlot === slot.id
                                ? 'border-aqua-primary bg-aqua-bg/50'
                                : 'border-aqua-border-light hover:border-aqua-border'
                            )}
                          >
                            <Clock className="w-4 h-4 text-aqua-primary flex-shrink-0" />
                            <span className="text-sm text-aqua-text-secondary">{slot.label}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Payment Method */}
            <ScrollReveal delay={0.2}>
              <div className="bg-white border border-aqua-border-light rounded-2xl p-6">
                <h3 className="text-base font-bold text-aqua-secondary flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-aqua-primary" />
                  Ödeme Yöntemi
                </h3>
                <div className="mt-4 space-y-2.5">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={cn(
                        'flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all',
                        paymentMethod === method.id
                          ? 'border-aqua-primary bg-aqua-bg/50'
                          : 'border-aqua-border-light hover:border-aqua-border'
                      )}
                    >
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                          paymentMethod === method.id ? 'border-aqua-primary' : 'border-aqua-border'
                        )}
                      >
                        {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-aqua-primary rounded-full" />}
                      </div>
                      <method.icon className="w-6 h-6 text-aqua-text-secondary flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-aqua-secondary">{method.label}</p>
                        <p className="text-xs text-aqua-text-muted">{method.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Form */}
                <AnimatePresence>
                  {paymentMethod === 'card' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-5 mt-5 border-t border-aqua-bg space-y-4">
                        <div>
                          <label className="text-sm font-medium text-aqua-secondary mb-1 block">Kart Üzerindeki İsim</label>
                          <input type="text" placeholder="Ad Soyad" className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-aqua-secondary mb-1 block">Kart Numarası</label>
                          <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-aqua-secondary mb-1 block">Son Kullanma</label>
                            <input type="text" placeholder="AA/YY" className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-aqua-secondary mb-1 block">CVV</label>
                            <input type="text" placeholder="123" className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>

            {/* Shipping */}
            <ScrollReveal delay={0.25}>
              <div className="bg-white border border-aqua-border-light rounded-2xl p-6">
                <h3 className="text-base font-bold text-aqua-secondary flex items-center gap-2">
                  <Truck className="w-5 h-5 text-aqua-primary" />
                  Kargo ve Servis Seçimi
                </h3>
                <div className="mt-4 space-y-2.5">
                  {shippingMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setShippingMethod(method.id)}
                      className={cn(
                        'flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all',
                        shippingMethod === method.id
                          ? 'border-aqua-primary bg-aqua-bg/50'
                          : 'border-aqua-border-light hover:border-aqua-border'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                            shippingMethod === method.id ? 'border-aqua-primary' : 'border-aqua-border'
                          )}
                        >
                          {shippingMethod === method.id && <div className="w-2.5 h-2.5 bg-aqua-primary rounded-full" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-aqua-secondary">{method.label}</p>
                          <p className="text-xs text-aqua-text-muted">{method.desc}</p>
                        </div>
                      </div>
                      <span className={cn('text-sm font-semibold', method.price === 0 ? 'text-aqua-success' : 'text-aqua-secondary')}>
                        {method.priceLabel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right - Summary */}
          <ScrollReveal x={20} delay={0.3}>
            <div className="lg:sticky lg:top-28 bg-white border border-aqua-border-light rounded-2xl p-6">
              <h3 className="text-base font-bold text-aqua-secondary mb-5">Sipariş Özeti</h3>

              {/* Products */}
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 py-2 border-b border-aqua-bg">
                    <div className="w-12 h-12 bg-aqua-bg rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img src={item.product.images?.[0] || '/images/products/placeholder.jpg'} alt={item.product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-aqua-secondary truncate">{item.product.name}</p>
                      <p className="text-xs text-aqua-text-muted">{item.quantity} x {item.product.price.toLocaleString('tr-TR')}₺</p>
                    </div>
                    <span className="text-sm font-semibold text-aqua-secondary">
                      {(item.product.price * item.quantity).toLocaleString('tr-TR')}₺
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="pt-3 border-t border-aqua-border-light">
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-aqua-text-muted" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Kupon kodu"
                        className="w-full pl-8 pr-3 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary bg-[#F8FBFF]"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      className="px-4 py-2.5 text-sm font-semibold text-aqua-primary border-2 border-aqua-primary rounded-xl hover:bg-aqua-primary hover:text-white transition-all disabled:opacity-50"
                    >
                      {couponLoading ? '...' : 'Uygula'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-semibold text-emerald-700">{appliedCoupon.code}</span>
                      <span className="text-xs text-emerald-600">
                        {appliedCoupon.type === 'shipping' ? 'Ücretsiz Kargo' : `-${appliedCoupon.discount.toLocaleString('tr-TR')}₺`}
                      </span>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-xs text-emerald-600 hover:text-red-500 font-medium">Kaldır</button>
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <div className="space-y-2.5 pt-3 border-t border-aqua-border-light">
                <div className="flex justify-between text-sm">
                  <span className="text-aqua-text-secondary">Ara Toplam</span>
                  <span className="font-medium text-aqua-secondary">{subtotal.toLocaleString('tr-TR')}₺</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-aqua-text-secondary">Kargo</span>
                  <span className={effectiveShipping === 0 ? 'text-aqua-success font-medium' : 'font-medium text-aqua-secondary'}>
                    {effectiveShipping === 0 ? (isFreeShipping ? 'Kupon: Ücretsiz' : 'Ücretsiz') : `${effectiveShipping}₺`}
                  </span>
                </div>
                {codFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-aqua-text-secondary">Kapıda Ödeme</span>
                    <span className="font-medium text-aqua-secondary">+{codFee}₺</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-aqua-text-secondary">İndirim (Kupon)</span>
                    <span className="font-medium text-aqua-success">-{discount.toLocaleString('tr-TR')}₺</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-aqua-border-light">
                  <span className="text-aqua-secondary">Genel Toplam</span>
                  <span className="text-xl font-bold text-aqua-secondary">{total.toLocaleString('tr-TR')}₺</span>
                </div>
              </div>

              <p className="text-xs text-aqua-text-muted mt-3">*Fiyatlara KDV dahildir.</p>

              {/* Security Badges */}
              <div className="flex items-center justify-center gap-5 mt-5 py-4 border-t border-aqua-bg">
                {[
                  { icon: Shield, label: '256-bit SSL' },
                  { icon: LockIcon, label: 'Güvenli Ödeme' },
                  { icon: CheckCircle, label: 'Garanti' },
                ].map((badge) => (
                  <div key={badge.label} className="flex items-center gap-1.5 text-[11px] text-aqua-text-muted">
                    <badge.icon className="w-3.5 h-3.5" />
                    {badge.label}
                  </div>
                ))}
              </div>

              <button
                onClick={handleCompleteOrder}
                className="flex items-center justify-center gap-2 w-full bg-aqua-primary text-white py-4 rounded-full font-semibold hover:bg-aqua-primary-dark hover:shadow-primary transition-all mt-4"
              >
                <Lock className="w-4 h-4" />
                Siparişi Tamamla
              </button>
              <p className="text-[11px] text-aqua-text-muted text-center mt-3">
                Siparişi tamamlayarak kullanım koşullarını kabul etmiş olursunuz.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </PageLayout>
  );
}
