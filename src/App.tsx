import { Routes, Route, Navigate } from 'react-router';
import { lazy, Suspense } from 'react';
import { ScrollToTop } from './components/ScrollToTop';
import { ToastContainer } from './components/Toast';
import { RouteGuard } from './components/RouteGuard';

import { PublicLayout } from './layouts/PublicLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';

const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const CampaignsPage = lazy(() => import('./pages/CampaignsPage'));
const CampaignDetail = lazy(() => import('./pages/CampaignDetail'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage'));
const ServiceAppointmentPage = lazy(() => import('./pages/ServiceAppointmentPage'));
const FilterSubscriptionPage = lazy(() => import('./pages/FilterSubscriptionPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const KVKKPage = lazy(() => import('./pages/KVKKPage'));
const DistanceSalesPage = lazy(() => import('./pages/DistanceSalesPage'));
const ReturnPolicyPage = lazy(() => import('./pages/ReturnPolicyPage'));
const ShippingPage = lazy(() => import('./pages/ShippingPage'));

const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));

const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const CustomerOrdersPage = lazy(() => import('./pages/customer/CustomerOrdersPage'));
const CustomerOrderDetailPage = lazy(() => import('./pages/customer/CustomerOrderDetailPage'));
const CustomerAddressesPage = lazy(() => import('./pages/customer/CustomerAddressesPage'));
const CustomerProfilePage = lazy(() => import('./pages/customer/CustomerProfilePage'));
const CustomerFavoritesPage = lazy(() => import('./pages/customer/CustomerFavoritesPage'));
const CustomerFilterTrackingPage = lazy(() => import('./pages/customer/CustomerFilterTrackingPage'));
const CustomerServiceRequestsPage = lazy(() => import('./pages/customer/CustomerServiceRequestsPage'));
const CustomerPasswordPage = lazy(() => import('./pages/customer/CustomerPasswordPage'));
const CustomerSubscriptionsPage = lazy(() => import('./pages/customer/CustomerSubscriptionsPage'));
const CustomerReturnsPage = lazy(() => import('./pages/customer/CustomerReturnsPage'));
const CustomerNotificationsPage = lazy(() => import('./pages/customer/CustomerNotificationsPage'));
const CustomerCouponsPage = lazy(() => import('./pages/customer/CustomerCouponsPage'));
const CustomerComparePage = lazy(() => import('./pages/customer/CustomerComparePage'));
const CustomerLoyaltyPage = lazy(() => import('./pages/customer/CustomerLoyaltyPage'));
const CustomerReferralPage = lazy(() => import('./pages/customer/CustomerReferralPage'));

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'));
const AdminProductEditPage = lazy(() => import('./pages/admin/AdminProductEditPage'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminOrderDetailPage = lazy(() => import('./pages/admin/AdminOrderDetailPage'));
const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage'));
const AdminCouponsPage = lazy(() => import('./pages/admin/AdminCouponsPage'));
const AdminCampaignsPage = lazy(() => import('./pages/admin/AdminCampaignsPage'));
const AdminBlogPage = lazy(() => import('./pages/admin/AdminBlogPage'));
const AdminReviewsPage = lazy(() => import('./pages/admin/AdminReviewsPage'));
const AdminQuestionsPage = lazy(() => import('./pages/admin/AdminQuestionsPage'));
const AdminServiceRequestsPage = lazy(() => import('./pages/admin/AdminServiceRequestsPage'));
const AdminServiceCalendarPage = lazy(() => import('./pages/admin/AdminServiceCalendarPage'));
const AdminFilterTrackingPage = lazy(() => import('./pages/admin/AdminFilterTrackingPage'));
const AdminSubscriptionsPage = lazy(() => import('./pages/admin/AdminSubscriptionsPage'));
const AdminReturnsPage = lazy(() => import('./pages/admin/AdminReturnsPage'));
const AdminStockPage = lazy(() => import('./pages/admin/AdminStockPage'));
const AdminStockNotificationsPage = lazy(() => import('./pages/admin/AdminStockNotificationsPage'));
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));
const AdminLinksPage = lazy(() => import('./pages/admin/AdminLinksPage'));
const AdminLoyaltyPage = lazy(() => import('./pages/admin/AdminLoyaltyPage'));
const AdminPaymentSettingsPage = lazy(() => import('./pages/admin/AdminPaymentSettingsPage'));
const AdminAbandonedCartsPage = lazy(() => import('./pages/admin/AdminAbandonedCartsPage'));
const AdminShippingPage = lazy(() => import('./pages/admin/AdminShippingPage'));
const AdminBulkPricePage = lazy(() => import('./pages/admin/AdminBulkPricePage'));
const AdminProductImportPage = lazy(() => import('./pages/admin/AdminProductImportPage'));
const CheckoutResultPage = lazy(() => import('./pages/CheckoutResultPage'));

const AllLinksPage = lazy(() => import('./pages/AllLinksPage'));
const ProductWizardPage = lazy(() => import('./pages/ProductWizardPage'));
const FilterCalculatorPage = lazy(() => import('./pages/FilterCalculatorPage'));
const WaterQualityTestPage = lazy(() => import('./pages/WaterQualityTestPage'));
const ServiceNetworkPage = lazy(() => import('./pages/ServiceNetworkPage'));
const FilterGuidePage = lazy(() => import('./pages/FilterGuidePage'));

export default function App() {
  return (
    <RouteGuard>
      <ScrollToTop />
      <ToastContainer />
      <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center text-sm text-aq-muted">Sayfa yükleniyor...</div>}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/urunler" element={<Shop />} />
          <Route path="/urun/:slug" element={<ProductDetail />} />
          <Route path="/sepet" element={<Cart />} />
          <Route path="/odeme" element={<Checkout />} />
          <Route path="/odeme/basarili" element={<CheckoutResultPage />} />
          <Route path="/odeme/basarisiz" element={<CheckoutResultPage />} />
          <Route path="/arama" element={<SearchResults />} />
          <Route path="/karsilastir" element={<ComparePage />} />
          <Route path="/kampanyalar" element={<CampaignsPage />} />
          <Route path="/kampanya/:slug" element={<CampaignDetail />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/siparis-takip" element={<OrderTrackingPage />} />
          <Route path="/servis-randevusu" element={<ServiceAppointmentPage />} />
          <Route path="/filtre-aboneligi" element={<FilterSubscriptionPage />} />
          <Route path="/hakkimizda" element={<AboutPage />} />
          <Route path="/iletisim" element={<ContactPage />} />
          <Route path="/sss" element={<FAQPage />} />
          <Route path="/gizlilik" element={<PrivacyPage />} />
          <Route path="/kvkk" element={<KVKKPage />} />
          <Route path="/mesafeli-satis" element={<DistanceSalesPage />} />
          <Route path="/iade" element={<ReturnPolicyPage />} />
          <Route path="/kargo-kurulum" element={<ShippingPage />} />
          <Route path="/urun-secim-sihirbazi" element={<ProductWizardPage />} />
          <Route path="/filtre-hesaplayici" element={<FilterCalculatorPage />} />
          <Route path="/su-kalitesi-testi" element={<WaterQualityTestPage />} />
          <Route path="/servis-agimiz" element={<ServiceNetworkPage />} />
          <Route path="/filtre-secim-rehberi" element={<FilterGuidePage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/giris" element={<LoginPage />} />
          <Route path="/kayit-ol" element={<RegisterPage />} />
          <Route path="/sifremi-unuttum" element={<ForgotPasswordPage />} />
          <Route path="/sifre-sifirla" element={<ResetPasswordPage />} />
        </Route>

        <Route element={<CustomerLayout />}>
          <Route path="/hesabim" element={<CustomerDashboard />} />
          <Route path="/hesabim/siparisler" element={<CustomerOrdersPage />} />
          <Route path="/hesabim/siparisler/:id" element={<CustomerOrderDetailPage />} />
          <Route path="/hesabim/adresler" element={<CustomerAddressesPage />} />
          <Route path="/hesabim/profil" element={<CustomerProfilePage />} />
          <Route path="/hesabim/favoriler" element={<CustomerFavoritesPage />} />
          <Route path="/hesabim/filtre-takibi" element={<CustomerFilterTrackingPage />} />
          <Route path="/hesabim/servis-talepleri" element={<CustomerServiceRequestsPage />} />
          <Route path="/hesabim/sifre-degistir" element={<CustomerPasswordPage />} />
          <Route path="/hesabim/abonelikler" element={<CustomerSubscriptionsPage />} />
          <Route path="/hesabim/iade-degisim" element={<CustomerReturnsPage />} />
          <Route path="/hesabim/bildirimler" element={<CustomerNotificationsPage />} />
          <Route path="/hesabim/kuponlarim" element={<CustomerCouponsPage />} />
          <Route path="/hesabim/karsilastirma" element={<CustomerComparePage />} />
          <Route path="/hesabim/puanlarim" element={<CustomerLoyaltyPage />} />
          <Route path="/hesabim/davet-et" element={<CustomerReferralPage />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/urunler" element={<AdminProductsPage />} />
          <Route path="/admin/urunler/ekle" element={<AdminProductEditPage />} />
          <Route path="/admin/urunler/:id" element={<AdminProductEditPage />} />
          <Route path="/admin/kategoriler" element={<AdminCategoriesPage />} />
          <Route path="/admin/siparisler" element={<AdminOrdersPage />} />
          <Route path="/admin/siparisler/:id" element={<AdminOrderDetailPage />} />
          <Route path="/admin/musteriler" element={<AdminCustomersPage />} />
          <Route path="/admin/kuponlar" element={<AdminCouponsPage />} />
          <Route path="/admin/kampanyalar" element={<AdminCampaignsPage />} />
          <Route path="/admin/blog" element={<AdminBlogPage />} />
          <Route path="/admin/yorumlar" element={<AdminReviewsPage />} />
          <Route path="/admin/sorular" element={<AdminQuestionsPage />} />
          <Route path="/admin/servis-talepleri" element={<AdminServiceRequestsPage />} />
          <Route path="/admin/servis-takvimi" element={<AdminServiceCalendarPage />} />
          <Route path="/admin/filtre-takibi" element={<AdminFilterTrackingPage />} />
          <Route path="/admin/abonelikler" element={<AdminSubscriptionsPage />} />
          <Route path="/admin/iade-degisim" element={<AdminReturnsPage />} />
          <Route path="/admin/stok" element={<AdminStockPage />} />
          <Route path="/admin/stok-bildirimleri" element={<AdminStockNotificationsPage />} />
          <Route path="/admin/raporlar" element={<AdminReportsPage />} />
          <Route path="/admin/ayarlar" element={<AdminSettingsPage />} />
          <Route path="/admin/odeme-ayarlari" element={<AdminPaymentSettingsPage />} />
          <Route path="/admin/linkler" element={<AdminLinksPage />} />
          <Route path="/admin/sadakat" element={<AdminLoyaltyPage />} />
          <Route path="/admin/terk-edilmis-sepetler" element={<AdminAbandonedCartsPage />} />
          <Route path="/admin/kargo" element={<AdminShippingPage />} />
          <Route path="/admin/toplu-fiyat" element={<AdminBulkPricePage />} />
          <Route path="/admin/urun-yukleme" element={<AdminProductImportPage />} />
        </Route>

        <Route path="/all-links" element={<AllLinksPage />} />
        <Route path="/links" element={<AllLinksPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </RouteGuard>
  );
}
