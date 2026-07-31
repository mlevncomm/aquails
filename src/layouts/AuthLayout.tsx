import { Outlet, Link } from 'react-router';
import { BrandLogo } from '@/components/BrandLogo';

export function AuthLayout() {
  return (
    <div className="relative min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden flex items-center justify-center p-5 sm:p-8 bg-[#F7FBFE]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_10%_-10%,rgba(32,211,242,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_95%_10%,rgba(18,134,216,0.16),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_110%,rgba(6,38,61,0.06),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(6,38,61,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(6,38,61,0.35) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        <Outlet />
      </div>
    </div>
  );
}

export function AuthBrand() {
  return (
    <Link to="/" className="mb-8 flex justify-center" aria-label="Aquails Ana Sayfa">
      <BrandLogo variant="logo" bare className="text-[1.2rem] gap-[0.32em]" />
    </Link>
  );
}
