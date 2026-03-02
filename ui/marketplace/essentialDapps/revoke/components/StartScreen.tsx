
import { Heading } from '@luxfi/ui/heading';
import IconSvg from 'ui/shared/IconSvg';
import type { IconName } from 'ui/shared/IconSvg';

const STEPS = [
  {
    text: 'Click Connect Wallet on the top right or enter an address in the search bar.',
    icon: 'wallet' as IconName,
  },
  {
    text: 'Inspect your approvals by using the network selection, sorting and filtering options.',
    icon: 'search' as IconName,
  },
  {
    text: 'Revoke the approvals that you no longer use to prevent unwanted access to your funds.',
    icon: 'return' as IconName,
  },
];

export default function StartScreen() {
  return (
    <div className="flex flex-col w-full gap-3 md:gap-6">
      <Heading level="3">
        How to revoke your approvals
      </Heading>
      <div className="flex flex-col md:flex-row gap-2 md:gap-6">
        { STEPS.map((step, index) => (
          <div
            key={ index }
            className="flex flex-col md:flex-row items-start md:items-center p-6 rounded-md bg-black/5 dark:bg-white/5 flex-1 gap-6"
          >
            <IconSvg name={ step.icon } className="w-6 h-6"/>
            <span className="text-sm">
              { step.text }
            </span>
          </div>
        )) }
      </div>
    </div>
  );
}
