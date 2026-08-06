# Aquails UX Standards (World Defaults)

Site genelinde beklenen standart web hareketleri. Yeni sayfa/özellik eklerken bunlara uy.

## Navigation & scroll

| Event | Behavior |
|-------|----------|
| Route change | Jump to top (`ScrollToTop` / `scrollToPageTop`) |
| Pagination / filter replace | Jump to top (`useScrollToTopOnChange`) |
| In-page `#anchor` | Scroll target into view (respect reduced motion) |
| Explicit “back to top” CTA | Smooth scroll OK |

## Overlays (drawer / modal / menu)

- Escape closes overlay (`useEscapeKey`)
- Body scroll locked while open (`useBodyScrollLock`)
- Click outside closes (backdrop)
- Prefer `role="dialog"` + `aria-modal="true"` when custom (or use Radix Sheet/Dialog)

## Links

- External: `ExternalLink` → `target="_blank"` + `rel="noopener noreferrer"`
- Internal: React Router `Link` / HashRouter `#/path`

## Accessibility

- Skip link: “Ana içeriğe geç” → `#main-content`
- `<main id="main-content" tabIndex={-1}>` focused on route change
- Active nav: `aria-current="page"`
- Unknown routes: dedicated **404** page (not silent redirect home)

## Motion

- Honor `prefers-reduced-motion` (CSS + Framer `MotionConfig reducedMotion="user"`)
- Do not rely on motion alone for meaning

## Forms

- Primary submit via `<form onSubmit>` so Enter works
- Disable submit while pending; guard `if (submitting) return`
