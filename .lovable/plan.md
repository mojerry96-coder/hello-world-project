# Run the MPH8430 simulation in the live app + keep GitHub auto-sync

## What's true right now (verified)

- The GitHub branch `mph8430-simulation` (repo `mojerry96-coder/hello-world-project`) is at commit `bd58071` — the **exact same commit** as this Lovable project's HEAD. Git status is clean. The files are byte-identical. So the project is already "pulled"; there is nothing new to fetch.
- The MPH8430 simulation lives in `app/` as a **standalone Vite + react-router-dom** app (`app/src/main.tsx`, `app/package.json`, `app/vite.config.ts`). The Lovable preview/publish is powered by the **TanStack Start** app in `src/`, whose `src/routes/index.tsx` is still the blank placeholder. Nothing in `src/` imports from `app/`, so the preview shows the placeholder, not your 15-page simulation.

## Goal

1. Make the MPH8430 15-page simulation actually run in the Lovable preview and published site.
2. Keep it auto-syncing to the GitHub repo.

## Approach — port `app/` into the TanStack Start app (`src/`)

The TanStack stack does **not** allow `react-router-dom` (fixed router). So this is a real port, not a re-pointing of a config. The simulation is a linear, state-gated, fixed-canvas (1672×941) experience, so the port is mechanical.

```
app/src/index.css            -> tokens + classes appended to src/styles.css
app/public/media/*           -> public/media/*   (served as /media/<file>)
app/src/state/*              -> src/sim/state/*
app/src/routes.ts            -> src/sim/routes.ts
app/src/design/*             -> src/sim/design/*
app/src/components/*         -> src/sim/components/*
app/src/content/*           -> src/sim/content/*
app/src/pages/Page01..15     -> src/sim/pages/Page01..15   (import line only)
```

### Steps

1. **CSS / design tokens.** Append the `:root` custom properties and the plain CSS classes (`.viewport`, `.artboard`, `.option`, `.primary-cta`, `.budget-range`, `.focusable`, `.page-enter`) from `app/src/index.css` into `src/styles.css` (after the Tailwind `@theme`). The Inter web-font `@import` becomes a `<link>` in `__root.tsx` `head()` (per stack rules — no remote `@import` in styles.css).

2. **Dependencies.** Add `@phosphor-icons/react` to the root `package.json`. Do **not** add `react-router-dom`. (react/react-dom already present.)

3. **Media.** Move `app/public/media/*` → `public/media/*`. `MediaSlot` references `${import.meta.env.BASE_URL}media/<src>`, which resolves to `/media/<src>` in the TanStack/Vite build — unchanged.

4. **Port sim modules** into `src/sim/` (state, routes, components, design, content, the 15 page components). These are plain React; they copy across unchanged.

5. **Routing — react-router → TanStack Router.** Replace the `BrowserRouter` + `Routes/Route` model with:
   - `src/routes/index.tsx`: redirect `/` → `/opening` via `beforeLoad` (`redirect({ to: "/opening", replace: true })`).
   - `src/routes/$page.tsx`: one dynamic route that matches `/opening`, `/mission`, … `/outcome`. It looks up the page by path in `ROUTES`, renders `<Artboard><Guard><Page/></Guard></Artboard>`, and redirects unknown/blocked paths to `furthestAllowed(state).path`.
   - A tiny nav helper (`src/sim/lib/navigate.ts`) re-exports TanStack `useNavigate` wrapped to accept a path string, so the 15 page files only change their **import line** (`useNavigate` source) — their `navigate("/mission")` call sites stay byte-identical.

6. **SSR safety.** The simulation is client-only: `shuffleReports()` uses `Math.random()` and state loads from `localStorage`. To avoid hydration mismatch, wrap the whole simulation subtree in `<ClientOnly>` (SSR renders a neutral `<div className="viewport">` fallback). The page-gating `Guard` redirect runs on the client via TanStack `useNavigate`.

7. **Provider wiring.** `SimulationProvider` wraps the sim **inside** the `<ClientOnly>` subtree in `$page.tsx` (not in `__root.tsx`), so SSR never evaluates the random/localStorage initializer.

8. **Remove `app/`** once the port builds green and media is moved — it's a dead duplicate and its own `package.json`/Vite config could otherwise confuse tooling. (Removing it is safe: the source of truth is now `src/sim/`.)

9. **`head()` metadata** for the index route: a real title/description + og/twitter tags for the simulation (replacing the placeholder). Inter font `<link>` goes here too.

10. **Verify.** `bun run build` green, then Playwright check in the preview: page 1 renders the artboard, the CTA advances to `/mission`, and a deep-link to a locked page redirects to the furthest allowed page.

### Notes
- The fixed 1672×941 landscape artboard is preserved as-is (it self-scales via `useArtboardScale` and shows a rotate notice in portrait).
- shadcn `src/components/ui/*` and the template auth/api routes are untouched.

## GitHub auto-sync (Part 2)

The fact that the GitHub repo's `mph8430-simulation` tip is the **identical commit** (`bd58071`) to this project's HEAD is strong evidence that Git sync to that repo is **already connected** (Lovable mirrors its internal git to GitHub via the GitHub App). If so:

- After the port builds green, Lovable auto-pushes the new commit to GitHub — two-way sync, no manual step.

I'll confirm this after the build by checking that the new commit appears on the `mph8430-simulation` branch. If it does **not** (i.e. the repo was a one-off manual copy, not an active sync), I'll guide you to connect it through the Lovable editor: **Plus (+) menu → GitHub → Connect project**, then authorize the Lovable GitHub App. That flow normally creates a new repo; since your repo already exists with matching history, I'll help reconcile so the existing `hello-world-project` keeps receiving updates rather than spinning up a second repo.

## What I will not do
- Install or use `react-router-dom` in the TanStack app (forbidden by the stack).
- Change the simulation's content, logic, or visual design — this is a faithful port, not a redesign.
