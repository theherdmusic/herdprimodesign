<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Herd uses a shared phone-shell component with separate content routes for its four tabs (Feed, Charts, TV, You), keeping the mockup visually consistent.
- All mockup actions use client state and sample assets, with no backend or production uploads, because this is a design-only prototype.
- The opening film plays once per install: a device-storage flag (helpers in `src/lib/herd-entry.ts`, tested) is checked after hydration, and Skip/end goes straight to the feed.
- Sign-in is requested only for heart, follow and comment (`needsSignIn`); watching and scrolling never require an account.
- React & Win is a sponsor overlay, not a tab. Its trigger is an icon-only tab-bar button next to Discovery; the open state lives in `ReactAdProvider` around `<Outlet />` in `__root.tsx` (not inside PhoneShell) so the feed can consume it via `useReactAd()` and pause/resume its video around the ad.
- The opening sequence's film order lives in `src/lib/herd-intro.ts` (a browser-safe helper with a boundary test), so only the last film hands off to the entry screen; the opening is the single vertical sheep film, because the user dropped the delivery-van clip (herd-after) from it and kept the sheep.
- The HERD TV tab plays the sheep intro clip once, then the show clip end to end (no loop, no countdown overlay), then the commercial in full, then the show again; keep the lower third to the HERD TV label plus a commercial-break marker, because the user removed the upload form and every countdown pill. The three-minute duration helper and its boundary tests stay in place for when submissions return.
- Sample feed video is served from CDN asset pointers in two formats (H.264 MP4 first, VP9 WebM fallback) because the sandbox test browser has no H.264 decoder, so an MP4-only clip cannot be verified there.
- Overlay gestures use React handlers on the overlay element itself, not window listeners, so they are attached the moment the element exists.
- Sandbox gesture tests wait until the target element carries a `__react` key before dispatching touches, because React 19 hydrates lazily and events sent earlier are dropped.
- Home-screen support uses manifest-only metadata and opaque icons derived from the supplied logo, with an explicit Apple touch icon; no app-shell service worker is needed because offline use is not requested.
- Floating McGee uses a standalone full-screen content route with CSS-only horizontal motion, keeping the supplied artwork unchanged and honoring reduced-motion preferences.
