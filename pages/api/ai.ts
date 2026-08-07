// Server-side proxy for the ⌘K assistant.
//
// The credential lives here and never reaches a bundle, which is the only
// reason this hop exists — same shape as pages/api/pchain.ts. Hanzo AI
// (api.hanzo.ai) is the one AI stack; the endpoint is OpenAI-compatible.
//
// This route is reachable by anyone who can load the explorer, so it is bounded
// rather than trusted: the request shape, the number of messages, their total
// size and the reply length are all capped before our key is spent.

import type { NextApiRequest, NextApiResponse } from 'next';

const TIMEOUT_MS = 30_000;
const MAX_MESSAGES = 20;
const MAX_CHARS = 8_000;
const MAX_TOKENS = 800;

const API_URL = process.env.AI_API_URL || 'https://api.hanzo.ai/v1/chat/completions';
const MODEL = process.env.NEXT_PUBLIC_AI_ASSISTANT_MODEL || 'best';

const SYSTEM_PROMPT =
  'You are the assistant built into the Lux Network block explorer. Answer questions about ' +
  'addresses, transactions, blocks, tokens, validators and the Lux chains. Be brief. When you ' +
  'do not know something, say so — never invent an address, hash, balance or block number.';

interface Message {
  readonly role: 'user' | 'assistant';
  readonly content: string;
}

function parseMessages(body: unknown): ReadonlyArray<Message> | undefined {
  const messages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return undefined;
  }
  const parsed: Array<Message> = [];
  let chars = 0;
  for (const m of messages) {
    const role = (m as Message)?.role;
    const content = (m as Message)?.content;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string' || !content) {
      return undefined;
    }
    chars += content.length;
    if (chars > MAX_CHARS) {
      return undefined;
    }
    parsed.push({ role, content });
  }
  return parsed;
}

const handler = async(req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    // Configured on but not credentialled. Say which, so the dialog can too.
    res.status(501).json({ error: 'The assistant is not configured on this deployment (AI_API_KEY is unset).' });
    return;
  }

  const messages = parseMessages(req.body);
  if (!messages) {
    res.status(400).json({ error: 'Expected { messages: [{ role, content }] } within the size limits' });
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ apiKey }`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        messages: [ { role: 'system', content: SYSTEM_PROMPT }, ...messages ],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    // Same guard as the P-chain proxy: a gateway error answers HTML, and
    // JSON.parse on that is an opaque crash rather than a usable message.
    const raw = await response.text();
    let data: { choices?: Array<{ message?: { content?: string } }> };
    try {
      data = JSON.parse(raw) as { choices?: Array<{ message?: { content?: string } }> };
    } catch {
      res.status(502).json({ error: `The assistant upstream returned non-JSON (HTTP ${ response.status })` });
      return;
    }

    const content = data.choices?.[0]?.message?.content;
    if (!response.ok || !content) {
      res.status(502).json({ error: `The assistant upstream returned HTTP ${ response.status } with no answer` });
      return;
    }

    res.status(200).json({ content });
  } catch (error) {
    res.status(502).json({
      error: error instanceof Error ? error.message : 'The assistant request failed',
    });
  }
};

export default handler;
