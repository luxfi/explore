import { throttle } from 'es-toolkit';
import * as React from 'react';

import ArrowIcon from 'icons/arrows/east.svg';
import { cn } from 'lib/utils/cn';

import { Link } from './link';

// ---------------------------------------------------------------------------
// Chakra-style prop adapter
// Consumers pass Chakra shorthand style props (width, minW, pr, etc.) directly
// to table components. This helper converts them to a React CSSProperties object
// so we can apply them as inline styles without requiring changes to all callers.
// ---------------------------------------------------------------------------

interface ChakraStyleProps {
  width?: React.CSSProperties['width'];
  w?: React.CSSProperties['width'];
  minWidth?: React.CSSProperties['minWidth'];
  minW?: React.CSSProperties['minWidth'];
  maxWidth?: React.CSSProperties['maxWidth'];
  maxW?: React.CSSProperties['maxWidth'];
  height?: React.CSSProperties['height'];
  h?: React.CSSProperties['height'];
  textAlign?: React.CSSProperties['textAlign'];
  verticalAlign?: React.CSSProperties['verticalAlign'];
  whiteSpace?: React.CSSProperties['whiteSpace'];
  wordBreak?: React.CSSProperties['wordBreak'];
  textTransform?: React.CSSProperties['textTransform'];
  fontSize?: React.CSSProperties['fontSize'];
  lineHeight?: React.CSSProperties['lineHeight'];
  animation?: React.CSSProperties['animation'];
  tableLayout?: React.CSSProperties['tableLayout'];
  p?: number | string;
  px?: number | string;
  py?: number | string;
  pr?: number | string;
  pl?: number | string;
  pt?: number | string;
  pb?: number | string;
  m?: number | string;
  mx?: number | string;
  my?: number | string;
  mr?: number | string;
  ml?: number | string;
  mt?: number | string;
  mb?: number | string;
  position?: React.CSSProperties['position'];
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  zIndex?: React.CSSProperties['zIndex'];
  backgroundColor?: React.CSSProperties['backgroundColor'] | Record<string, string>;
  boxShadow?: React.CSSProperties['boxShadow'];
  alignItems?: React.CSSProperties['alignItems'];
  // Chakra pseudo-prop pass-throughs (ignored in Tailwind)
  _first?: Record<string, unknown>;
  _last?: Record<string, unknown>;
}

const SPACING_SCALE = 4; // 1 unit = 4px (Chakra default)

function toPixels(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'string') return value;
  return `${ value * SPACING_SCALE }px`;
}

