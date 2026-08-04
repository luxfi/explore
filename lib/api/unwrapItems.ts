/**
 * Collapses a list payload to a plain array.
 *
 * The same resource is served in two shapes across backend builds: a bare list,
 * or that list wrapped in the paginated `{ items: [ ... ] }` envelope. Callers
 * want to iterate, not to care which one arrived, so this is the single place
 * that knows about the envelope.
 *
 * Anything else on the wire — an error body, `null`, a scalar — yields an empty
 * list rather than a value the caller will try to iterate and crash on.
 */
export default function unwrapItems<T>(payload: unknown): Array<T> {
  if (Array.isArray(payload)) {
    return payload as Array<T>;
  }

  if (payload && typeof payload === 'object') {
    const items = (payload as { items?: unknown }).items;
    if (Array.isArray(items)) {
      return items as Array<T>;
    }
  }

  return [];
}
