# Chakra UI v3 → @hanzo/ui Migration Strategy

## Scale

| Category | Count |
|----------|-------|
| Files importing `@chakra-ui/react` directly | ~870 |
| Files consuming `toolkit/chakra/` wrappers | ~822 |
| Chakra wrapper files in `toolkit/chakra/` | 38 |
| Style-as-props usages (`w=`, `h=`, `bg=`, `p=`, etc.) | ~4,600 |
| Direct `Box`/`Flex`/`Text` usages (not via toolkit) | ~911 |
| `chakra.element` factory usages | ~470 (140 files) |

**Key insight:** 94% of component usage flows through `toolkit/chakra/` wrappers. Swapping wrapper internals is transparent to consumers.

## Fundamental Challenge

Chakra v3 = runtime CSS-in-JS + style-as-props
`@hanzo/ui` v5 = Tailwind + CVA + Radix primitives

These are **not** drop-in compatible. The ~4,600 style-as-props usages (`<Box p={4} bg="gray.100">`) have no direct `@hanzo/ui` equivalent.

## Recommended Strategy: Shim Approach

Create lightweight shim components (`Box`, `Flex`, `Text`) that accept Chakra-style props but render plain HTML with inline styles. This eliminates the Chakra/Emotion runtime (~45kB gzipped) without requiring a full Tailwind conversion.

## Phase Plan

### Phase 1 — Add @hanzo/ui (2–3 days)
- Install `@hanzo/ui` alongside Chakra
- Verify no peer-dependency conflicts
- Use `@hanzo/ui` for **new** components only
- No breaking changes; both libraries coexist

### Phase 2 — Swap toolkit/chakra/ internals (5–7 days)
- For each of the 38 wrapper files in `toolkit/chakra/`:
  - Identify the `@hanzo/ui` equivalent (Button, Dialog, Table, etc.)
  - Swap the internal implementation
  - Keep the exported API identical (prop names, behavior)
- Consumers see zero changes
- **Testing:** existing Playwright/Vitest suite must pass after each file

### Phase 3 — Primitive shims (3–5 days)
Create `toolkit/shims/`:
```tsx
// Box.tsx — accepts Chakra props, renders div with inline styles
// Flex.tsx — Box with display:flex
// Text.tsx — renders span/p with mapped typography props
// Grid.tsx, Stack.tsx, etc.
```
- Replace direct `@chakra-ui/react` imports of primitives with shims
- Style-as-props mapped to inline CSS via prop → CSS property table
- Run `grep -r "from '@chakra-ui/react'" --include="*.tsx"` to track progress

### Phase 4 — Complex components (10–14 days)
Migrate in order of usage frequency:
1. Modal → `@hanzo/ui` Dialog
2. Tabs → `@hanzo/ui` Tabs
3. Table → `@hanzo/ui` Table
4. Tooltip → `@hanzo/ui` Tooltip
5. Input/Form — already wrapped in `toolkit/chakra/input.tsx`
6. Menu → `@hanzo/ui` DropdownMenu (Radix-based)

### Phase 5 — Remove Chakra (2–3 days)
- Remove `@chakra-ui/react`, `@emotion/react`, `@emotion/styled` from `package.json`
- Remove `ChakraProvider` from `pages/_app.tsx`
- Clean up any remaining `chakra.*` factory calls
- Verify build passes with `pnpm build`

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Color mode flicker after removing ChakraProvider | Already using `next-themes` — color mode survives |
| Style-as-props with complex Chakra tokens (`colorScheme`, `size`) | Map tokens in shim layer |
| SSR hydration mismatches | Inline styles are SSR-safe; no CSS-in-JS hydration |
| Breaking Playwright tests | Run full suite after each phase before merging |
| Third-party components using Chakra internally | Use `@chakra-ui/react` as a peer for those; don't remove globally until all are replaced |

## Estimated Effort

| Phase | Effort |
|-------|--------|
| Phase 1: Add @hanzo/ui | 2–3 days |
| Phase 2: toolkit/chakra/ internals | 5–7 days |
| Phase 3: Primitive shims | 3–5 days |
| Phase 4: Complex components | 10–14 days |
| Phase 5: Remove Chakra | 2–3 days |
| **Total** | **22–32 days** |

## Implementation Notes

- The `toolkit/theme/foundations/semanticTokens.ts` token system maps 1:1 to CSS custom properties — these survive unchanged as they're already framework-agnostic
- `next-themes` is used for dark/light mode (not Chakra's built-in) — no migration needed here
- `toolkit/chakra/` is the single choke point; migrating it in Phase 2 buys the most leverage with least risk
- Start with the most-used wrappers: `Button`, `Box`, `Text`, `Flex`, `Input`, `Modal`

## Decision: Start Date

Phase 1 can begin immediately. Recommended: start after current sprint's feature work is stable in production.