function extractStyles(props: Record<string, unknown>): { style: React.CSSProperties; rest: Record<string, unknown> } {
  const style: React.CSSProperties = {};
  const rest: Record<string, unknown> = {};

  for (const [ key, value ] of Object.entries(props)) {
    if (value === undefined) continue;

    switch (key) {
      case 'width':
      case 'w':
        style.width = value as React.CSSProperties['width'];
        break;
      case 'minWidth':
      case 'minW':
        style.minWidth = value as React.CSSProperties['minWidth'];
        break;
      case 'maxWidth':
      case 'maxW':
        style.maxWidth = value as React.CSSProperties['maxWidth'];
        break;
      case 'height':
      case 'h':
        style.height = value as React.CSSProperties['height'];
        break;
      case 'textAlign':
        style.textAlign = value as React.CSSProperties['textAlign'];
        break;
      case 'verticalAlign':
        style.verticalAlign = value as React.CSSProperties['verticalAlign'];
        break;
      case 'whiteSpace':
        style.whiteSpace = value as React.CSSProperties['whiteSpace'];
        break;
      case 'wordBreak':
        style.wordBreak = value as React.CSSProperties['wordBreak'];
        break;
      case 'textTransform':
        style.textTransform = value as React.CSSProperties['textTransform'];
        break;
      case 'fontSize':
        style.fontSize = value as React.CSSProperties['fontSize'];
        break;
      case 'lineHeight':
        style.lineHeight = value as React.CSSProperties['lineHeight'];
        break;
      case 'animation':
        style.animation = value as React.CSSProperties['animation'];
        break;
      case 'tableLayout':
        style.tableLayout = value as React.CSSProperties['tableLayout'];
        break;
      case 'p':
        style.padding = toPixels(value as number | string);
        break;
      case 'px': {
        const px = toPixels(value as number | string);
        style.paddingLeft = px;
        style.paddingRight = px;
        break;
      }
      case 'py': {
        const py = toPixels(value as number | string);
        style.paddingTop = py;
        style.paddingBottom = py;
        break;
      }
      case 'pr':
        style.paddingRight = toPixels(value as number | string);
        break;
      case 'pl':
        style.paddingLeft = toPixels(value as number | string);
        break;
      case 'pt':
        style.paddingTop = toPixels(value as number | string);
        break;
      case 'pb':
        style.paddingBottom = toPixels(value as number | string);
        break;
      case 'm':
        style.margin = toPixels(value as number | string);
        break;
      case 'mx': {
        const mx = toPixels(value as number | string);
        style.marginLeft = mx;
        style.marginRight = mx;
        break;
      }
      case 'my': {
        const my = toPixels(value as number | string);
        style.marginTop = my;
        style.marginBottom = my;
        break;
      }
      case 'mr':
        style.marginRight = toPixels(value as number | string);
        break;
      case 'ml':
        style.marginLeft = toPixels(value as number | string);
        break;
      case 'mt':
        style.marginTop = toPixels(value as number | string);
        break;
      case 'mb':
        style.marginBottom = toPixels(value as number | string);
        break;
      case 'position':
        style.position = value as React.CSSProperties['position'];
        break;
      case 'top':
        style.top = typeof value === 'number' ? `${ value }px` : value as string;
        break;
      case 'left':
        style.left = typeof value === 'number' ? `${ value }px` : value as string;
        break;
      case 'right':
        style.right = typeof value === 'number' ? `${ value }px` : value as string;
        break;
      case 'bottom':
        style.bottom = typeof value === 'number' ? `${ value }px` : value as string;
        break;
      case 'zIndex':
        style.zIndex = value as React.CSSProperties['zIndex'];
        break;
      case 'backgroundColor':
        // Skip Chakra responsive objects like { _light: ..., _dark: ... }
        if (typeof value === 'string') {
          style.backgroundColor = value;
        }
        break;
      case 'boxShadow':
        style.boxShadow = value as React.CSSProperties['boxShadow'];
        break;
      case 'alignItems':
        style.alignItems = value as React.CSSProperties['alignItems'];
        break;
      // Chakra pseudo-props: silently drop
      case '_first':
      case '_last':
        break;
      default:
        rest[key] = value;
        break;
    }
  }

  return { style, rest };
}

// ---------------------------------------------------------------------------
// Responsive prop helper
// Consumers pass Chakra responsive objects like { base: '1200px', lg: '1000px' }.
// Convert them to inline style using the base value (mobile-first).
// ---------------------------------------------------------------------------

function resolveResponsive(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return `${ value }px`;
  if (typeof value === 'object' && value !== null && 'base' in value) {
    return (value as Record<string, string>).base;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// TableRoot
// ---------------------------------------------------------------------------

export interface TableRootProps extends ChakraStyleProps, Omit<React.HTMLAttributes<HTMLTableElement>, 'color'> {
  children?: React.ReactNode;
  minWidth?: React.CSSProperties['minWidth'] | Record<string, string>;
  minW?: React.CSSProperties['minWidth'] | Record<string, string>;
}

export const TableRoot = React.forwardRef<HTMLTableElement, TableRootProps>(
  function TableRoot(props, ref) {
    const { className, style: styleProp, children, ...other } = props;

    // Handle responsive minWidth/minW
    const rawMinW = other.minWidth ?? other.minW;
    const resolvedMinW = resolveResponsive(rawMinW);
    if (resolvedMinW) {
      other.minWidth = resolvedMinW;
      delete other.minW;
    }

    const { style: extracted, rest } = extractStyles(other as Record<string, unknown>);
    const merged = { ...extracted, ...styleProp };

    return (
      <table
        ref={ ref }
        className={ cn('w-full border-collapse text-sm', className) }
        style={ merged }
        { ...(rest as React.HTMLAttributes<HTMLTableElement>) }
      >
        { children }
      </table>
    );
  },
);

// ---------------------------------------------------------------------------
// TableHeader (thead)
// ---------------------------------------------------------------------------

export interface TableHeaderProps extends ChakraStyleProps, Omit<React.HTMLAttributes<HTMLTableSectionElement>, 'color'> {
  children?: React.ReactNode;
}

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader(props, ref) {
    const { className, style: styleProp, children, ...other } = props;
    const { style: extracted, rest } = extractStyles(other as Record<string, unknown>);
    const merged = { ...extracted, ...styleProp };

    return (
      <thead
        ref={ ref }
        className={ cn('', className) }
        style={ merged }
        { ...(rest as React.HTMLAttributes<HTMLTableSectionElement>) }
      >
        { children }
      </thead>
    );
  },
);

// ---------------------------------------------------------------------------
// TableBody (tbody)
// ---------------------------------------------------------------------------

export interface TableBodyProps extends ChakraStyleProps, Omit<React.HTMLAttributes<HTMLTableSectionElement>, 'color'> {
  children?: React.ReactNode;
}

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody(props, ref) {
    const { className, style: styleProp, children, ...other } = props;
    const { style: extracted, rest } = extractStyles(other as Record<string, unknown>);
    const merged = { ...extracted, ...styleProp };

    return (
      <tbody
        ref={ ref }
        className={ cn('', className) }
        style={ merged }
        { ...(rest as React.HTMLAttributes<HTMLTableSectionElement>) }
      >
        { children }
      </tbody>
    );
  },
);

