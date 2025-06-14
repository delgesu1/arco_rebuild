# Arco Violin Etudes – Next.js Migration Plan

This document breaks the refactor from a vanilla-JS SPA to a modern **Next.js (app router, TypeScript)** code-base into clear phases and steps.  Each phase can be delivered and deployed independently while guaranteeing **feature parity** (all current behaviours keep working exactly the same).

Legend
- ⏱ = estimated effort (dev-days)
- ✅ = acceptance criteria
- 🔗 = dependency / prerequisite

---

## Phase 0 – Prep & Tooling  *(~½ day)*
|Step|Description|Done|
|----|-----------|----|
|0.1|Install Node ≥ 18, pnpm / yarn classic| |
|0.2|`npx create-next-app@latest arco-web --ts --eslint --tailwind` (or CSS-modules)| |
|0.3|Add prettier + commitlint + husky for pre-commit lint| |
|0.4|Configure absolute imports (`@/components`, `@/lib`)| |
|0.5|Create `.env.local.example` with placeholder secrets (LLM, DB, Stripe)| |
|0.6|Install `react-pdf` & `pdfjs-dist` packages.<br>_Ensure React-PDF's AnnotationLayer & TextLayer CSS is imported (globally or in PdfViewer component)._| |
|0.7|If on Next.js ≤14, add `swcMinify: false` to `next.config.js`| |

---

## Phase 1 – Static Asset Migration *(1 day)*
|Step|When|Details|Done|
|----|----|-------|----|
|1.1|Immediately|Copy `/src/assets/**` (images, pdfs) → `public/`| |
|1.2|Immediately|Copy `/src/css/style.css` → `styles/globals.css`; import in `layout.tsx`| |
|1.3|After Tailwind?|Optionally translate globals to Tailwind classes or keep as is| |
|1.4|Immediately|Move Google Fonts / FontAwesome links into `<Head>` component| |

✅ **Parity:** App renders identical static markup when no JS executes.

---

## Phase 2 – Layout & Routing *(1–2 days)*
|Step|Route|Behaviour|Done|
|----|-----|---------|----|
|2.1|`app/layout.tsx`|Global styles + `<Header/>` + `<Sidebar/>` + `<main>`| |
|2.2|`app/page.tsx`|Home: the current landing/search UI| |
|2.3|`app/etudes/page.tsx`|Grid / list of etudes (presently inline)| |
|2.4|`app/etude/[id]/page.tsx`|Individual sheet-music viewer modal (SSR later)| |

Dependencies: 1.1–1.4.

---

## Phase 3 – Component Extraction *(3 days)*
Break the 2 000-line `main.js` into declarative React components.  Aim for minimal refactor first (wrap imperative logic in `useEffect`), then clean up.

|Component|Files To Create|Special Notes|
|---------|---------------|-------------|
|`Header`|`components/Header.tsx`|Search bar logic → controlled input + debounce.| 
|`Sidebar`|`components/sidebar/…`|Hover preview + selection toggles. Display technique/composer **selection counts**. Use `onMouseEnter/Leave` & Zustand state (`hoveredFilter`, `selectedTechniques`, `selectedComposers`) to replicate persistentSelection logic.| 
|`TechniqueTag`|`components/TechniqueTag.tsx`|Clickable chip; style matches CSS.| 
|`ComposerFilter`|`components/ComposerFilter.tsx`|Handles `toggleComposerSelection`.| 
|`SheetGrid`|`components/SheetGrid.tsx`|Maps etude data → `SheetCard`.| 
|`SheetCard`|`components/SheetCard.tsx`|`viewSheetMusic` handler opens viewer.| 
|`PdfViewer`|`components/PdfViewer.tsx`|Build with **React-PDF** (see Suppl. Note 2 for dynamic import & CSS); dynamic import (SSR off), set `pdfjs` workerSrc; retain zoom, **page navigation (keyboard/UI)**, and other existing controls.| 
|`Chat`|`components/chat/Chat.tsx`|Move `chat.js` behaviour; store messages in context/Zustand. Implement **auto-resizing textarea** and existing open/minimize/clear history functionality.| 

✅ **Parity:**
- Left sidebar hover, collapse, multi-select keep identical UX.
- **Technique/Composer selection counters in sidebar update correctly.**
- Search bar filters list in real-time.
- Clicking a sheet opens PDF viewer overlay (retaining zoom, page navigation etc.).
- Chat sends/receives stub messages (still mock until Phase 6).
- Chat box opens, minimises, clears history exactly as current JS demo.
- **Chat textarea auto-resizes based on content.**
- No regression on mobile layout breakpoints.

---

