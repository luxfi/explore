# *****************************
# *** STAGE 1: Dependencies ***
# *****************************
FROM node:22.14.0-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++ git && \
    ln -sf /usr/bin/python3 /usr/bin/python && \
    corepack enable && corepack prepare pnpm@10.11.0 --activate && \
    echo "shamefully-hoist=true" > /root/.npmrc && \
    echo "strict-peer-dependencies=false" >> /root/.npmrc && \
    echo "auto-install-peers=true" >> /root/.npmrc && \
    echo "registry=https://registry.yarnpkg.com/" >> /root/.npmrc && \
    echo "fetch-retries=5" >> /root/.npmrc

### APP
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./
COPY stubs ./stubs
COPY tsconfig.json ./
COPY types ./types
COPY lib ./lib
COPY configs/app ./configs/app
COPY toolkit/theme ./toolkit/theme
COPY toolkit/utils ./toolkit/utils
COPY toolkit/components/forms/validators/url.ts ./toolkit/components/forms/validators/url.ts
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

### TOOLS (all in one layer)
COPY ./deploy/tools/feature-reporter/package.json /feature-reporter/package.json
COPY ./deploy/tools/envs-validator/package.json /envs-validator/package.json
COPY ./deploy/tools/favicon-generator/package.json /favicon-generator/package.json
COPY ./deploy/tools/sitemap-generator/package.json /sitemap-generator/package.json
COPY ./deploy/tools/multichain-config-generator/package.json /multichain-config-generator/package.json
COPY ./deploy/tools/essential-dapps-chains-config-generator/package.json /essential-dapps-chains-config-generator/package.json
COPY ./deploy/tools/llms-txt-generator/package.json /llms-txt-generator/package.json
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    cd /feature-reporter && pnpm install --no-lockfile && \
    cd /envs-validator && pnpm install --no-lockfile && \
    cd /favicon-generator && pnpm install --no-lockfile && \
    cd /sitemap-generator && pnpm install --no-lockfile && \
    cd /multichain-config-generator && pnpm install --no-lockfile && \
    cd /essential-dapps-chains-config-generator && pnpm install --no-lockfile && \
    cd /llms-txt-generator && pnpm install --no-lockfile


# *****************************
# ****** STAGE 2: Build *******
# *****************************
FROM node:22.14.0-alpine AS builder
RUN apk add --no-cache --upgrade libc6-compat bash jq && \
    corepack enable && corepack prepare pnpm@10.11.0 --activate

ARG GIT_COMMIT_SHA
ENV NEXT_PUBLIC_GIT_COMMIT_SHA=$GIT_COMMIT_SHA
ARG GIT_TAG
ENV NEXT_PUBLIC_GIT_TAG=$GIT_TAG
ARG NEXT_OPEN_TELEMETRY_ENABLED
ENV NEXT_OPEN_TELEMETRY_ENABLED=$NEXT_OPEN_TELEMETRY_ENABLED
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=8192"

### APP
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build SVG sprite + collect envs + build Next.js (with persistent .next/cache)
RUN set -a && \
    source ./deploy/scripts/build_sprite.sh && \
    ./deploy/scripts/collect_envs.sh ./docs/ENVS.md && \
    set +a
RUN --mount=type=cache,id=nextjs-cache,target=/app/.next/cache \
    pnpm build

### TOOLS (build all in fewer layers)
COPY --from=deps /feature-reporter/node_modules ./deploy/tools/feature-reporter/node_modules
COPY --from=deps /envs-validator/node_modules ./deploy/tools/envs-validator/node_modules
COPY --from=deps /favicon-generator/node_modules ./deploy/tools/favicon-generator/node_modules
COPY --from=deps /sitemap-generator/node_modules ./deploy/tools/sitemap-generator/node_modules
COPY --from=deps /multichain-config-generator/node_modules ./deploy/tools/multichain-config-generator/node_modules
COPY --from=deps /essential-dapps-chains-config-generator/node_modules ./deploy/tools/essential-dapps-chains-config-generator/node_modules
COPY --from=deps /llms-txt-generator/node_modules ./deploy/tools/llms-txt-generator/node_modules
RUN cd ./deploy/tools/feature-reporter && pnpm compile_config && pnpm build && \
    cd /app/deploy/tools/envs-validator && pnpm build && \
    cd /app/deploy/tools/multichain-config-generator && pnpm build && \
    cd /app/deploy/tools/essential-dapps-chains-config-generator && pnpm build && \
    cd /app/deploy/tools/llms-txt-generator && pnpm build


# *****************************
# ******* STAGE 3: Run ********
# *****************************
FROM node:22.14.0-alpine AS runner
RUN apk add --no-cache --upgrade bash curl jq unzip && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app
RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy tools
COPY --from=builder /app/deploy/tools/envs-validator/dist/index.js ./envs-validator/index.js
COPY --from=builder /app/deploy/tools/feature-reporter/index.js ./feature-reporter.js
COPY --from=builder /app/deploy/tools/multichain-config-generator/dist ./deploy/tools/multichain-config-generator/dist
COPY --from=builder /app/deploy/tools/llms-txt-generator/dist ./deploy/tools/llms-txt-generator/dist
COPY --from=builder /app/deploy/tools/essential-dapps-chains-config-generator/dist ./deploy/tools/essential-dapps-chains-config-generator/dist

# Copy scripts
## Entrypoint
COPY --chmod=755 ./deploy/scripts/entrypoint.sh .
## ENV validator and client script maker
COPY --chmod=755 ./deploy/scripts/validate_envs.sh .
COPY --chmod=755 ./deploy/scripts/make_envs_script.sh .
## Assets downloader
COPY --chmod=755 ./deploy/scripts/download_assets.sh .
## OG image generator
COPY ./deploy/scripts/og_image_generator.js .
## Favicon generator
COPY --chmod=755 ./deploy/scripts/favicon_generator.sh .
COPY --from=builder /app/deploy/tools/favicon-generator ./deploy/tools/favicon-generator
RUN ["chmod", "-R", "777", "./deploy/tools/favicon-generator"]
RUN ["chmod", "-R", "777", "./public"]
## Sitemap generator
COPY --chmod=755 ./deploy/scripts/sitemap_generator.sh .
COPY --from=builder /app/deploy/tools/sitemap-generator ./deploy/tools/sitemap-generator

# Copy ENVs files
COPY --from=builder /app/.env.registry .
COPY --from=builder /app/.env .

# Copy ENVs presets
ARG ENVS_PRESET
ENV ENVS_PRESET=$ENVS_PRESET
COPY ./configs/envs ./configs/envs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

ENTRYPOINT ["./entrypoint.sh"]

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
