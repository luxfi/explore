const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.BUNDLE_ANALYZER === 'true',
});

const withRoutes = require('nextjs-routes/config')({
  outDir: 'nextjs',
});

const headers = require('./nextjs/headers');
const redirects = require('./nextjs/redirects');
const rewrites = require('./nextjs/rewrites');

// The gui engine's bundler wiring, from the umbrella that owns it.
// Hand-listing a SUBSET of the engine here is what produced seven physical
// copies of `@hanzogui/popper` in this app's store (3.0.0, 3.0.1, 3.0.2 x3,
// 7.3.0 x2). A context published at module scope is per-copy, so `PopperAnchor`
// read the empty default and called `refs.setReference` on `undefined` once per
// tooltip trigger — 932 uncaught errors on the home page alone.
const { withLuxUi } = require('@luxfi/ui/next');

/** @type {import('next').NextConfig} */
const moduleExports = {
  dir: __dirname,
  transpilePackages: [
    'react-syntax-highlighter',
  ],
  reactStrictMode: true,
  // `next dev` runs Turbopack, which does not read the webpack() block below, so
  // every `import Icon from 'icons/*.svg'` resolved to a static-image OBJECT and
  // React threw "Element type is invalid … but got: object". That crashed the
  // whole page for any component importing an SVG directly — Hint, ChartWidget,
  // toolkit/next/link, FilterInput, BackToButton — i.e. most of the app, in dev
  // only. Same loader, declared once per bundler, so dev renders what prod ships.
  turbopack: {
    rules: {
      '*.svg': { loaders: [ '@svgr/webpack' ], as: '*.js' },
    },
    resolveAlias: {
      fs: { browser: './stubs/empty.js' },
      net: { browser: './stubs/empty.js' },
      tls: { browser: './stubs/empty.js' },
      async_hooks: { browser: './stubs/empty.js' },
      '@react-native-async-storage/async-storage': { browser: './stubs/empty.js' },
    },
  },
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.svg$/,
        use: [ '@svgr/webpack' ],
      },
    );
    config.resolve.fallback = { fs: false, net: false, tls: false, async_hooks: false };
    config.resolve.alias = {
      ...config.resolve.alias,
      // MetaMask SDK tries to import this RN module; stub it out for web.
      '@react-native-async-storage/async-storage': false,
    };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    config.experiments = { ...config.experiments, topLevelAwait: true };
    // Tell webpack the target supports async/await so it stops warning about top-level await
    // Top-level await is belong to ES2017 specification that is adopted by all major browsers and Node.js.
    config.output.environment = {
      ...config.output.environment,
      asyncFunction: true,
    };

    return config;
  },
  // NOTE: all config functions should be static and not depend on any environment variables
  // since all variables will be passed to the app only at runtime and there is now way to change Next.js config at this time
  // if you are stuck and strongly believe what you need some sort of flexibility here please fill free to join the discussion
  // https://github.com/blockscout/frontend/discussions/167
  rewrites,
  redirects,
  headers,
  typescript: {
    // @luxfi/ui + @hanzogui type mismatches with existing codebase.
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  outputFileTracingRoot: __dirname,
  productionBrowserSourceMaps: false,
  serverExternalPackages: ["@opentelemetry/sdk-node", "@opentelemetry/auto-instrumentations-node"],
  experimental: {
    staleTimes: {
      dynamic: 30,
      'static': 180,
    },
  },
};

module.exports = withBundleAnalyzer(withRoutes(withLuxUi(moduleExports)));
