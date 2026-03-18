import React from 'react';

import type { VerifiedContract } from 'types/api/contracts';

import formatLanguageName from 'lib/contracts/formatLanguageName';
import { CONTRACT_LICENSES } from 'lib/contracts/licenses';
import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import ContractCertifiedLabel from 'ui/shared/ContractCertifiedLabel';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

interface Props {
  data: VerifiedContract;
  isLoading?: boolean;
}

const VerifiedContractsListItem = ({ data, isLoading }: Props) => {
  const license = (() => {
    const license = CONTRACT_LICENSES.find((license) => license.type === data.license_type);
    if (!license || license.type === 'none') {
      return '-';
    }

    return license.label;
  })();

  return (
    <ListItemMobile>
      <div className="flex w-full">
        <div className="flex overflow-hidden">
          <AddressEntity
            isLoading={ isLoading }
            address={ data.address }
            query={{ tab: 'contract' }}
            noCopy
          />
          { data.certified && <ContractCertifiedLabel iconSize={ 5 } boxSize={ 5 }/> }
        </div>
        <AddressEntity
          address={{ hash: data.address.filecoin?.robust ?? data.address.hash }}
          isLoading={ isLoading }
          noLink
          noIcon
          truncation="constant"
          ml="auto"
        />
      </div>
      <div className="flex w-full">
        <Skeleton loading={ isLoading } className="font-medium shrink-0">Balance { currencyUnits.ether }</Skeleton>
        <NativeCoinValue
          amount={ data.coin_balance }
          noSymbol
          loading={ isLoading }
        />
      </div>
      <div className="flex">
        <Skeleton loading={ isLoading } className="font-medium">Txs count</Skeleton>
        <Skeleton loading={ isLoading }>
          <span>{ data.transactions_count ? data.transactions_count.toLocaleString() : '0' }</span>
        </Skeleton>
      </div>
      <div className="flex">
        <Skeleton loading={ isLoading } className="font-medium shrink-0">Language</Skeleton>
        <Skeleton loading={ isLoading } className="flex flex-wrap">
          <div>{ formatLanguageName(data.language) }</div>
          <div> ({ data.compiler_version })</div>
        </Skeleton>
      </div>
      { data.zk_compiler_version && (
        <div className="flex">
          <Skeleton loading={ isLoading } className="font-medium shrink-0">ZK compiler</Skeleton>
          <Skeleton loading={ isLoading } className="text-[var(--color-text-secondary)] break-all whitespace-pre-wrap">
            { data.zk_compiler_version }
          </Skeleton>
        </div>
      ) }
      <div className="flex">
        <Skeleton loading={ isLoading } className="font-medium">Optimization</Skeleton>
        { data.optimization_enabled ?
          <IconSvg name="check" boxSize={ 6 } isLoading={ isLoading }/> :
          <IconSvg name="cross" boxSize={ 6 } isLoading={ isLoading }/> }
      </div>
      <div className="flex">
        <Skeleton loading={ isLoading } className="font-medium">Constructor args</Skeleton>
        { data.has_constructor_args ?
          <IconSvg name="check" boxSize={ 6 } isLoading={ isLoading }/> :
          <IconSvg name="cross" boxSize={ 6 } isLoading={ isLoading }/> }
      </div>
      <div className="flex">
        <Skeleton loading={ isLoading } className="font-medium">Verified</Skeleton>
        <div className="flex">
          <IconSvg name="status/success" boxSize={ 4 } isLoading={ isLoading }/>
          <TimeWithTooltip
            timestamp={ data.verified_at }
            isLoading={ isLoading }
          />
        </div>
      </div>
      <div className="flex">
        <Skeleton loading={ isLoading } className="font-medium">License</Skeleton>
        <Skeleton loading={ isLoading }>
          <span>{ license }</span>
        </Skeleton>
      </div>
    </ListItemMobile>
  );
};

export default React.memo(VerifiedContractsListItem);
