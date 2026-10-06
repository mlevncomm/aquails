import { Outlet, Link } from 'react-router';
import { Check } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

const perks = ['Siparişlerinizi tek yerden takip edin', 'Filtre değişim hatırlatmaları alın', 'Size özel kampanyalardan yararlanın'];

/** Split auth screen: brand photo panel on large screens, form column everywhere. */
export function AuthLayout() {
  return (
    <div className="grid min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden bg-white lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative isolate hidden overflow-hidden bg-aq-ink lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <img
          src="/images/lifestyle/hero-lake.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[60%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(160deg,rgba(11,37,64,0.88)_0%,rgba(11,37,64,0.55)_55%,rgba(11,37,64,0.35)_100%)]" />

        <Link to="/" aria-label="Aquails Ana Sayfa" className="self-start">
          <BrandLogo variant="logo" bare inverted className="text-[1.2rem] gap-[0.32em]" />
        </Link>

        <div className="max-w-md">
          <p className="font-script text-4xl leading-none text-aq-mist">Hoş geldiniz</p>
          <h2 className="mt-3 text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-white xl:text-5xl">
            Saf Su,
            <br />
            Sağlıklı Yaşam
          </h2>
          <ul className="mt-8 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-white/85">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Check className="h-3.5 w-3.5 text-aq-mist" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/50">© {new Date().getFullYear()} Aquails</p>
      </aside>

      <main className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-[420px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function AuthBrand() {
  return (
    <Link to="/" className="mb-10 flex lg:hidden" aria-label="Aquails Ana Sayfa">
      <BrandLogo variant="logo" bare className="text-[1.15rem] gap-[0.32em]" />
    </Link>
  );
}
