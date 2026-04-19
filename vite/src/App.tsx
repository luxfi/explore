import { Route, Switch, Redirect, useLocation } from 'wouter';

import { apiBaseUrl } from './env';
import { matchRedirect, redirects } from './redirects';

// WIP landing page for the Vite SPA scaffold.
// The Next.js app at ../pages/*.tsx remains the production surface. Once
// components are decoupled from next/router + nextjs-routes, individual
// routes below will replace their Next equivalents one at a time.

function Home() {
  return (
    <main style={{ maxWidth: 720, margin: '80px auto', padding: 24, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 32, fontWeight: 600 }}>Lux Explorer — Vite SPA (WIP)</h1>
      <p style={{ marginTop: 16, color: '#666' }}>
        This is the Vite 8 + React 19 scaffold that will replace the Next.js app
        under <code>../pages</code>. See <code>vite/LLM.md</code> for the migration plan.
      </p>
      <dl style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 8 }}>
        <dt style={{ fontWeight: 600 }}>API base:</dt>
        <dd><code>{ apiBaseUrl() || '(not configured)' }</code></dd>
        <dt style={{ fontWeight: 600 }}>Redirects loaded:</dt>
        <dd>{ redirects.length }</dd>
      </dl>
    </main>
  );
}

function NotFound() {
  const [ path ] = useLocation();
  return (
    <main style={{ maxWidth: 720, margin: '80px auto', padding: 24, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 48, fontWeight: 700 }}>404</h1>
      <p style={{ marginTop: 16, color: '#666' }}>
        Not found: <code>{ path }</code>
      </p>
    </main>
  );
}

function CatchAll() {
  const [ path ] = useLocation();
  const dest = matchRedirect(path);
  if (dest) return <Redirect to={ dest } replace/>;
  return <NotFound/>;
}

export function App() {
  return (
    <Switch>
      <Route path="/" component={ Home }/>
      { /* Every unmatched path is tested against the redirect table. */ }
      <Route component={ CatchAll }/>
    </Switch>
  );
}
