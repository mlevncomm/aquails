import { Outlet } from 'react-router';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';

export function PublicLayout() {
  return (
    <div className="min-h-[100dvh] flex flex-col w-full max-w-[100vw] overflow-x-clip">
      <Header />
      <main className="flex-1 min-w-0 w-full">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
    </div>
  );
}
