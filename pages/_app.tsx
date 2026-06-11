import { createGui, GuiProvider } from '@hanzogui/core';
import { Toaster } from '@luxfi/ui/toaster';
import { QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import React from 'react';

// Initialize @hanzogui once at module scope. Runs on both server and client.
//
// Three things have to line up before any @hanzogui-derived @luxfi/ui
// component renders, or we get cascading throws:
//
//   1. createGui must run before getConfig() is called (used inside
//      every styled() component's render path). We give it a non-empty
//      themes object so getThemesDeduped doesn't trip Object.keys
//      (undefined) — the original hydration crash.
//   2. tokens.color must hold default color tokens, otherwise
//      getThemesDeduped's `tokens.color` spread produces an empty
//      theme value, and downstream getThemedChildren has no theme
//      colors to inject.
//   3. The render tree must be wrapped in <GuiProvider config>. Without
//      it, useThemeState reads ThemeStateContext (default "") and
//      throws "Missing theme." in production. createGui alone is not
//      enough — it sets the config, but the theme-state Provider
//      tree has to exist as well.
//
// We materialize the config once, on both server and client (no `typeof
// window` gate). createGui is idempotent via getConfigMaybe() — if a
// downstream package somehow calls it again, the existing config is
// merged forward.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const guiConfig: any = createGui({
  themes: {
    light: { background: '#ffffff', color: '#000000' },
    dark: { background: '#000000', color: '#ffffff' },
  },
  tokens: {
    color: { background: '#ffffff', text: '#000000' },
    space: { '0': 0, '1': 4, '2': 8, '3': 12, '4': 16, 'true': 16 },
    size: { '0': 0, '1': 4, '2': 8, '3': 12, '4': 16, 'true': 16 },
    radius: { '0': 0, '1': 4, '2': 8, 'true': 4 },
    zIndex: { '0': 0, '1': 100, '2': 200, 'true': 100 },
  },
  settings: { autocompleteSpecificTokens: 'except-special' },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

import type { NextPageWithLayout } from 'nextjs/types';

import type { Route } from 'nextjs-routes';
import PageMetadata from 'nextjs/PageMetadata';

import config from 'configs/app';
import getSocketUrl from 'lib/api/getSocketUrl';
import useQueryClientConfig from 'lib/api/useQueryClientConfig';
import { AppContextProvider } from 'lib/contexts/app';
import { FallbackProvider } from 'lib/contexts/fallback';
import { MarketplaceContextProvider } from 'lib/contexts/marketplace';
import { SettingsContextProvider } from 'lib/contexts/settings';
import useChainFavicon from 'lib/hooks/useChainFavicon';
import { clientConfig as rollbarConfig, Provider as RollbarProvider } from 'lib/rollbar';
import { SocketProvider } from 'lib/socket/context';
import { Provider as ThemeProvider } from 'toolkit/next/provider';
import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import AppErrorGlobalContainer from 'ui/shared/AppError/AppErrorGlobalContainer';
import GoogleAnalytics from 'ui/shared/GoogleAnalytics';
import Layout from 'ui/shared/layout/Layout';
import Web3Provider from 'ui/shared/web3/Web3Provider';

const RewardsContextProvider = dynamic(() => import('lib/contexts/rewards').then(module => module.RewardsContextProvider), { ssr: false });
const RewardsLoginModal = dynamic(() => import('ui/rewards/login/RewardsLoginModal'), { ssr: false });
const RewardsActivityTracker = dynamic(() => import('ui/rewards/RewardsActivityTracker'), { ssr: false });

import 'lib/setLocale';
// import 'focus-visible/dist/focus-visible';
import 'nextjs/global.css';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const ERROR_SCREEN_STYLES = {
  className: 'h-screen flex flex-col items-start justify-center w-fit max-w-[800px] mx-auto p-4 lg:p-0',
};

const CONSOLE_SCAM_WARNING = `\u26A0\uFE0FWARNING: Do not paste or execute any scripts here!
Anyone asking you to run code here might be trying to scam you and steal your data.
If you don't understand what this console is for, close it now and stay safe.`;

const CONSOLE_SCAM_WARNING_DELAY_MS = 500;

// Outer error boundary that catches crashes from providers or @hanzogui init.
// Uses zero external UI libraries so it always renders.

function handleReload() {
  window.location.reload();
}

// eslint-disable-next-line react/require-optimization
class OuterErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.error('[OuterErrorBoundary]', error);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          maxWidth: 600,
          margin: '80px auto',
          padding: 24,
          fontFamily: 'Geist, system-ui, sans-serif',
        }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>
            Something went wrong
          </h1>
          <p style={{ color: '#666', marginBottom: 16 }}>
            An unexpected error occurred while loading the explorer.
          </p>
          <pre style={{
            background: '#f5f5f5',
            padding: 12,
            borderRadius: 4,
            fontSize: 13,
            overflow: 'auto',
            maxHeight: 200,
          }}>
            { this.state.error.message }
          </pre>
          <button
            onClick={ handleReload }
            style={{
              marginTop: 16,
              padding: '8px 16px',
              border: '1px solid #ccc',
              borderRadius: 4,
              cursor: 'pointer',
              background: '#fff',
            }}
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function MyApp({ Component, pageProps, router }: AppPropsWithLayout) {

  useChainFavicon();

  const queryClient = useQueryClientConfig();

  React.useEffect(() => {
    // after the app is rendered/hydrated, show the console scam warning
    const timeoutId = window.setTimeout(() => {
      // eslint-disable-next-line no-console
      console.warn(CONSOLE_SCAM_WARNING);
    }, CONSOLE_SCAM_WARNING_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const content = (() => {
    const getLayout = Component.getLayout ?? ((page) => <Layout>{ page }</Layout>);

    return (
      <>
        { getLayout(<Component { ...pageProps }/>) }
        <Toaster/>
        { config.features.rewards.isEnabled && (
          <>
            <RewardsLoginModal/>
            <RewardsActivityTracker/>
          </>
        ) }
      </>
    );
  })();

  const RewardsProvider = config.features.rewards.isEnabled ? RewardsContextProvider : FallbackProvider;

  const socketUrl = !config.features.multichain.isEnabled ? getSocketUrl() : undefined;

  return (
    <OuterErrorBoundary>
      <GuiProvider config={ guiConfig }>
        <PageMetadata pathname={ router.pathname as Route['pathname'] } query={ pageProps.query } apiData={ pageProps.apiData }/>
        <ThemeProvider>
          <RollbarProvider config={ rollbarConfig }>
            <AppErrorBoundary
              { ...ERROR_SCREEN_STYLES }
              Container={ AppErrorGlobalContainer }
            >
              <QueryClientProvider client={ queryClient }>
                <Web3Provider>
                  <AppContextProvider pageProps={ pageProps }>
                    <SocketProvider url={ socketUrl }>
                      <RewardsProvider>
                        <MarketplaceContextProvider>
                          <SettingsContextProvider>
                            { content }
                          </SettingsContextProvider>
                        </MarketplaceContextProvider>
                      </RewardsProvider>
                    </SocketProvider>
                    <GoogleAnalytics/>
                  </AppContextProvider>
                </Web3Provider>
              </QueryClientProvider>
            </AppErrorBoundary>
          </RollbarProvider>
        </ThemeProvider>
      </GuiProvider>
    </OuterErrorBoundary>
  );
}

export default MyApp;