// ---------------------------------------------------------------------------
// TableRow (tr)
// ---------------------------------------------------------------------------

export interface TableRowProps extends ChakraStyleProps, Omit<React.HTMLAttributes<HTMLTableRowElement>, 'color'> {
  children?: React.ReactNode;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow(props, ref) {
    const { className, style: styleProp, children, ...other } = props;
    const { style: extracted, rest } = extractStyles(other as Record<string, unknown>);
    const merged = { ...extracted, ...styleProp };

    return (
      <tr
        ref={ ref }
        className={ cn('', className) }
        style={ merged }
        { ...(rest as React.HTMLAttributes<HTMLTableRowElement>) }
      >
        { children }
      </tr>
    );
  },
);

// ---------------------------------------------------------------------------
// TableCell (td)
// ---------------------------------------------------------------------------

export interface TableCellProps extends ChakraStyleProps, Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'color'> {
  isNumeric?: boolean;
  children?: React.ReactNode;
}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell(props, ref) {
    const { isNumeric, className, style: styleProp, children, ...other } = props;
    const { style: extracted, rest } = extractStyles(other as Record<string, unknown>);
    const merged = {
      ...(isNumeric ? { textAlign: 'right' as const } : {}),
      ...extracted,
      ...styleProp,
    };

    return (
      <td
        ref={ ref }
        className={ cn('px-3 py-2.5 align-top text-sm', className) }
        style={ merged }
        { ...(rest as React.TdHTMLAttributes<HTMLTableCellElement>) }
      >
        { children }
      </td>
    );
  },
);

// ---------------------------------------------------------------------------
// TableColumnHeader (th)
// ---------------------------------------------------------------------------

export interface TableColumnHeaderProps extends ChakraStyleProps, Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'color'> {
  isNumeric?: boolean;
  children?: React.ReactNode;
}

export const TableColumnHeader = React.forwardRef<HTMLTableCellElement, TableColumnHeaderProps>(
  function TableColumnHeader(props, ref) {
    const { isNumeric, className, style: styleProp, children, ...other } = props;
    const { style: extracted, rest } = extractStyles(other as Record<string, unknown>);
    const merged = {
      ...(isNumeric ? { textAlign: 'right' as const } : {}),
      ...extracted,
      ...styleProp,
    };

    return (
      <th
        ref={ ref }
        className={ cn(
          'px-3 py-2 text-xs font-semibold uppercase tracking-wider',
          'bg-[var(--color-table-header-bg)] text-[var(--color-table-header-fg)]',
          className,
        ) }
        style={ merged }
        { ...(rest as React.ThHTMLAttributes<HTMLTableCellElement>) }
      >
        { children }
      </th>
    );
  },
);

// ---------------------------------------------------------------------------
// TableColumnHeaderSortable
// ---------------------------------------------------------------------------

export interface TableColumnHeaderSortableProps<F extends string> extends TableColumnHeaderProps {
  sortField: F;
  sortValue: string;
  onSortToggle: (sortField: F) => void;
  disabled?: boolean;
  indicatorPosition?: 'left' | 'right';
  contentAfter?: React.ReactNode;
}

