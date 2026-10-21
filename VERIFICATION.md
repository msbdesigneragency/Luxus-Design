# Verification — 21 October 2026

- Production build: passed (Next.js 16.4.2). Build workers limited to two for this machine. If Windows reports low virtual memory, set NODE_OPTIONS=--max-old-space-size=1024 --max-semi-space-size=16 and rerun the build.
- TypeScript and ESLint: passed.
- Local production route checks: all 69 localized pages returned 200 with matching language attributes; Arabic pages use RTL.
- Unknown locale, unknown page and unknown project: HTTP 404 verified.
- Quote API: malformed payload, invalid phone, missing consent, honeypot and cross-origin rejection verified; valid request without a destination returns 503 NOT_CONFIGURED.
- Browser: URL-backed project filtering, French-to-Arabic language switching with the current filter, English mobile language switching, gallery previous/next, mobile menu Escape and focus restoration, consent keyboard interaction, quote submission and explicit non-delivery message verified.
- Homepage overflow: none at 320, 360, 375, 390, 414, 430, 768, 1024, 1440 and 1920px.
- Production homepage images: loaded successfully after scrolling. No production console errors during the final homepage inspection.
- Screenshots: saved in qa/ (ignored in Git), including English and Arabic mobile captures. Desktop full-page evidence is assembled from overlapping browser captures because the native fullPage capture failed.
- npm production audit: zero vulnerabilities. The full dependency tree still reports five advisories in development-only ESLint glob dependencies; npm currently proposes an incompatible downgrade as its automated fix. No forced downgrade applied.

## Remaining launch inputs

Verified contact details and social accounts; production domain; quote webhook and optional WhatsApp number; approved legal text and business registration details; real customer reviews; confirmed statistics if numerical highlights are desired; high-resolution materials photos; confirmed photographs for the classic and Moroccan collections.

The site is prepared for standard Vercel deployment. No public deployment has been performed. Real webhook delivery and outbound social/WhatsApp destinations cannot be tested until configured.
