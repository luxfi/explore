// One provider, because there is one gate: Hanzo IAM. Kept as a named type
// rather than inlined so the single value stays easy to find — and so widening
// it back out is a deliberate edit here, not an accident at a call site.
export type AuthProvider = 'oidc';
