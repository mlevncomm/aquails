import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, Lock, CreditCard, Building2, Truck,
  CheckCircle, MapPin, User, Wrench, Tag, Clock, X, Loader2
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
import { getAddresses, type Address } from '@/services/addressService';
import { getPaytrSettings, getBankAccounts, isPaytrConfigured } from '@/services/settingsService';
import { initPaytrPayment, buildPaytrBasket, formatPaymentAmountKurus } from '@/services/paymentService';
import { cn } from '@/lib/utils';

const steps = [
  { label: 'Sepet', href: '/sepet' },
  { label: 'Ödeme', href: '/odeme' },
  { label: 'Onay', href: '#' },
];

const paymentMethods = [
  { id: 'card', label: 'Kredi / Banka Kartı', desc: 'PayTR güvenli ödeme — taksit imkanı', icon: CreditCard },
  { id: 'transfer', label: 'Havale / EFT', desc: 'Banka hesabına havale ile ödeme', icon: Building2 },
  { id: 'cod', label: 'Kapıda Ödeme', desc: 'Nakit veya kredi kartı ile kapıda ödeme (+150₺)', icon: Truck },
];

const shippingMethods = [
  { id: 'standard', label: 'Standart Kargo', desc: '3-5 iş günü içinde teslimat', price: 0, priceLabel: 'Ücretsiz' },
  { id: 'fast', label: 'Hızlı Kargo', desc: '1-2 iş günü içinde teslimat', price: 49, priceLabel: '49₺' },
  { id: 'same', label: 'Aynı Gün Teslimat', desc: 'Bugün teslimat (İstanbul)', price: 99, priceLabel: '99₺' },
];

const paymentMethodLabels: Record<string, string> = {
  card: 'Kredi Kartı (PayTR)',
  transfer: 'Havale/EFT',
  cod: 'Kapıda Ödeme',
};

const TURKISH_CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Kocaeli', 'Gaziantep'];

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  note: string;
}

