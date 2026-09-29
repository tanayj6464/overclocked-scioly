# overclockedscioly.org

Site for BASE Overclocked, the Division C Science Olympiad team at Beaverton Academy of Science & Engineering (BASE) in Beaverton, Oregon. Next.js 16, TypeScript, Tailwind CSS 4, GSAP. Deployed on Vercel from `main`.

## Updating content

Almost everything lives in `src/content/site.ts`:

- `support.donateUrl`: the HCB donation link. Until set, the donate button shows "Donation link coming soon".
- `results`, `snapshot`: competition results and headline stats.
- `eventCategories[].events`: add event names per category; they appear automatically.
- `sponsors`: add `{ name, logo, url }`; put logo files in `public/sponsors/`.
- `members`: add `{ name, role, events, photo }` only with each member's permission; photos in `public/team/`.
- `photos.hero` / `photos.team`: set to a file in `public/photos/` to replace the drawn phoenix panels with real photos.
- `contact.email`, `social`: empty values stay hidden.
- `site.legalName` ("BASE Overclocked") is the formal name; `site.name` ("Overclocked") is the short brand.
- `/privacy` lives in `src/app/privacy/page.tsx`; update its date if you change it.

## Develop

```
npm install
npm run dev
```

`npm run build` must pass before pushing; Vercel runs the same build.

## Brand files

- `public/brand/phoenix-color.svg`, `phoenix-white.svg`: traced from the unofficial phoenix logo.
- `src/app/icon.svg`, `favicon.ico`, `apple-icon.png`: a bolder silhouette of the same mark, legible at small sizes.
- `src/app/opengraph-image.png`: link-preview card. Regenerate it if the headline stats change.
