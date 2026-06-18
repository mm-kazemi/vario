# AGENTS.md

## Prime Directive

Vario is an enterprise-grade e-commerce web application built on **Next.js (App Router)**. Code generation and human contributions must prioritize scalability, maintainability, predictability, and performance in a production environment.

When altering component logic, state management, API integrations, or folder structures, optimize for:

- Strict Separation of Concerns (SoC).
- Clear boundaries between "Smart" (Container) and "Dumb" (Presentational) components.
- 100% Type Safety using TypeScript in Strict Mode.
- Optimal utilization of Server-Side Rendering (SSR) and Client-Side Rendering (CSR).
- Educational, context-rich inline documentation ("Mentor Notes") explaining the "WHY" behind architectural decisions.

**Do not** generate heavy abstractions, over-engineer generic service frameworks, or introduce third-party UI libraries without explicit approval.

## Agent Operating Mode

### Before Editing

- Inspect existing files and local patterns using `rg` / `rg --files` (especially `src/features` and `src/store`).
- Identify the smallest, safest change set required to achieve the goal.
- Prefer editing and refactoring existing files over creating new ones unless the Feature-based architecture explicitly demands a new module.
- Do not invent APIs, arbitrary folder paths, or new global types without first inspecting the `src/types/` directory.

### While Editing

- Make highly focused, modular changes.
- Strictly respect Next.js `"use client"` boundaries. Do not casually bleed client directives into server components.
- Avoid broad rewrites unless explicitly requested by the user.
- Do not add new `npm` dependencies without explicit authorization.

### After Editing, Report

- Files changed.
- Files created.
- Architectural patterns applied (with justification).
- Any follow-up actions required.
  Keep reports concise, practical, and devoid of unnecessary fluff.

## Current Project Identity

**Vario** is a fast, scalable, and minimal e-commerce platform.
The product should feel:

- Minimalist and clean (pure Tailwind CSS, no bloated UI kits).
- Engineered for enterprise scale (predictable state, robust error handling).
- Educational (structured for reverse-engineering and learning).

**V1 Rules:**

- Server State **MUST** be managed exclusively by `TanStack Query v5`.
- Global Client State (e.g., Shopping Cart, Modals) **MUST** be managed exclusively by `Redux Toolkit (RTK)`.
- Filter, search, and pagination states **MUST** be synced directly with Next.js URL Query Parameters. Do not store these in Redux or local state.

## Current Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS (No MUI, Radix, or external component libraries)
- **Server State:** TanStack Query v5 (React Query)
- **Client State:** Redux Toolkit (RTK)
- **Data Fetching:** Native `fetch` API (wrapped in a custom robust fetcher)
- **API Source:** `https://dummyjson.com/`

## Main Folder Model

The project utilizes a hybrid **Feature-based** and **Layered** architecture:

```text
src/
├── app/                        # Next.js App Router (Routes, Layouts, Pages)
│   ├── (main)/                 # Route Group for standard layouts
│   └── layout.tsx & page.tsx
├── components/
│   ├── common/                 # Stateless, pure UI components (Button, Input)
│   └── layout/                 # Structural UI (Header, Footer, Sidebar)
├── features/                   # Smart, domain-specific modules
│   ├── products/               # ProductList, ProductCard, ProductFilters
│   └── cart/                   # Cart UI and interactions
├── hooks/                      # Custom React hooks (e.g., useURLFilters)
├── lib/                        # Utilities and Wrappers (e.g., fetcher.ts)
├── providers/                  # Client-side Context Providers (Redux, TanStack)
├── services/
│   ├── api/                    # Raw Fetch/Axios functions
│   └── queries/                # Custom TanStack Query hooks
├── store/                      # Redux Store configuration and slices
│   └── slices/
└── types/                      # Global TypeScript interfaces (product.types.ts)
```
