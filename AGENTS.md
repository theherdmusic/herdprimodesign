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

- Herd uses a shared phone-shell component with separate content routes for its five tabs, keeping the mockup visually consistent.
- All mockup actions use client state and sample assets, with no backend or production uploads, because this is a design-only prototype.
- Video duration validation lives in a browser-safe helper with boundary tests so the upload limit remains enforceable.
