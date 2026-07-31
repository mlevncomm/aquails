import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

const PLACEHOLDER = '/images/products/placeholder.jpg';
const ZOOM = 2.5;

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

export function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const gallery = images.length > 0 ? images : [PLACEHOLDER];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const frameRef = useRef<HTMLDivElement>(null);

  const activeSrc = gallery[activeIndex] || gallery[0];

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + gallery.length) % gallery.length);
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % gallery.length);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxOpen, gallery.length]);

  const onImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = PLACEHOLDER;
  };

  const updateOrigin = useCallback((clientX: number, clientY: number) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    setOrigin({ x, y });
  }, []);

  const goPrev = () => setActiveIndex((i) => (i - 1 + gallery.length) % gallery.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % gallery.length);

  const zoomActive = canHover && hovering;

  return (
    <div className="w-full min-w-0">
      <div
        ref={frameRef}
        role="button"
        tabIndex={0}
        aria-label={`${alt} — büyütmek için tıklayın`}
        onClick={() => setLightboxOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setLightboxOpen(true);
          }
        }}
        onMouseEnter={() => {
          if (canHover) setHovering(true);
        }}
        onMouseLeave={() => setHovering(false)}
        onMouseMove={(e) => {
          if (canHover) updateOrigin(e.clientX, e.clientY);
        }}
        className={cn(
          'relative w-full max-w-full bg-aq-ice border border-aq-border/60 rounded-xl sm:rounded-2xl',
          'aspect-square flex items-center justify-center overflow-hidden',
          'cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-aq-blue/40',
          'select-none touch-manipulation'
        )}
      >
        <img
          src={activeSrc}
          alt={alt}
          draggable={false}
          onError={onImageError}
          className={cn(
            'max-w-full max-h-full w-auto h-auto object-contain pointer-events-none will-change-transform',
            zoomActive ? 'transition-none' : 'transition-transform duration-200 ease-out'
          )}
          style={{
            transform: zoomActive ? `scale(${ZOOM})` : 'scale(1)',
            transformOrigin: `${origin.x}% ${origin.y}%`,
          }}
        />

        {/* Magnifier lens ring */}
        {zoomActive && (
          <div
            aria-hidden
            className="pointer-events-none absolute w-24 h-24 sm:w-32 sm:h-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/95 shadow-[0_0_0_1px_rgba(15,40,80,0.12),0_10px_28px_rgba(15,40,80,0.22)]"
            style={{ left: `${origin.x}%`, top: `${origin.y}%` }}
          />
        )}

        <div
          className={cn(
            'absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-white/90 backdrop-blur-sm',
            'border border-aq-border/50 px-2.5 py-1.5 text-[11px] font-medium text-aq-muted',
            'shadow-sm pointer-events-none transition-opacity',
            zoomActive ? 'opacity-0' : 'opacity-100'
          )}
        >
          <ZoomIn className="w-3.5 h-3.5 text-aq-blue" />
          <span className="hidden sm:inline">Büyüt</span>
        </div>
      </div>

      {gallery.length > 1 && (
        <div className="mt-3 -mx-1 px-1 flex gap-2 sm:gap-3 overflow-x-auto overscroll-x-contain pb-1">
          {gallery.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`${alt} görsel ${i + 1}`}
              aria-current={activeIndex === i ? 'true' : undefined}
              className={cn(
                'relative shrink-0 w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-lg sm:rounded-xl border-2',
                'flex items-center justify-center bg-aq-ice transition-all overflow-hidden',
                activeIndex === i
                  ? 'border-aq-deep'
                  : 'border-transparent hover:border-aq-border/60'
              )}
            >
              <img
                src={img}
                alt={`${alt} - ${i + 1}`}
                className="max-w-full max-h-full w-auto h-auto object-contain"
                onError={onImageError}
              />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-[80] flex flex-col bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${alt} görsel önizleme`}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 shrink-0">
              <p className="text-sm text-white/80 truncate min-w-0">
                {alt}
                {gallery.length > 1 && (
                  <span className="text-white/50 ml-2">
                    {activeIndex + 1} / {gallery.length}
                  </span>
                )}
              </p>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="shrink-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="relative flex-1 min-h-0 flex items-center justify-center px-3 sm:px-16 pb-4"
              onClick={() => setLightboxOpen(false)}
            >
              <motion.img
                key={activeSrc}
                src={activeSrc}
                alt={alt}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                onClick={(e) => e.stopPropagation()}
                onError={onImageError}
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
              />

              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goPrev();
                    }}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    aria-label="Önceki görsel"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goNext();
                    }}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    aria-label="Sonraki görsel"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="shrink-0 flex justify-center gap-2 px-4 pb-5 overflow-x-auto">
                {gallery.map((img, i) => (
                  <button
                    key={`lb-${img}-${i}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(i);
                    }}
                    className={cn(
                      'shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 overflow-hidden bg-white/10 transition-all flex items-center justify-center',
                      activeIndex === i ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                    )}
                  >
                    <img
                      src={img}
                      alt=""
                      className="max-w-full max-h-full object-contain"
                      onError={onImageError}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
