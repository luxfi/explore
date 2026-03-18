import React from 'react';

import type { VerifiedContract } from 'types/api/contracts';
import type { ClusterChainConfig } from 'types/multichain';

import formatLanguageName from 'lib/contracts/formatLanguageName';
import { CONTRACT_LICENSES } from 'lib/contracts/licenses';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { Tooltip } from 'toolkit/chakra/tooltip';
import ContractCertifiedLabel from 'ui/shared/ContractCertifiedLabel';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import IconSvg from 'ui/shared/IconSvg';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

interface Props {
  data: VerifiedContract;
  isLoading?: boolean;
  chainData?: ClusterChainConfig;
}

const VerifiedContractsTableItem = ({ data, isLoading, chainData }: Props) => {
  const license = (() => {
    const license = CONTRACT_LICENSES.find((license) => license.type === data.license_type);
    if (!license || license.type === 'none') {
      return '-';
    }

    return license.label;
  })();

  return (
    <TableRow>
      { chainData && (
        <TableCell>
          <ChainIcon data={ chainData } isLoading={ isLoading }/>
        </TableCell>
      ) }
      <TableCell>
        <div className="flex">
          <AddressEntity
            address={ data.address }
            isLoading={ isLoading }
            query={{ tab: 'contract', ...(chainData ? { chain_id: chainData.id } : {}) }}
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
        />
      </TableCell>
      <TableCell isNumeric>
        <NativeCoinValue
          amount={ data.coin_balance }
          noSymbol
          loading={ isLoading }
        />
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } className="inline-block my-1">
          { data.transactions_count ? data.transactions_count.toLocaleString() : '0' }
        </Skeleton>
      </TableCell>
      <TableCell>
        <div className="flex">
          <Skeleton loading={ isLoading } className="my-1">{ formatLanguageName(data.language) }</Skeleton>
          { data.compiler_version && (
            <Skeleton loading={ isLoading } className="text-[var(--color-text-secondary)] break-all my-1 cursor-pointer">
              <Tooltip content={ data.compiler_version }>
                <span>{ data.compiler_version.split('+')[0] }</span>
              </Tooltip>
            </Skeleton>
          ) }
        </div>
        { data.zk_compiler_version && (
          <div className="flex">
            <Skeleton loading={ isLoading }>ZK compiler</Skeleton>
            <Skeleton loading={ isLoading } className="text-[var(--color-text-secondary)] break-all">
              <span>{ data.zk_compiler_version }</span>
            </Skeleton>
          </div>
        ) }
      </TableCell>
      <TableCell>
        <Tooltip content="Optimization" disabled={ isLoading }>
          <span className="inline-block">
            { data.optimization_enabled ?
              <IconSvg name="check" boxSize={ 6 } isLoading={ isLoading }/> :
              <IconSvg name="cross" boxSize={ 6 } isLoading={ isLoading }/> }
          </span>
        </Tooltip>
        <Tooltip content="Constructor args" disabled={ isLoading }>
          <span className="inline-block">
            { data.has_constructor_args ?
              <IconSvg name="check" boxSize={ 6 } isLoading={ isLoading }/> :
              <IconSvg name="cross" boxSize={ 6 } isLoading={ isLoading }/> }
          </span>
        </Tooltip>
      </TableCell>
      <TableCell>
        <div className="flex">
          <IconSvg name="status/success" boxSize={ 4 } isLoading={ isLoading }/>
          <TimeWithTooltip
            timestamp={ data.verified_at }
            isLoading={ isLoading }
          />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading } className="my-1 inline-block">
          { license }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(VerifiedContractsTableItem);
