import React from 'react';

import type { AddressParam } from 'types/api/addressParams';
import type { BlockBaseFeeCelo } from 'types/api/block';
import type { TokenInfo } from 'types/api/token';

import { Link } from 'toolkit/chakra/link';
import { ZERO_ADDRESS } from 'toolkit/utils/consts';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';
import TokenValue from 'ui/shared/value/TokenValue';

type ItemProps = BlockBaseFeeCelo['breakdown'][number] & {
  addressFrom: AddressParam;
  token: TokenInfo;
};

const BreakDownItem = ({ amount, percentage, address, addressFrom, token }: ItemProps) => {
  const isBurning = address.hash === ZERO_ADDRESS;

  return (
    <div className="items-center flex-wrap gap-x-2">
      <div className="text-[var(--color-text-secondary)]">{ percentage }% of amount</div>
      <TokenValue
        amount={ amount }
        token={ token }
      />
      { isBurning ? (
        <>
          <AddressEntity address={ addressFrom } truncation="constant"/>
          <IconSvg name="flame" className="w-5 h-5 text-[var(--color-icon-primary)]"/>
          <div className="text-[var(--color-text-secondary)]">burnt</div>
        </>
      ) : <AddressFromTo from={ addressFrom } to={ address }/> }
    </div>
  );
};

interface Props {
  data: BlockBaseFeeCelo;
}

const BlockDetailsBaseFeeCelo = ({ data }: Props) => {
  const totalFeeLabel = (
    <div className="whitespace-pre-wrap">
      <span>The FeeHandler regularly burns 80% of its tokens. Non-CELO tokens are swapped to CELO beforehand. The remaining 20% are sent to the </span>
      <Link external href="https://www.ultragreen.money">Green Fund</Link>
      <span>.</span>
    </div>
  );

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="The contract receiving the base fee, responsible for handling fee usage. This contract is controlled by governance process."
      >
        Base fee handler
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <AddressEntity address={ data.recipient }/>
      </DetailedInfo.ItemValue>
      <DetailedInfo.ItemLabel hint={ totalFeeLabel }>
        Base fee total
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow flexDirection="column" alignItems="flex-start">
        <TokenValue
          amount={ data.amount }
          token={ data.token }
        />
        { data.breakdown.length > 0 && (
          <div className="flex-col gap-y-2 mt-2">
            { data.breakdown.map((item, index) => (
              <BreakDownItem
                key={ index }
                { ...item }
                addressFrom={ data.recipient }
                token={ data.token }
              />
            )) }
          </div>
        ) }
      </DetailedInfo.ItemValue>
      <DetailedInfo.ItemDivider/>
    </>
  );
};

export default React.memo(BlockDetailsBaseFeeCelo);
