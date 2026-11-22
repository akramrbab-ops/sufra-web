# Sufra — testing web app

Mobile-first React + TypeScript + Vite front end for the Sufra restaurant booking app (Riyadh). Mock data, no backend; state persists in localStorage.

    npm install
    npm run dev       # local dev
    npm run build     # static build in dist/ (relative paths + hash routing, works on any static host)

- `src/app` — shell, animated router, transitions
- `src/screens/<flow>` — onboarding, discover, restaurant, booking, bookings (detail, bill, review), rewards & gifts, profile
- `src/components/ui` — design-system components (tokens match the Figma file)
- `src/data` — mock restaurants, menus, reviews, collections
- `src/store` — zustand stores (persisted)
- `src/i18n/en.ts` — all UI copy; add `ar.ts` with the same keys for Arabic (RTL is driven by `setLocale`)

Test codes: any 6-digit OTP works; promo code `SUFRA25` = SAR 25 off. Reset data: Profile → Settings → Delete account.
