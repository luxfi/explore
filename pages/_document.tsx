import { bootScript } from '@hanzo/appearance/state';
import type { DocumentContext } from 'next/document';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

import logRequestFromBot from 'nextjs/utils/logRequestFromBot';
import * as serverTiming from 'nextjs/utils/serverTiming';

import config from 'configs/app';
import { getCurrentChain } from 'configs/app/chainRegistry';
import { parseHostHeader, withRequestHost } from 'lib/requestHost';
import * as svgSprite from 'ui/shared/IconSvg';

const marketplaceFeature = config.features.marketplace;

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    // Capture the request's Host header once and bind it to an
    // AsyncLocalStorage scope. Every `getCurrentChain()` / `getHostname()`
    // call reachable from this request now sees the correct host, which
    // is what makes the same Docker image serve any subdomain without a
    // rebuild. See lib/requestHost.ts.
    const host = parseHostHeader(ctx.req?.headers?.host as string | undefined);

    return await withRequestHost(host, async() => {
      const originalRenderPage = ctx.renderPage;
      ctx.renderPage = async() => {
        const start = Date.now();
        const result = await originalRenderPage();
        const end = Date.now();

        serverTiming.appendValue(ctx.res, 'renderPage', end - start);

        return result;
      };

      await logRequestFromBot(ctx.req, ctx.res, ctx.pathname);

      const initialProps = await Document.getInitialProps(ctx);
      return initialProps;
    });
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          { /*
            * The reader's own settings, before the first paint.
            *
            * Type scale, ratio, density, face and measure are stored on the
            * device and land as inline custom properties on <html>, which is
            * :root — so they outrank the token sheet without needing a
            * selector to out-specify it. Every ramp in @hanzo/design already
            * multiplies by them, so five properties retune the whole page.
            *
            * It runs here, synchronously, because anything later paints the
            * published defaults first and then jumps, and a jump on every load
            * reads as a bug rather than as a setting. The panel re-applies on
            * mount (useAppearance in toolkit/next/provider), where an accent
            * colour can be validated — which a head script this small will not
            * do.
            */ }
          <script dangerouslySetInnerHTML={{ __html: bootScript() }}/>

          { /* FONTS */ }
          <link
            href={ config.UI.fonts.heading?.url ?? '' }
            rel="stylesheet"
          />
          <link
            href={ config.UI.fonts.body?.url ?? '' }
            rel="stylesheet"
          />
          <link
            href=""
            rel="stylesheet"
          />

          { /* eslint-disable-next-line @next/next/no-sync-scripts */ }
          <script src="/assets/envs.js"/>
          { config.features.multichain.isEnabled && (
            <>
              { /* eslint-disable-next-line @next/next/no-sync-scripts */ }
              <script src="/assets/multichain/config.js"/>
            </>
          ) }
          { marketplaceFeature.isEnabled && marketplaceFeature.essentialDapps && (
            <>
              { /* eslint-disable-next-line @next/next/no-sync-scripts */ }
              <script src="/assets/essential-dapps/chains.js"/>
            </>
          ) }

          { /* FAVICON — dynamic per-chain SVG, static PNG fallbacks */ }
          <link
            rel="icon"
            type="image/svg+xml"
            href={ `data:image/svg+xml,${ encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${ getCurrentChain().branding.faviconContent }</svg>`,
            ) }` }
          />
          <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon-32x32.png"/>
          <link rel="shortcut icon" href="/assets/favicon/favicon.ico"/>
          <link rel="preload" as="image" href={ svgSprite.href }/>
        </Head>
        <body>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