export const TableColumnHeaderSortable = <F extends string>(props: TableColumnHeaderSortableProps<F>) => {
  const { sortField, sortValue, onSortToggle, children, disabled, indicatorPosition = 'left', contentAfter, ...rest } = props;

  const handleSortToggle = React.useCallback(() => {
    onSortToggle(sortField);
  }, [ onSortToggle, sortField ]);

  const isActive = sortValue.includes(sortField);
  const isAsc = sortValue.toLowerCase().includes('asc');

  return (
    <TableColumnHeader { ...rest }>
      <Link onClick={ disabled ? undefined : handleSortToggle } position="relative">
        { isActive && (
          <span
            className={ cn(
              'absolute top-0 inline-flex h-full w-4 items-center',
              indicatorPosition === 'left' ? '-left-5' : '-right-5',
              isAsc ? '-rotate-90' : 'rotate-90',
            ) }
          >
            <ArrowIcon className="h-4 w-4"/>
          </span>
        ) }
        { children }
      </Link>
      { contentAfter }
    </TableColumnHeader>
  );
};

// ---------------------------------------------------------------------------
// TableHeaderSticky
// ---------------------------------------------------------------------------

const ACTION_BAR_SHADOW = '0 4px 4px -4px rgb(0 0 0 / 10%), 0 2px 4px -4px rgb(0 0 0 / 6%)';

export const TableHeaderSticky = (props: TableHeaderProps) => {
  const { top, children, className, style: styleProp, ...rest } = props;

  const ref = React.useRef<HTMLTableSectionElement>(null);
  const [ isStuck, setIsStuck ] = React.useState(false);

  const handleScroll = React.useCallback(() => {
    if (Number(ref.current?.getBoundingClientRect().y) <= (top || 0)) {
      setIsStuck(true);
    } else {
      setIsStuck(false);
    }
  }, [ top ]);

  React.useEffect(() => {
    const throttledHandleScroll = throttle(handleScroll, 300);

    window.addEventListener('scroll', throttledHandleScroll);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [ handleScroll ]);

  return (
    <TableHeader
      ref={ ref }
      className={ cn('sticky z-[1] bg-white dark:bg-black', className) }
      style={{
        top: top ? `${ top }px` : 0,
        boxShadow: isStuck ? ACTION_BAR_SHADOW : 'none',
        ...styleProp,
      }}
      { ...rest }
    >
      { children }
    </TableHeader>
  );
};

// ---------------------------------------------------------------------------
// TableCaption
// ---------------------------------------------------------------------------

export interface TableCaptionProps extends ChakraStyleProps, Omit<React.HTMLAttributes<HTMLTableCaptionElement>, 'color'> {
  children?: React.ReactNode;
}

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  function TableCaption(props, ref) {
    const { className, style: styleProp, children, ...other } = props;
    const { style: extracted, rest } = extractStyles(other as Record<string, unknown>);
    const merged = { ...extracted, ...styleProp };

    return (
      <caption
        ref={ ref }
        className={ cn('px-3 py-2 text-sm text-[var(--color-table-header-fg)]', className) }
        style={ merged }
        { ...(rest as React.HTMLAttributes<HTMLTableCaptionElement>) }
      >
        { children }
      </caption>
    );
  },
);

// ---------------------------------------------------------------------------
// TableFooter (tfoot)
// ---------------------------------------------------------------------------

export interface TableFooterProps extends ChakraStyleProps, Omit<React.HTMLAttributes<HTMLTableSectionElement>, 'color'> {
  children?: React.ReactNode;
}

export const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  function TableFooter(props, ref) {
    const { className, style: styleProp, children, ...other } = props;
    const { style: extracted, rest } = extractStyles(other as Record<string, unknown>);
    const merged = { ...extracted, ...styleProp };

    return (
      <tfoot
        ref={ ref }
        className={ cn('', className) }
        style={ merged }
        { ...(rest as React.HTMLAttributes<HTMLTableSectionElement>) }
      >
        { children }
      </tfoot>
    );
  },
);

// ---------------------------------------------------------------------------
// TableScrollWrapper
// ---------------------------------------------------------------------------

export interface TableScrollWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const TableScrollWrapper = React.forwardRef<HTMLDivElement, TableScrollWrapperProps>(
  function TableScrollWrapper(props, ref) {
    const { className, children, ...rest } = props;

    return (
      <div
        ref={ ref }
        className={ cn('w-full overflow-x-auto', className) }
        { ...rest }
      >
        { children }
      </div>
    );
  },
);
