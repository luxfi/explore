import BigNumber from 'bignumber.js';
import React from 'react';

import type { TxAction, TxActionGeneral } from 'types/api/txAction';

import config from 'configs/app';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  action: TxAction;
}

function getActionText(actionType: TxActionGeneral['type']) {
  switch (actionType) {
    case 'mint': return [ 'Added', 'liquidity to' ];
    case 'burn': return [ 'Removed', 'liquidity from' ];
    case 'collect': return [ 'Collected', 'from' ];
    case 'swap': return [ 'Swapped', 'on' ];
  }
}

const TxDetailsAction = ({ action }: Props) => {
  const { protocol, type, data } = action;

  if (protocol !== 'uniswap_v3') {
    return null;
  }

  switch (type) {
    case 'mint':
    case 'burn':
    case 'collect':
    case 'swap': {
      const amount0 = BigNumber(data.amount0).toFormat();
      const amount1 = BigNumber(data.amount1).toFormat();
      const [ text0, text1 ] = getActionText(type);
      const token0 = {
        address_hash: data.symbol0 === 'Ether' ? '' : data.address0,
        name: data.symbol0 === 'Ether' ? config.chain.currency.symbol || null : data.symbol0,
        type: 'ERC-20' as const,
        symbol: null,
        icon_url: null,
        reputation: null,
      };
      const token1 = {
        address_hash: data.symbol1 === 'Ether' ? '' : data.address1,
        name: data.symbol1 === 'Ether' ? config.chain.currency.symbol || null : data.symbol1,
        type: 'ERC-20' as const,
        symbol: null,
        icon_url: null,
        reputation: null,
      };

      return (
        <div>
          <span className="text-[var(--color-text-secondary)]">{ text0 }</span>

          <span>{ amount0 }</span>

          <TokenEntity
            token={ token0 }
            noLink={ data.symbol0 === 'Ether' }
            noCopy
            noIcon
            noSymbol
            className="w-auto"
          />

          <span className="text-[var(--color-text-secondary)]">{ type === 'swap' ? 'for' : 'and' }</span>

          <span>{ amount1 }</span>

          <TokenEntity
            token={ token1 }
            noLink={ data.symbol1 === 'Ether' }
            noIcon
            noCopy
            noSymbol
            className="w-auto"
          />

          <span className="text-[var(--color-text-secondary)]">{ text1 }</span>

          <div>
            <IconSvg name="uniswap" className="text-white p-[2px]"/>
            <span>Uniswap V3</span>
          </div>
        </div>
      );
    }

    case 'mint_nft' : {
      const token = {
        address_hash: data.address,
        name: data.name,
        type: 'ERC-20' as const,
        symbol: null,
        icon_url: null,
        reputation: null,
      };

      return (
        <div>
          <div>
            <span className="text-[var(--color-text-secondary)]">Minted</span>

            <TokenEntity
              token={ token }
              noCopy
              className="w-auto"
            />

            <span className="text-[var(--color-text-secondary)]">to</span>

            <AddressEntity
              address={{ hash: data.to }}
              truncation="constant"
              noIcon
              noCopy
            />
          </div>

          <div>
            {
              data.ids.map((id: string) => {
                return (
                  <div key={ data.address + id }>
                    <span>1</span>
                    <span className="text-[var(--color-text-secondary)]">of token ID</span>
                    <NftEntity hash={ data.address } id={ id } className="w-min" variant="content"/>
                  </div>
                );
              })
            }
          </div>
        </div>
      );
    }

    default:
      return null;
  }
};

export default React.memo(TxDetailsAction);
