# LUXUS DESIGN

Next.js App Router, TypeScript, Tailwind CSS 4, Framer Motion, Lucide, and responsive Next Image assets.

## Run

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000/fr. Routes are available under `/fr`, `/en`, and `/ar` with RTL Arabic. Run `npm run typecheck`, `npm run lint`, and `npm run build` before deployment. Vercel can deploy this folder as a standard Next.js project.

## Content and launch setup

Copy `.env.example` to `.env.local` and add **verified** business contact details, Instagram URL, WhatsApp number, production URL, and the quote delivery webhook. Do not expose the webhook or its token through a `NEXT_PUBLIC_` variable. The webhook receives validated JSON and must return 2xx only after it has accepted delivery. Put rate limiting / abuse controls in front of the endpoint before a public campaign. The form validates on the client and server, rejects cross-origin submissions and oversized bodies, and includes a honeypot. It does not store customer data locally or on the server.

Without a webhook, the API returns 503 NOT_CONFIGURED. The UI explicitly says the request was not delivered and provides a downloadable copy. There is no simulated success. Configured WhatsApp uses an encoded inquiry with the selected services and details.

Legal and privacy routes exist in all three languages but are clearly marked as drafts. Complete the business identity, hosting, controller contact information and retention policy before public launch. Canonical URLs and sitemap entries are generated once NEXT_PUBLIC_SITE_URL is configured. No unverified structured business data is emitted.

No project locations, numerical claims, customer reviews, phone numbers or social accounts have been invented. The unverified testimonial section is hidden by default. SHOW_SAMPLE_TESTIMONIALS=true enables explicitly labelled editorial samples for internal review only. Classic and Moroccan collection routes display an honest empty state because the supplied originals do not establish those categories. Category photographs for these pending collections are inspiration imagery, not assertions of project classification.

## Assets

`public/images` contains optimized WebP copies of the supplied business photography. The approved beige sectional is the hero. Three materials photographs are extracted from the supplied approved reference, excluding its text overlays. Their limited source resolution means that high-resolution originals should replace them before a large-screen marketing launch. Original files are retained. `prepare-assets.py` uses Pillow to reproduce optimization from the local asset copies.

## Structure

- `src/components/Site.tsx`: server-rendered page sections and footer.
- `src/components/Interactive.tsx`: accessible navigation, filters, galleries, motion, quote form.
- `src/lib/i18n.ts`: French, English, Arabic UI strings.
- `src/data/projects.ts`: supplied project image sets and localized titles.
- `src/app/[locale]/[[...path]]/page.tsx`: localized page routing and metadata.
- `src/app/api/quote/route.ts`: validated delivery endpoint.

Verified facts and real customer-approved testimonials can be added without changing the layout. Project titles are editorial descriptions of supplied photographs, not claims of locations or client identities.
