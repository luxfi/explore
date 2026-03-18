import * as RadixCheckbox from '@radix-ui/react-checkbox';
// chakra() HOC removed — pure Radix + Tailwind
import * as React from 'react';

import { cn } from 'lib/utils/cn';

const NOOP = () => { /* noop */ };

// ─── CheckboxGroup context ───────────────────────────────────────────
interface CheckboxGroupContextValue {
  value: Array<string>;
  toggle: (itemValue: string) => void;
}

const CheckboxGroupContext = React.createContext<CheckboxGroupContextValue | null>(null);

function useCheckboxGroupContext(): CheckboxGroupContextValue | null {
  return React.useContext(CheckboxGroupContext);
}

// ─── CheckboxGroup ───────────────────────────────────────────────────
export interface CheckboxGroupProps extends React.ComponentPropsWithoutRef<'div'> {
  value?: Array<string>;
  defaultValue?: Array<string>;
  onValueChange?: (value: Array<string>) => void;
  orientation?: 'vertical' | 'horizontal';
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

const CheckboxGroupBase = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  function CheckboxGroup(props, ref) {
    const {
      children,
      value: controlledValue,
      defaultValue,
      onValueChange,
      orientation = 'vertical',
      name: _name,
      className,
      ...rest
    } = props;

    const [ uncontrolledValue, setUncontrolledValue ] = React.useState<Array<string>>(defaultValue ?? []);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    const toggle = React.useCallback(
      (itemValue: string) => {
        const next = value.includes(itemValue) ?
          value.filter((v) => v !== itemValue) :
          [ ...value, itemValue ];

        if (!isControlled) {
          setUncontrolledValue(next);
        }
        onValueChange?.(next);
      },
      [ value, isControlled, onValueChange ],
    );

    // Sync uncontrolled state when controlled value changes
    React.useEffect(() => {
      if (isControlled) {
        setUncontrolledValue(controlledValue);
      }
    }, [ isControlled, controlledValue ]);

    const ctx = React.useMemo(() => ({ value, toggle }), [ value, toggle ]);

    return (
      <CheckboxGroupContext.Provider value={ ctx }>
        <div
          ref={ ref }
          role="group"
          className={ cn(
            'flex',
            orientation === 'vertical' ? 'flex-col gap-3' : 'flex-row gap-8',
            className,
          ) }
          { ...rest }
        >
          { children }
        </div>
      </CheckboxGroupContext.Provider>
    );
  },
);

export const CheckboxGroup = CheckboxGroupBase;

// ─── Checkbox ────────────────────────────────────────────────────────
export interface CheckboxProps extends Omit<React.ComponentPropsWithoutRef<'label'>, 'onChange'> {
  icon?: React.ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  rootRef?: React.Ref<HTMLLabelElement>;
  checked?: boolean | 'indeterminate';
  defaultChecked?: boolean;
  onCheckedChange?: (checked: RadixCheckbox.CheckedState) => void;
  onChange?: React.FormEventHandler<HTMLLabelElement>;
  disabled?: boolean;
  readOnly?: boolean;
  value?: string;
  size?: 'sm' | 'md';
  name?: string;
  required?: boolean;
}

const SIZE_CLASSES = {
  sm: {
    root: 'gap-1.5',
    control: 'h-3.5 w-3.5 rounded-sm',
    label: 'text-xs',
    icon: 'h-3 w-3',
  },
  md: {
    root: 'gap-2',
    control: 'h-4 w-4 rounded',
    label: 'text-sm',
    icon: 'h-3.5 w-3.5',
  },
} as const;

const CheckIcon = ({ className }: { readonly className?: string }) => (
  <svg
    className={ className }
    viewBox="0 0 12 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.59 0.59L4 7.17L1.41 4.59L0 6L4 10L12 2L10.59 0.59Z"
      fill="currentColor"
    />
  </svg>
);

const IndeterminateIcon = ({ className }: { readonly className?: string }) => (
  <svg
    className={ className }
    viewBox="0 0 12 2"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0H12V2H0V0Z" fill="currentColor"/>
  </svg>
);

