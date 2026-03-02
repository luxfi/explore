import React from 'react';

interface UseDisclosureProps {
  defaultOpen?: boolean;
}

export function useDisclosure(props?: UseDisclosureProps) {
  const [ open, setOpen ] = React.useState(props?.defaultOpen ?? false);

  const onOpen = React.useCallback(() => setOpen(true), []);
  const onClose = React.useCallback(() => setOpen(false), []);
  const onToggle = React.useCallback(() => setOpen((prev) => !prev), []);

  const onOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    setOpen(open);
  }, []);

  return React.useMemo(() => ({
    open,
    onOpenChange,
    onClose,
    onOpen,
    onToggle,
  }), [ open, onOpenChange, onClose, onOpen, onToggle ]);
}
