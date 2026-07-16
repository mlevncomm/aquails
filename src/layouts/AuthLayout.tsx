import { Outlet } from 'react-router';

export function AuthLayout() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-white p-5 sm:p-8 relative overflow-x-hidden w-full max-w-[100vw]">
      <div className="absolute -top-[20%] -right-[10%] w-[420px] h-[420px] bg-aq-sky/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-[18%] -left-[8%] w-[360px] h-[360px] bg-aq-ice rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
