# BEAUTI BOX — concept website

A complete editorial beauty studio website demonstration, built with Next.js App Router, React, TypeScript, Tailwind CSS, Motion and Lucide. The interface independently reconstructs the composition of the Lunaria reference using real components and independently sourced photography. This is a **concept preview**, not an official salon booking site.

## Run locally

Use Node.js 20.9 or later (developed and built with Node.js 24).

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). On Windows PowerShell, use `npm.cmd` if your execution policy blocks `npm.ps1`.

If port 3000 is occupied, use `npm run dev -- --port 3100`. The finished presentation was also checked with `npm start -- --port 3101` at [localhost:3101](http://localhost:3101).

```bash
npm run typecheck
npm run build
npm start
```

The production build uses Next.js defaults and is ready to import into Vercel. Select the Next.js framework preset; build command `npm run build`, default output directory, and Node.js 24. No environment variables, database or paid integrations are required for this demonstration. Vercel's [free Hobby plan](https://vercel.com/docs/plans/hobby) is restricted to personal, non-commercial use; a commercial client deployment needs an eligible plan. No public deployment is claimed.

## Structure and editing

- `app/page.tsx`: homepage entry.
- `components/StudioSite.tsx`: reusable navigation, hero, editorial labels, service overview/filters/cards, experience, gallery/lightbox, team, booking, contact and footer components.
- `app/globals.css`: local font, visual tokens, editorial layout, responsive breakpoints and reduced-motion rules.
- `lib/content.ts`: business contact configuration, categories, descriptive copy, sample INR prices/durations, demo team profiles and gallery captions.
- `public/images/`: locally stored photography, original supplied brand/studio images, and licensed Inter Tight font.
- `reference-audit.md`: observations and limitations of the five reference boards.
- `reference/`: reference images for comparison only. These are not imported into the site or public assets.
- `ASSET-CREDITS.md`: image sources, license links and original supplied artwork attribution. The font license is retained at `public/images/InterTight-OFL.txt`.

## Demo behavior

All page navigation and service-category filters work. Service cards select a category/service in the appointment form. Gallery images open in a keyboard-accessible lightbox with previous/next controls, arrow keys, Escape, focus trapping and restored focus.

The appointment form validates the customer's name, phone, category, local-calendar date and time, then presents a review step and editable preferences. Its final step is explicitly simulated. No details leave the browser, no data is persisted, and no salon appointment is reserved. The contact form also confirms only a local demonstration. Placeholder social/contact details are rendered as text until configured, avoiding invented business destinations.

Set `business.whatsappNumber` in `lib/content.ts` to the studio's verified number (country code included) to enable the WhatsApp link. Set the verified phone, email and Instagram URL in the same object to activate their links. Keep these fields null until confirmed.

## Client information needed before launch

- Confirmed address, map destination, opening hours and holiday arrangements.
- Verified phone, email, WhatsApp number and Instagram URL.
- Approved service titles, descriptions, pricing, duration and consultation policies.
- Actual staff portraits, approved names, roles and biographies to replace clearly marked demo profiles.
- Additional actual studio photography to replace images labeled illustrative atmosphere.
- A real booking provider/backend, availability rules, cancellation terms and staff confirmation workflow.
- Contact delivery integration, privacy notice, consent requirements and data retention policy.
- Final approval of branding, site copy, photography licensing, hosting domain and accessibility review.

## Verification

TypeScript checking and optimized production build were executed successfully during implementation. See `qa-report.md` for executed responsive and functional browser checks, evidence and limitations. `screenshots/` contains captured desktop and mobile presentation/QA images. No production booking, message delivery or deployment integration is claimed.
