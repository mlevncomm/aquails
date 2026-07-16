import { Link, Outlet } from 'react-router';
import { BrandLogo } from '@/components/BrandLogo';

export function AuthLayout() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-white p-5 sm:p-8 relative overflow-x-hidden w-full max-w-[100vw]">
      <div className="absolute -top-[20%] -right-[10%] w-[420px] h-[420px] bg-aq-sky/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-[18%] -left-[8%] w-[360px] h-[360px] bg-aq-ice rounded-full blur-3xl pointer-events-none" />

      <div className="absolute top-7 left-1/2 -translate-x-1/2 z-20">
        <Link to="/">
          <BrandLogo variant="logo" className="h-8" />
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md mt-10">
        <Outlet />
      </div>
    </div>
  );
}
