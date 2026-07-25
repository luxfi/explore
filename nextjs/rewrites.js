// Public API surface: /v1/* and nothing else.
//
// Next.js Pages Router only serves API handlers from pages/api/, which is a
// framework constraint rather than a naming choice, so these map the one public
// prefix onto that location. Client code never says /api/ — the hosts are
// api.* already, and a second /api/ in the path is noise.
//
// This replaced /node-api/*, which was a third way to reach the same handlers.
async function rewrites() {
  return [
    { source: '/v1/proxy/:slug*', destination: '/api/proxy' },
    { source: '/v1/:slug*', destination: '/api/:slug*' },
  ];
}

module.exports = rewrites;
