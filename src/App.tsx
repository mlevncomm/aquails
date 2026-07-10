import { Routes, Route, Navigate } from 'react-router';
import { ScrollToTop } from './components/ScrollToTop';
import { ToastContainer } from './components/Toast';
import { RouteGuard } from './components/RouteGuard';

import { PublicLayout } from './layouts/PublicLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SearchResults from './pages/SearchResults';
import ComparePage from './pages/ComparePage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignDetail from './pages/CampaignDetail';
import BlogPage from './pages/BlogPage';
import BlogDetail from './pages/BlogDetail';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ServiceAppointmentPage from './pages/ServiceAppointmentPage';
import FilterSubscriptionPage from './pages/FilterSubscriptionPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import PrivacyPage from './pages/PrivacyPage';
import KVKKPage from './pages/KVKKPage';
import DistanceSalesPage from './pages/DistanceSalesPage';
import ReturnPolicyPage from './pages/ReturnPolicyPage';
import ShippingPage from './pages/ShippingPage';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

import CustomerDashboard from './pages/CustomerDashboard';
import CustomerOrdersPage from './pages/customer/CustomerOrdersPage';
import CustomerOrderDetailPage from './pages/customer/CustomerOrderDetailPage';
import CustomerAddressesPage from './pages/customer/CustomerAddressesPage';
import CustomerProfilePage from './pages/customer/CustomerProfilePage';
import CustomerFavoritesPage from './pages/customer/CustomerFavoritesPage';
import CustomerFilterTrackingPage from './pages/customer/CustomerFilterTrackingPage';
import CustomerServiceRequestsPage from './pages/customer/CustomerServiceRequestsPage';
import CustomerPasswordPage from './pages/customer/CustomerPasswordPage';
import CustomerSubscriptionsPage from './pages/customer/CustomerSubscriptionsPage';
import CustomerReturnsPage from './pages/customer/CustomerReturnsPage';
import CustomerNotificationsPage from './pages/customer/CustomerNotificationsPage';
import CustomerCouponsPage from './pages/customer/CustomerCouponsPage';
import CustomerComparePage from './pages/customer/CustomerComparePage';
import CustomerLoyaltyPage from './pages/customer/CustomerLoyaltyPage';
import CustomerReferralPage from './pages/customer/CustomerReferralPage';

import AdminDashboard from './pages/AdminDashboard';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductEditPage from './pages/admin/AdminProductEditPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';
import AdminCampaignsPage from './pages/admin/AdminCampaignsPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminQuestionsPage from './pages/admin/AdminQuestionsPage';
import AdminServiceRequestsPage from './pages/admin/AdminServiceRequestsPage';
import AdminServiceCalendarPage from './pages/admin/AdminServiceCalendarPage';
import AdminFilterTrackingPage from './pages/admin/AdminFilterTrackingPage';
import AdminSubscriptionsPage from './pages/admin/AdminSubscriptionsPage';
import AdminReturnsPage from './pages/admin/AdminReturnsPage';
import AdminStockPage from './pages/admin/AdminStockPage';
import AdminStockNotificationsPage from './pages/admin/AdminStockNotificationsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminLinksPage from './pages/admin/AdminLinksPage';
import AdminLoyaltyPage from './pages/admin/AdminLoyaltyPage';
import AdminPaymentSettingsPage from './pages/admin/AdminPaymentSettingsPage';
import AdminAbandonedCartsPage from './pages/admin/AdminAbandonedCartsPage';
import AdminShippingPage from './pages/admin/AdminShippingPage';
import AdminBulkPricePage from './pages/admin/AdminBulkPricePage';
import AdminProductImportPage from './pages/admin/AdminProductImportPage';
import CheckoutResultPage from './pages/CheckoutResultPage';

import AllLinksPage from './pages/AllLinksPage';
import ProductWizardPage from './pages/ProductWizardPage';
import FilterCalculatorPage from './pages/FilterCalculatorPage';
import WaterQualityTestPage from './pages/WaterQualityTestPage';
import ServiceNetworkPage from './pages/ServiceNetworkPage';
import FilterGuidePage from './pages/FilterGuidePage';

export default function App() {
  return (
    <RouteGuard>
      <ScrollToTop />
      <ToastContainer />
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
    </RouteGuard>
  );
}