const CheckboxBase = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(props, ref) {
    const {
      icon,
      children,
      inputProps,
      rootRef,
      checked: checkedProp,
      defaultChecked,
      onCheckedChange,
      onChange,
      disabled = false,
      readOnly = false,
      value,
      size = 'md',
      name,
      required,
      className,
      ...rest
    } = props;

    const group = useCheckboxGroupContext();
    const hiddenInputRef = React.useRef<HTMLInputElement | null>(null);

    // Merge external ref with internal ref
    const setHiddenInputRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        hiddenInputRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }
      },
      [ ref ],
    );

    // Determine checked state
    const isInGroup = group !== null && value !== undefined;
    const groupChecked = isInGroup ? group.value.includes(value) : undefined;

    const [ internalChecked, setInternalChecked ] = React.useState<RadixCheckbox.CheckedState>(
      defaultChecked ?? false,
    );

    const isControlled = checkedProp !== undefined || isInGroup;
    let checkedState: RadixCheckbox.CheckedState;
    if (checkedProp !== undefined) {
      checkedState = checkedProp;
    } else if (isInGroup) {
      checkedState = groupChecked ?? false;
    } else {
      checkedState = internalChecked;
    }

    const handleCheckedChange = React.useCallback(
      (nextChecked: RadixCheckbox.CheckedState) => {
        if (readOnly) return;

        if (!isControlled) {
          setInternalChecked(nextChecked);
        }

        if (isInGroup) {
          group.toggle(value);
        }

        onCheckedChange?.(nextChecked);

        // Dispatch a native change event from the hidden input so that
        // onChange handlers on the label (which listen for bubbling change
        // events) continue to work as they did with the Chakra version.
        if (onChange && hiddenInputRef.current) {
          const input = hiddenInputRef.current;
          // Set the checked property to the new state before dispatching
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            'checked',
          )?.set;
          nativeInputValueSetter?.call(input, nextChecked === true);
          const event = new Event('change', { bubbles: true });
          input.dispatchEvent(event);
        }
      },
      [ readOnly, isControlled, isInGroup, group, value, onCheckedChange, onChange ],
    );

    const sizeClasses = SIZE_CLASSES[size];

    return (
      <label
        ref={ rootRef }
        className={ cn(
          'inline-flex items-center cursor-pointer select-none',
          sizeClasses.root,
          disabled && 'opacity-50 cursor-not-allowed',
          readOnly && 'cursor-default',
          className,
        ) }
        onChange={ onChange }
        data-disabled={ disabled || undefined }
        data-readonly={ readOnly || undefined }
        { ...rest }
      >
        <RadixCheckbox.Root
          checked={ checkedState }
          onCheckedChange={ handleCheckedChange }
          disabled={ disabled || readOnly }
          name={ name }
          value={ value }
          required={ required }
          className={ cn(
            'inline-flex items-center justify-center shrink-0',
            'border-2 border-current/30',
            'data-[state=checked]:bg-gray-800 data-[state=checked]:text-white',
            'dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black',
            'data-[state=indeterminate]:bg-gray-800 data-[state=indeterminate]:text-white',
            'dark:data-[state=indeterminate]:bg-white dark:data-[state=indeterminate]:text-black',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500',
            'transition-colors duration-150',
            sizeClasses.control,
          ) }
        >
          { icon ?? (
            <RadixCheckbox.Indicator className={ cn('flex items-center justify-center', sizeClasses.icon) }>
              { checkedState === 'indeterminate' ? (
                <IndeterminateIcon className={ sizeClasses.icon }/>
              ) : (
                <CheckIcon className={ sizeClasses.icon }/>
              ) }
            </RadixCheckbox.Indicator>
          ) }
        </RadixCheckbox.Root>
        { /* Hidden native input for form compatibility and ref forwarding */ }
        <input
          ref={ setHiddenInputRef }
          type="checkbox"
          className="sr-only"
          checked={ checkedState === true }
          disabled={ disabled }
          readOnly={ readOnly }
          name={ name }
          value={ value }
          tabIndex={ -1 }
          aria-hidden
          onChange={ NOOP }
          { ...inputProps }
        />
        { children != null && (
          <span className={ cn(sizeClasses.label) }>{ children }</span>
        ) }
      </label>
    );
  },
);

export const Checkbox = CheckboxBase;
