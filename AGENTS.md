# Project Hub Development Rules

## Technology
- Use Nuxt 3, Vue 3 and TypeScript.
- Use Composition API and `<script setup lang="ts">`.
- Use Tailwind CSS for layout and visual styling.
- Use Pinia only for shared application state.
- Use Nuxt server routes for backend APIs.

## UI
- The main visual reference is `docs/reference/project-dashboard.png`.
- The page has no left sidebar.
- Desktop design is the priority.
- Use a white, light-blue, premium interface.
- Keep spacing, shadows, borders and typography consistent.
- All visible UI text must be Simplified Chinese.
- Do not use a generic enterprise admin template.
- Avoid excessive gradients and animations.

## Code quality
- Do not use `any` unless unavoidable.
- Split large components into smaller components.
- Reusable UI logic must go into composables.
- Components should normally stay below 250 lines.
- Add loading, empty and error states.
- Never expose passwords, tokens or SSH keys in frontend code.

## Validation
Before declaring a task complete:
- Run lint.
- Run TypeScript type checking.
- Run relevant tests.
- Check browser console errors.
- Test at 1440px, 1680px and 1920px widths.
- Review the final diff.
