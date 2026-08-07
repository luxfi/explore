import { Button } from '@luxfi/ui/button';
import { DialogBody, DialogContent, DialogHeader, DialogRoot } from '@luxfi/ui/dialog';
import { Input } from '@luxfi/ui/input';
import React from 'react';

import config from 'configs/app';

const feature = config.features.aiAssistant;

// The label is platform-dependent and there is no navigator while the page is
// rendered on the server, so it resolves after mount — the first client render
// has to match the server's or React discards the tree. Undefined means "not
// yet known"; the caller renders nothing rather than guessing wrong and
// swapping the key name under the reader.
export function useAssistantShortcut(): string | undefined {
  const [ label, setLabel ] = React.useState<string>();
  React.useEffect(() => {
    setLabel(/Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘K' : 'Ctrl K');
  }, []);
  return feature.isEnabled ? label : undefined;
}

interface Message {
  readonly role: 'user' | 'assistant';
  readonly content: string;
}

// Mounted once, next to the search bar. The search field advertises the
// shortcut; this owns it, so there is one listener no matter how many search
// inputs a page renders.
const SearchBarAssistant = () => {
  const [ open, setOpen ] = React.useState(false);
  const [ messages, setMessages ] = React.useState<ReadonlyArray<Message>>([]);
  const [ value, setValue ] = React.useState('');
  const [ isSending, setIsSending ] = React.useState(false);
  const [ error, setError ] = React.useState<string>();

  React.useEffect(() => {
    // The early return for a disabled feature is below, after the hooks, so
    // this has to check too — otherwise a deployment with the assistant off
    // still swallows the shortcut, and Ctrl+K is the browser's address bar on
    // Chrome and Firefox.
    if (!feature.isEnabled) {
      return;
    }
    const handler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) {
        return;
      }
      event.preventDefault();
      setOpen((prev) => !prev);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const onOpenChange = React.useCallback(({ open: next }: { open: boolean }) => setOpen(next), []);

  // The dialog parks focus on its close button, where a space keypress closes
  // it again — so the field claims focus once it is on screen. autoFocus is not
  // enough: the dialog's own focus pass runs after mount.
  const inputRef = React.useCallback((node: HTMLInputElement | null) => {
    node && requestAnimationFrame(() => node.focus());
  }, []);

  const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value), []);

  const send = React.useCallback(async(event: React.FormEvent) => {
    event.preventDefault();
    const question = value.trim();
    if (!question || isSending) {
      return;
    }

    const next = [ ...messages, { role: 'user' as const, content: question } ];
    setMessages(next);
    setValue('');
    setError(undefined);
    setIsSending(true);

    try {
      const res = await fetch('/v1/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const json = await res.json() as { content?: string; error?: string };
      if (!res.ok || !json.content) {
        setError(json.error ?? `The assistant returned HTTP ${ res.status }`);
        return;
      }
      setMessages([ ...next, { role: 'assistant', content: json.content } ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The assistant could not be reached');
    } finally {
      setIsSending(false);
    }
  }, [ value, isSending, messages ]);

  if (!feature.isEnabled) {
    return null;
  }

  // A plain size, not a breakpoint map: `full` carries min-h-dvh and
  // rounded-none, and sizeClasses only prefixes the `lg` half, so those two
  // would leak into every width and the panel becomes a full-height sheet.
  return (
    <DialogRoot open={ open } onOpenChange={ onOpenChange } size="md">
      <DialogContent data-testid="ai-chat">
        <DialogHeader>Ask anything</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto mb-3">
            { messages.map((message, index) => (
              <div
                key={ index }
                className={ message.role === 'user' ?
                  'self-end max-w-[85%] rounded-lg px-3 py-2 text-sm bg-[var(--color-selected-control-bg)] text-[var(--color-selected-control-text)]' :
                  'self-start max-w-[85%] text-sm text-[var(--color-text-primary)] whitespace-pre-wrap' }
              >
                { message.content }
              </div>
            )) }
            { isSending && <span className="self-start text-sm text-[var(--color-text-secondary)]">Thinking…</span> }
            { error && <span className="self-start text-sm text-[var(--color-text-error)]">{ error }</span> }
          </div>
          <form onSubmit={ send } className="flex gap-2">
            { /* Input is a gui component that sizes itself to 100% and ignores
                 flex utilities, so the flex item is this wrapper, not the field. */ }
            <div className="flex-1 min-w-0">
              <Input
                size="md"
                ref={ inputRef }
                value={ value }
                onChange={ handleChange }
                placeholder="Ask about an address, transaction or block"
                className="border border-solid border-[var(--color-input-border)] rounded-lg"
              />
            </div>
            { /* gui's Button lays its children out itself and warns on a bare text node */ }
            <Button type="submit" size="md" loading={ isSending } className="shrink-0"><span>Send</span></Button>
          </form>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default React.memo(SearchBarAssistant);
