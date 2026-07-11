import { Link, Outlet } from 'react-router';
import { BrandLogo } from '@/components/BrandLogo';

export function AuthLayout() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-[#E8F4FD] via-[#F0F6FF] to-[#C5E0F8] p-4 relative overflow-x-hidden w-full max-w-[100vw]">
      {/* Soft blob decorations */}
      <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-[#1A73E8]/[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[400px] h-[400px] bg-[#4FC3F7]/[0.06] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1A73E8]/[0.02] rounded-full blur-3xl pointer-events-none" />
      
      {/* Subtle wave at top */}
      <svg className="absolute top-0 left-0 w-full h-32 pointer-events-none opacity-30" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path fill="rgba(26,115,232,0.03)" d="M0,60L48,55C96,50,192,40,288,45C384,50,480,70,576,75C672,80,768,70,864,60C960,50,1056,40,1152,42C1248,45,1344,60,1392,67L1440,75L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
      </svg>
      
      {/* Logo */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <Link to="/">
          <BrandLogo variant="logo" className="h-8" />
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
