# WIP Vite 8 SPA build — see vite/LLM.md for migration plan.
# The production image (../Dockerfile) still builds the Next.js app; this
# Dockerfile will replace it once the SPA rewrite is complete.

FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /app

# Copy the whole repo because the vite/ project aliases resolve into
# ../configs, ../lib, ../ui, etc. (see vite.config.ts). Once migration
# finalizes these paths will live inside vite/src and the context can shrink.
COPY . .

WORKDIR /app/vite
RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm build

FROM ghcr.io/hanzoai/spa
COPY --from=build /app/vite/dist /public