interface AddressForm {
  title: string;
  city: string;
  district: string;
  fullAddress: string;
  sameBilling: boolean;
}

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
  const [submitting, setSubmitting] = useState(false);
  const [paytrIframeUrl, setPaytrIframeUrl] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paytrEnabled, setPaytrEnabled] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<{ bankName: string; accountName: string; iban: string }[]>([]);
  const [showBankInfo, setShowBankInfo] = useState(false);

  const [contact, setContact] = useState<ContactForm>({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: '',
    note: '',
  });

  const [address, setAddress] = useState<AddressForm>({
    title: 'Ev',
    city: 'İstanbul',
    district: '',
    fullAddress: '',
    sameBilling: true,
  });

  const subtotal = getSubtotal();
  const codFee = paymentMethod === 'cod' ? 150 : 0;
  const shippingCost = shippingMethods.find((s) => s.id === shippingMethod)?.price || 0;
  const couponDiscount = appliedCoupon?.discount || 0;
  const isFreeShipping = appliedCoupon?.type === 'shipping';
  const effectiveShipping = isFreeShipping ? 0 : shippingCost;
  const discount = couponDiscount > 0 ? couponDiscount : 0;
  const total = subtotal + effectiveShipping + codFee - discount;

  useEffect(() => {
    void getPaytrSettings().then((s) => setPaytrEnabled(isPaytrConfigured(s)));
    void getBankAccounts().then(setBankAccounts);
  }, []);

  useEffect(() => {
    if (user) {
      setContact((c) => ({
        ...c,
        name: user.name || c.name,
        email: user.email || c.email,
      }));
      void getAddresses(user.id).then((addrs) => {
        setSavedAddresses(addrs);
        const defaultAddr = addrs.find((a) => a.isDefault && a.type === 'shipping') ?? addrs[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          setAddress({
            title: defaultAddr.title,
            city: defaultAddr.city,
            district: defaultAddr.district,
            fullAddress: defaultAddr.fullAddress,
            sameBilling: true,
          });
        }
      });
    }
  }, [user]);

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

  const selectSavedAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setAddress({
      title: addr.title,
      city: addr.city,
      district: addr.district,
      fullAddress: addr.fullAddress,
      sameBilling: true,
    });
  };

  const validateForms = (): boolean => {
    if (!contact.name.trim()) { addToast('Ad soyad girin.', 'error'); return false; }
    if (!contact.email.trim()) { addToast('E-posta girin.', 'error'); return false; }
    if (!contact.phone.trim()) { addToast('Telefon girin.', 'error'); return false; }
    if (!address.fullAddress.trim()) { addToast('Teslimat adresi girin.', 'error'); return false; }
    if (!address.district.trim()) { addToast('İlçe girin.', 'error'); return false; }
    if (paymentMethod === 'card' && !paytrEnabled) {
      addToast('Online kart ödemesi henüz yapılandırılmamış. Havale veya kapıda ödeme seçin.', 'error');
      return false;
    }
    return true;
  };

  const buildShippingAddress = () => ({
    title: address.title,
    city: address.city,
    district: address.district,
    full_address: address.fullAddress,
    phone: contact.phone,
    name: contact.name,
  });

  const finishOrder = useCallback(async (orderNo: string, clear = true) => {
    if (appliedCoupon?.code) await incrementCouponUsage(appliedCoupon.code);
    await completeAbandonedCart();
    if (clear) clearCart();
    setCompletedOrderNo(orderNo);
    setIsCompleted(true);
    setPaytrIframeUrl(null);
  }, [appliedCoupon, clearCart]);

  const handleCompleteOrder = async () => {
    if (submitting) return;
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
    if (!validateForms()) return;

    setSubmitting(true);
    const shippingAddr = buildShippingAddress();
    const isCard = paymentMethod === 'card';

    const result = await createOrder({
      userId: user.id,
      items: items.map((item) => ({
        productId: item.product.id,
        slug: item.product.slug,
        name: item.product.name,
        qty: item.quantity,
        price: item.product.price,
      })),
      subtotal,
      shippingCost: effectiveShipping,
      codFee,
      discount,
      total,
      paymentMethod: paymentMethodLabels[paymentMethod] ?? paymentMethod,
      paymentStatus: isCard ? 'pending' : 'pending',
      shippingAddress: shippingAddr,
      billingAddress: address.sameBilling ? shippingAddr : shippingAddr,
      notes: contact.note || undefined,
      installationSlot: selectedSlot || selectedDate || undefined,
      deferStockUntilPaid: isCard,
    });

    if (!result.success || !result.orderId || !result.order) {
      addToast(result.error ?? 'Sipariş oluşturulamadı.', 'error');
      setSubmitting(false);
      return;
    }

    if (isCard) {
      const origin = window.location.origin;
      const paytrResult = await initPaytrPayment({
        orderId: result.orderId,
        orderNumber: result.order.orderNo,
        email: contact.email,
        userName: contact.name,
        userPhone: contact.phone,
        userAddress: `${address.fullAddress}, ${address.district}/${address.city}`,
        paymentAmount: formatPaymentAmountKurus(total),
        userBasket: buildPaytrBasket(items.map((i) => ({
          name: i.product.name,
          price: i.product.price,
          qty: i.quantity,
        }))),
        merchantOkUrl: `${origin}/odeme/basarili?order=${result.order.orderNo}`,
        merchantFailUrl: `${origin}/odeme/basarisiz?order=${result.order.orderNo}`,
      });

      if (!paytrResult.success || !paytrResult.iframeUrl) {
        addToast(paytrResult.error ?? 'Ödeme başlatılamadı.', 'error');
        setSubmitting(false);
        return;
      }

      setPaytrIframeUrl(paytrResult.iframeUrl);
      setSubmitting(false);
      return;
    }

    if (paymentMethod === 'transfer') {
      setShowBankInfo(true);
      setCompletedOrderNo(result.order.orderNo);
      setSubmitting(false);
      return;
    }

    await finishOrder(result.order.orderNo);
    addToast('Siparişiniz başarıyla oluşturuldu.', 'success');
    setSubmitting(false);
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

  if (showBankInfo) {
    return (
      <PageLayout>
        <div className="max-w-[600px] mx-auto px-6 py-16">
          <h1 className="text-2xl font-bold text-aqua-secondary mb-2">Havale Bilgileri</h1>
          <p className="text-sm text-aqua-text-secondary mb-6">
            Sipariş No: <strong>{completedOrderNo}</strong> — Toplam: <strong>{total.toLocaleString('tr-TR')}₺</strong>
          </p>
          <p className="text-sm text-aqua-text-muted mb-4">
            Aşağıdaki hesaplara havale yaptıktan sonra siparişiniz onaylanacaktır. Açıklama kısmına sipariş numaranızı yazın.
          </p>
          <div className="space-y-3 mb-6">
            {bankAccounts.map((b, i) => (
              <div key={i} className="bg-white border border-aqua-border-light rounded-xl p-4 text-sm">
                <p className="font-semibold text-aqua-secondary">{b.bankName}</p>
                <p className="text-aqua-text-secondary">{b.accountName}</p>
                <p className="font-mono text-aqua-primary mt-1">{b.iban}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => void finishOrder(completedOrderNo).then(() => addToast('Sipariş kaydedildi.', 'success'))}
            className="w-full bg-aqua-primary text-white py-3 rounded-full font-semibold hover:bg-aqua-primary-dark"
          >
            Anladım, Siparişi Tamamla
          </button>
        </div>
      </PageLayout>
    );
  }

  if (isCompleted) {
    return (
      <PageLayout>
        <div className="max-w-[600px] mx-auto px-6 py-20 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-aqua-success/10 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-aqua-success" />
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold text-aqua-secondary mt-6">Siparişiniz Alındı!</h1>
          <span className="inline-block bg-aqua-primary/10 text-aqua-primary font-semibold px-4 py-2 rounded-lg mt-4">
            Sipariş No: {completedOrderNo}
          </span>
          <p className="text-[15px] text-aqua-text-secondary leading-relaxed mt-4">
            Siparişiniz başarıyla oluşturuldu. Kargo takip bilgileri e-posta adresinize gönderilecektir.
          </p>
          <div className="flex justify-center gap-3 mt-8">
            <Link to="/hesabim/siparisler" className="bg-aqua-primary text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-aqua-primary-dark transition-colors">
              Siparişlerim
            </Link>
            <Link to="/" className="border-2 border-aqua-border text-aqua-text-secondary px-6 py-3 rounded-full font-semibold text-sm hover:border-aqua-primary hover:text-aqua-primary transition-all">
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* PayTR iFrame Modal */}
      <AnimatePresence>
        {paytrIframeUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-aqua-border-light">
                <h3 className="font-semibold text-aqua-secondary flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-aqua-primary" />
                  Güvenli Ödeme
                </h3>
                <button onClick={() => setPaytrIframeUrl(null)} className="text-aqua-text-muted hover:text-aqua-secondary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <iframe
                src={paytrIframeUrl}
                title="PayTR Ödeme"
                className="w-full min-h-[500px] border-0"
                allow="payment"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border-b border-aqua-border-light py-6">
        <div className="max-w-[1080px] mx-auto px-6">
          <div className="flex items-center justify-center gap-0">
            {steps.map((step, index) => (
              <div key={step.label} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold',
                    index < currentStep ? 'bg-aqua-primary border-aqua-primary text-white' :
                    index === currentStep ? 'border-aqua-primary text-aqua-primary bg-white' :
                    'border-aqua-border text-aqua-text-muted bg-white'
                  )}>
                    {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className={cn('text-sm font-medium hidden sm:block', index <= currentStep ? 'text-aqua-secondary' : 'text-aqua-text-muted')}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn('w-12 md:w-16 h-0.5 mx-3', index < currentStep ? 'bg-aqua-primary' : 'bg-aqua-border-light')} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1080px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
          <div className="space-y-5">
            <ScrollReveal>
              <div className="bg-white border border-aqua-border-light rounded-2xl p-6">
                <h3 className="text-base font-bold text-aqua-secondary flex items-center gap-2">
                  <User className="w-5 h-5 text-aqua-primary" />
                  İletişim Bilgileri
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-aqua-secondary mb-1 block">Ad Soyad *</label>
                    <input type="text" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-aqua-secondary mb-1 block">E-posta *</label>
                    <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-aqua-secondary mb-1 block">Telefon *</label>
                    <input type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="05XX XXX XX XX" className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-aqua-secondary mb-1 block">Sipariş Notu</label>
                    <textarea value={contact.note} onChange={(e) => setContact({ ...contact, note: e.target.value })} rows={1} className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary resize-none" />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="bg-white border border-aqua-border-light rounded-2xl p-6">
                <h3 className="text-base font-bold text-aqua-secondary flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-aqua-primary" />
                  Teslimat Adresi
                </h3>
                {savedAddresses.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {savedAddresses.filter((a) => a.type === 'shipping').map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => selectSavedAddress(a)}
                        className={cn(
                          'text-xs px-3 py-1.5 rounded-full border transition-all',
                          selectedAddressId === a.id ? 'border-aqua-primary bg-aqua-bg text-aqua-primary' : 'border-aqua-border text-aqua-text-muted'
                        )}
                      >
                        {a.title}
                      </button>
                    ))}
                  </div>
                )}
                <label className="flex items-center gap-2.5 mt-4 cursor-pointer">
                  <input type="checkbox" checked={address.sameBilling} onChange={(e) => setAddress({ ...address, sameBilling: e.target.checked })} className="w-4 h-4 accent-aqua-primary" />
                  <span className="text-sm text-aqua-text-secondary">Fatura adresim teslimat adresi ile aynı</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-aqua-secondary mb-1 block">Adres Başlığı</label>
                    <input type="text" value={address.title} onChange={(e) => setAddress({ ...address, title: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-aqua-secondary mb-1 block">Şehir</label>
                    <select value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl bg-white">
                      {TURKISH_CITIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-aqua-secondary mb-1 block">İlçe *</label>
                    <input type="text" value={address.district} onChange={(e) => setAddress({ ...address, district: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-aqua-secondary mb-1 block">Açık Adres *</label>
                    <textarea value={address.fullAddress} onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })} rows={2} className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary resize-none" />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="bg-white border border-aqua-border-light rounded-2xl p-6">
                <h3 className="text-base font-bold text-aqua-secondary flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-aqua-primary" />
                  Kurulum ve Servis
                </h3>
                <div className="mt-5 pt-2">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedSlot('');
                      if (e.target.value) setAvailableSlots(getSlotsForDate(e.target.value));
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl bg-aqua-bg mb-3"
                  />
                  {selectedDate && (
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.filter((s) => s.available).map((slot) => (
                        <button key={slot.id} type="button" onClick={() => setSelectedSlot(slot.id)} className={cn('flex items-center gap-2 p-3 rounded-xl border-2 text-left', selectedSlot === slot.id ? 'border-aqua-primary bg-aqua-bg/50' : 'border-aqua-border-light')}>
                          <Clock className="w-4 h-4 text-aqua-primary" />
                          <span className="text-sm">{slot.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="bg-white border border-aqua-border-light rounded-2xl p-6">
                <h3 className="text-base font-bold text-aqua-secondary flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-aqua-primary" />
                  Ödeme Yöntemi
                </h3>
                <div className="mt-4 space-y-2.5">
                  {paymentMethods.map((method) => (
                    <div key={method.id} onClick={() => setPaymentMethod(method.id)} className={cn('flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all', paymentMethod === method.id ? 'border-aqua-primary bg-aqua-bg/50' : 'border-aqua-border-light hover:border-aqua-border')}>
                      <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center', paymentMethod === method.id ? 'border-aqua-primary' : 'border-aqua-border')}>
                        {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-aqua-primary rounded-full" />}
                      </div>
                      <method.icon className="w-6 h-6 text-aqua-text-secondary" />
                      <div>
                        <p className="text-sm font-semibold text-aqua-secondary">{method.label}</p>
                        <p className="text-xs text-aqua-text-muted">{method.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {paymentMethod === 'card' && (
                  <p className="text-xs text-aqua-text-muted mt-4 p-3 bg-aqua-bg rounded-xl">
                    Kart bilgileriniz PayTR güvenli ödeme sayfasında girilir. Sitemiz kart bilgilerinizi saklamaz.
                    {!paytrEnabled && <span className="text-amber-600 block mt-1">⚠ PayTR henüz yapılandırılmamış.</span>}
                  </p>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.25}>
              <div className="bg-white border border-aqua-border-light rounded-2xl p-6">
                <h3 className="text-base font-bold text-aqua-secondary flex items-center gap-2">
                  <Truck className="w-5 h-5 text-aqua-primary" />
                  Kargo Seçimi
                </h3>
                <div className="mt-4 space-y-2.5">
                  {shippingMethods.map((method) => (
                    <div key={method.id} onClick={() => setShippingMethod(method.id)} className={cn('flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer', shippingMethod === method.id ? 'border-aqua-primary bg-aqua-bg/50' : 'border-aqua-border-light')}>
                      <div className="flex items-center gap-4">
                        <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center', shippingMethod === method.id ? 'border-aqua-primary' : 'border-aqua-border')}>
                          {shippingMethod === method.id && <div className="w-2.5 h-2.5 bg-aqua-primary rounded-full" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-aqua-secondary">{method.label}</p>
                          <p className="text-xs text-aqua-text-muted">{method.desc}</p>
                        </div>
                      </div>
                      <span className={cn('text-sm font-semibold', method.price === 0 ? 'text-aqua-success' : 'text-aqua-secondary')}>{method.priceLabel}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal x={20} delay={0.3}>
            <div className="lg:sticky lg:top-28 bg-white border border-aqua-border-light rounded-2xl p-6">
              <h3 className="text-base font-bold text-aqua-secondary mb-5">Sipariş Özeti</h3>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 py-2 border-b border-aqua-bg">
                    <div className="w-12 h-12 bg-aqua-bg rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.product.images?.[0] || '/images/products/placeholder.jpg'} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-aqua-secondary truncate">{item.product.name}</p>
                      <p className="text-xs text-aqua-text-muted">{item.quantity} x {item.product.price.toLocaleString('tr-TR')}₺</p>
                    </div>
                    <span className="text-sm font-semibold">{(item.product.price * item.quantity).toLocaleString('tr-TR')}₺</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-aqua-border-light">
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-aqua-text-muted" />
                      <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()} placeholder="Kupon kodu" className="w-full pl-8 pr-3 py-2.5 text-sm border border-aqua-border rounded-xl bg-[#F8FBFF]" />
                    </div>
                    <button onClick={handleApplyCoupon} disabled={couponLoading} className="px-4 py-2.5 text-sm font-semibold text-aqua-primary border-2 border-aqua-primary rounded-xl disabled:opacity-50">
                      {couponLoading ? '...' : 'Uygula'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-semibold text-emerald-700">{appliedCoupon.code}</span>
                    </div>
                    <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className="text-xs text-emerald-600">Kaldır</button>
                  </div>
                )}
              </div>

              <div className="space-y-2.5 pt-3 border-t border-aqua-border-light">
                <div className="flex justify-between text-sm"><span>Ara Toplam</span><span>{subtotal.toLocaleString('tr-TR')}₺</span></div>
                <div className="flex justify-between text-sm">
                  <span>Kargo</span>
                  <span className={effectiveShipping === 0 ? 'text-aqua-success' : ''}>{effectiveShipping === 0 ? 'Ücretsiz' : `${effectiveShipping}₺`}</span>
                </div>
                {codFee > 0 && <div className="flex justify-between text-sm"><span>Kapıda Ödeme</span><span>+{codFee}₺</span></div>}
                {discount > 0 && <div className="flex justify-between text-sm text-aqua-success"><span>İndirim</span><span>-{discount.toLocaleString('tr-TR')}₺</span></div>}
                <div className="flex justify-between text-base font-semibold pt-2 border-t">
                  <span>Genel Toplam</span>
                  <span className="text-xl font-bold">{total.toLocaleString('tr-TR')}₺</span>
                </div>
              </div>

              <button
                onClick={handleCompleteOrder}
                disabled={submitting}
                className="flex items-center justify-center gap-2 w-full bg-aqua-primary text-white py-4 rounded-full font-semibold hover:bg-aqua-primary-dark transition-all mt-4 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {submitting ? 'İşleniyor...' : paymentMethod === 'card' ? 'Ödemeye Geç' : 'Siparişi Tamamla'}
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </PageLayout>
  );
}
