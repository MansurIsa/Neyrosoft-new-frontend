# Neyrosoft — frontend

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Redux Toolkit.

Replaces the previous Vite + React + SCSS + Bootstrap site.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local`:

```
NEXT_PUBLIC_API_ORIGIN=http://127.0.0.1:8000
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

`API_ORIGIN` is also what `next.config.ts` allows `<Image>` to load from, so
both need to be set, without a trailing slash.

The Django app has to be reachable and your frontend origin has to be in its
`CORS_ALLOWED_ORIGINS` — otherwise the calculator and chatbot will fail while
the rest of the site still renders.

```bash
npm run build && npm start
```

## Languages

Two layers, both working:

**Static text** — `src/i18n/dictionaries/az.json` and `en.json`. The Azerbaijani
file defines the shape, so if you add a key there TypeScript will tell you when
`en.json` is missing it.

**Content from the CMS** — every API call sends `Accept-Language: az | en`, and
Django's `LocaleMiddleware` plus modeltranslation return the right language.
This is the part that was broken before: `LocaleMiddleware` was in the wrong
position in the backend, so the header was ignored.

Routing is `/az/...` and `/en/...`. `src/middleware.ts` sends a bare `/` to the
visitor's preferred language, reading a `NEXT_LOCALE` cookie first and their
`Accept-Language` second. Picking a language in the header writes that cookie,
so the choice sticks.

## Light and dark mode

`ThemeScript` runs before first paint, so there's no flash of the wrong theme.
It reads `localStorage`, falling back to the OS preference. The toggle lives in
Redux (`ui.theme`) and writes `.dark` onto `<html>`.

Colours are CSS custom properties in `globals.css` — `--canvas`, `--surface`,
`--text`, `--muted`, `--line` — redefined under `.dark` and exposed to Tailwind
through `@theme inline`. To retheme the site you edit those two blocks, nothing
else.

**One thing to know if you edit `globals.css`:** custom classes must stay inside
`@layer base` / `@layer components`. Unlayered CSS beats anything Tailwind puts
in a layer, so a `.btn` defined outside a layer silently cancels `hidden`,
`border-signal` and every other utility applied to it. That bug was in the first
draft of this file and is why the mobile header looked wrong.

## Design

Colours come from the logo: navy `#0B304D` and red `#EE2037`. Red is reserved
for things you can act on — buttons, focus rings, the live node in the hero — so
it never reads as decoration.

The logo is a gear fused with a circuit trace, and the page borrows that
grammar: hairlines that turn at right angles, with a small square node marking
where each section begins. The hero trace draws itself once on load and
terminates next to the quote button. That is the only motion that isn't a
response to something the visitor did; `prefers-reduced-motion` disables it.

Type: Bricolage Grotesque for headlines, Inter Tight for body, loaded through
`next/font/google` (self-hosted at build time, no runtime request to Google).

Breakpoints: single column below 640, two columns to 1024, three above.
Checked at 390px, 834px and 1280px.

## Structure

```
src/
  app/[locale]/          pages — home, about, services, services/[id],
                         projects, blog, blog/[id], contact, calculator
  components/            Navbar, Footer, Hero, Cards, Calculator, Chatbot,
                         ContactForm, Counters, Loader, RouteProgress, Icons
  store/
    slices/uiSlice       theme, mobile menu, chat panel
    slices/chatSlice     transcript + sendChatMessage thunk
    slices/calculatorSlice  config, selection, estimate, submission
  i18n/                  dictionaries + client context
  lib/api.ts             typed fetch helpers, media URL resolution
  middleware.ts          locale redirect
```

Pages are server components and fetch on the server. Only the parts that need
interactivity — navbar, calculator, chatbot, contact form, counters — are client
components.

## Loading states

Three of them: `loading.tsx` renders a skeleton while a route segment streams,
`RouteProgress` draws a thin bar under the header on navigation, and the
calculator shows its own skeleton while the config loads.

## Calculator

Four steps: project type → scope → add-ons → design and timeline. The estimate
panel repriced on every change (debounced 250ms) and stays in view on desktop.
All the maths happens on the server, so the price a visitor sees and the price
saved with their request can't drift apart.

The last step collects contact details and posts to `/api/price-requests/`,
which lands in *Qiymət sorğuları* in the Django admin.

## Chatbot

Talks to `/api/chatbot/message/`, which matches keywords against rows your team
maintains in the admin. The panel keeps its transcript in Redux for the session
and passes `session_id` back so the backend can thread the conversation. Quick
replies come from the matched answer.

If the API is unreachable the panel says so rather than pretending to answer.

## Verified

- `npm run build` — 17 routes generated, no errors
- `npx tsc --noEmit` — clean
- Both locales render their own static text and their own CMS content
- Calculator prices, steps and submission tested in a real browser
- Chatbot answers correctly in both languages (12/12 on the intent test set)
- No console errors on any page

## Notes

- `next` is pinned to 15.5.25. Do not drop below 15.5.5 — earlier 15.5.x
  releases carry CVE-2025-66478.
- If you later serve media from a CDN, add its hostname to `images.remotePatterns`
  in `next.config.ts`.