## Phase 4 – Global State & Utilities *(1 day)*
|Task|Library|Details|
|----|-------|-------|
|Set up store|`zustand` or React Context|Holds: `selectedTechniques`, `selectedComposers`, `searchQuery`, `isViewingSheet`, etc.| 
|Persist UI state|`localStorage` via `middleware`|Remember last opened sheet, sidebar collapsed state.| 
|Utilities|`lib/utils.ts`|Port `_getRandomSubset`, debounce helper, etc.| 

All components subscribe to store; remove scattered DOM queries.

---

## Phase 5 – Data Layer (JSON → DB) *(variable – 1-2 weeks later)*
Minimal port keeps current hard-coded JSON under `/data/etudes.json`.  Later replace with Postgres + Prisma.

Steps:
1. Prisma schema for `Etude`, `Technique`, `Composer`, `User`.
2. Seed script converting existing JSON.
3. API routes (`/api/etudes`, `/api/search`).
4. Swap client fetch hooks to hit API.

---

## Phase 6 – External Integrations *(parallel)*
|Feature|Package|Key Steps|
|-------|-------|---------|
|Auth|`next-auth`|Credentials + social login; protect `/dashboard`.| 
|Payments|`@stripe/stripe-js`, `stripe`|`/api/checkout` to create session; webhook route to update `UserSubscription`.| 
|LLM Search|OpenAI/Replicate API|Server route calls LLM, streams chunks via SSE or websockets to Chat component.| 

---

## Phase 7 – Testing & QA *(ongoing)*
• Jest + React Testing Library for components.  
• Cypress Playwright for e2e: left-sidebar interactions, PDF viewer load, checkout flow.  
• Lighthouse / WebVitals budget.

---

## Phase 8 – Deployment
1. Configure Vercel project → auto-deploy `main` (Preview) & `prod` branches.  
2. Set env vars (`DATABASE_URL`, `OPENAI_KEY`, `STRIPE_SECRET_KEY`).  
3. Use Vercel Postgres / Neon or Supabase for managed DB.  
4. Set up staging DB + stripe test keys for Preview.

---

## Phase 9 – Gradual Cleanup / Enhancements
- Replace global CSS with Tailwind or CSS-modules incrementally.  
- Delete dead legacy JS once ported.  
- Migrate to React Server Components for heavy compute pages.  
- Add PWA service-worker for offline sheet access.

---

### Acceptance Checklist (must-have parity)
- [ ] Sidebar hover-preview & multi-select behave exactly as today.  
- [ ] Search bar filters etudes in <50 ms with same debounce.  
- [ ] Technique & composer counters update correctly.  
- [ ] Sheet PDF renders with same zoom & scroll handling.  
- [ ] Chat box opens, minimises, clears history exactly as current JS demo.  
- [ ] No regression on mobile layout breakpoints.

---

> **Tip:** keep the old app live at `/legacy` during migration for quick side-by-side comparison.

---

## Supplemental Implementation Notes (merged insights)

1. **Project Bootstrap Flags**  
   Use `pnpm create next-app@latest arco-next -- --ts --tailwind --eslint --app --src-dir --import-alias "@/*"` for a more opinionated, space-efficient setup.

2. **Dynamic React-PDF Import & Worker Setup**  
   ```ts
   'use client';
   import dynamic from 'next/dynamic';
   import { pdfjs } from 'react-pdf';
   import 'react-pdf/dist/Page/AnnotationLayer.css'; // Verify path based on actual import structure
   import 'react-pdf/dist/Page/TextLayer.css';     // Verify path based on actual import structure

   pdfjs.GlobalWorkerOptions.workerSrc = new URL(
     'pdfjs-dist/build/pdf.worker.min.mjs',
     import.meta.url,
   ).toString();

   const PdfViewer = dynamic(() => import('@/components/PdfViewer'), { ssr: false });
   ```

3. **Zustand Store Shape & Derived Selector**  
   ```ts
   interface AppState {
     selectedTechniques: string[];
     selectedComposers: string[];
     hoveredFilter: string | null;
     searchQuery: string;
     activeSheet: number | null;
     isViewingSheet: boolean;
     chatHistory: ChatMessage[];
   }
   // derived logic replicating hover-preview vs selection
   const visibleFilters = state.hoveredFilter ? [state.hoveredFilter] : state.selectedTechniques;
   ```
   Include *max-three* validation inside `toggleTechnique`.

4. **API Abstraction Layer**  
   Create `src/lib/api.ts` early. Components call functions like `getEtudes(filters)` even while they still read static JSON. Swap to real DB/API later with zero component changes.

5. **Tailwind ESLint Plugin & Codemods**  
   Add `eslint-plugin-tailwindcss` and run Next.js codemods to keep the codebase idiomatic.

6. **Risk & QA per Phase**  
   Record a short risk note in each phase table and a green-light *Done* column to check off.

These additions have been integrated into this document to provide a bullet-proof migration path.

