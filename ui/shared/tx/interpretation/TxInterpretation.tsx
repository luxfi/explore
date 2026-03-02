import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressParam } from 'types/api/addressParams';
import type {
  TxInterpretationSummary,
  TxInterpretationVariable,
  TxInterpretationVariableString,
} from 'types/api/txInterpretation';
import type { ClusterChainConfig } from 'types/multichain';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import * as mixpanel from 'lib/mixpanel/index';
import { currencyUnits } from 'lib/units';
import { Badge } from '@luxfi/ui/badge';
import { useColorModeValue } from 'toolkit/next/color-mode';
import { Image } from '@luxfi/ui/image';
import { Link } from 'toolkit/next/link';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tooltip } from '@luxfi/ui/tooltip';
import { SECOND } from 'toolkit/utils/consts';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import getChainTooltipText from 'ui/shared/externalChains/getChainTooltipText';
import IconSvg from 'ui/shared/IconSvg';

import {
  extractVariables,
  getStringChunks,
  fillStringVariables,
  checkSummary,
  NATIVE_COIN_SYMBOL_VAR_NAME,
  WEI_VAR_NAME,
} from './utils';

const nameServicesFeature = config.features.nameServices;

interface Props {
  summary?: TxInterpretationSummary;
  isLoading?: boolean;
  addressDataMap?: Record<string, AddressParam>;
  className?: string;
  isNoves?: boolean;
  chainData?: ClusterChainConfig;
}

type NonStringTxInterpretationVariable = Exclude<TxInterpretationVariable, TxInterpretationVariableString>;

const TxInterpretationElementByType = (
  { variable, addressDataMap }: { variable?: NonStringTxInterpretationVariable; addressDataMap?: Record<string, AddressParam> },
) => {
  const onAddressClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.TX_INTERPRETATION_INTERACTION, { Type: 'Address click' });
  }, []);

  const onTokenClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.TX_INTERPRETATION_INTERACTION, { Type: 'Token click' });
  }, []);

  const onDomainClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.TX_INTERPRETATION_INTERACTION, { Type: 'Domain click' });
  }, []);

  if (!variable) {
    return null;
  }

  const { type, value } = variable;
  switch (type) {
    case 'address': {
      return (
        <span className="inline-block align-top [&:not(:first-child)]:ml-1">
          <AddressEntity
            address={ addressDataMap?.[value.hash] || value }
            truncation="constant"
            onClick={ onAddressClick }
            className="whitespace-normal"
          />
        </span>
      );
    }
    case 'token':
      return (
        <span className="inline-block align-top [&:not(:first-child)]:ml-1">
          <TokenEntity
            token={ value }
            onlySymbol
            noCopy
            className="w-fit mr-2 whitespace-normal [&:not(:first-child)]:ml-1"
            onClick={ onTokenClick }
          />
        </span>
      );
    case 'domain': {
      if (nameServicesFeature.isEnabled && nameServicesFeature.ens.isEnabled) {
        return (
          <span className="inline-block align-top [&:not(:first-child)]:ml-1">
            <EnsEntity
              domain={ value }
              className="w-fit whitespace-normal [&:not(:first-child)]:ml-1"
              onClick={ onDomainClick }
            />
          </span>
        );
      }
      return <span className="text-[var(--color-text-secondary)] whitespace-pre">{ value + ' ' }</span>;
    }
    case 'currency': {
      let numberString = '';
      if (BigNumber(value).isLessThan(0.1)) {
        numberString = BigNumber(value).toPrecision(2);
      } else if (BigNumber(value).isLessThan(10000)) {
        numberString = BigNumber(value).dp(2).toFormat();
      } else if (BigNumber(value).isLessThan(1000000)) {
        numberString = BigNumber(value).dividedBy(1000).toFormat(2) + 'K';
      } else {
        numberString = BigNumber(value).dividedBy(1000000).toFormat(2) + 'M';
      }
      return <span>{ numberString + ' ' }</span>;
    }
    case 'timestamp': {
      return <span className="text-[var(--color-text-secondary)] whitespace-pre">{ dayjs(Number(value) * SECOND).format('MMM DD YYYY') }</span>;
    }
    case 'external_link': {
      return <Link external href={ value.link }>{ value.name }</Link>;
    }
    case 'method': {
      return (
        <Badge
          colorPalette={ value === 'Multicall' ? 'teal' : 'gray' }
          truncated
          className="ml-1 mr-2 align-text-top"
        >
          { value }
        </Badge>
      );
    }
    case 'dexTag': {
      const icon = value.app_icon || value.icon;
      const name = (() => {
        if (value.app_id && config.features.marketplace.isEnabled) {
          return (
            <Link
              href={ route({ pathname: '/apps/[id]', query: { id: value.app_id } }) }
            >
              { value.name }
            </Link>
          );
        }
        if (value.url) {
          return (
            <Link external href={ value.url }>
              { value.name }
            </Link>
          );
        }
        return value.name;
      })();

      return (
        <span className="inline-flex items-center align-top [&:not(:first-child)]:ml-1 gap-1 mr-2">
          { icon && <Image src={ icon } alt={ value.name } width={ 5 } height={ 5 }/> }
          { name }
        </span>
      );
    }
    case 'link': {
      return <Link external href={ value.url }>{ value.name }</Link>;
    }
  }
};

const TxInterpretation = ({ summary, isLoading, addressDataMap, className, chainData, isNoves }: Props) => {
  const novesLogoUrl = useColorModeValue('/static/noves-logo.svg', '/static/noves-logo-dark.svg');
  if (!summary) {
    return null;
  }

  const template = summary.summary_template;
  const variables = summary.summary_template_variables;

  if (!checkSummary(template, variables)) {
    return null;
  }

  const intermediateResult = fillStringVariables(template, variables);

  const variablesNames = extractVariables(intermediateResult);
  const chunks = getStringChunks(intermediateResult);

  const tooltipContent = 'Transaction summary' + (chainData ? `\n${ getChainTooltipText(chainData) }` : '');

  return (
    <Skeleton loading={ isLoading } className={ `${ className ?? '' } font-medium whitespace-pre-wrap`.trim() } fontWeight={ 500 }>
      <Tooltip content={ tooltipContent } contentProps={{ className: 'whitespace-pre-wrap' }}>
        <span className={ `inline-flex relative align-text-top ${ chainData ? 'mr-[14px]' : 'mr-1' }` }>
          <IconSvg name="lightning" className="size-5 text-[var(--color-icon-primary)]"/>
          { chainData && (
            <span className="absolute top-[6px] left-[12px] rounded-full border border-solid border-[var(--color-bg-primary)] bg-[var(--color-bg-primary)]">
              <ChainIcon
                data={ chainData }
                boxSize="18px"
                noTooltip
              />
            </span>
          ) }
        </span>
      </Tooltip>
      { chunks.map((chunk, index) => {
        let content = null;
        if (variablesNames[index] === NATIVE_COIN_SYMBOL_VAR_NAME) {
          content = <span>{ currencyUnits.ether + ' ' }</span>;
        } else if (variablesNames[index] === WEI_VAR_NAME) {
          content = <span>{ currencyUnits.wei + ' ' }</span>;
        } else {
          content = (
            <TxInterpretationElementByType
              variable={ variables[variablesNames[index]] as NonStringTxInterpretationVariable }
              addressDataMap={ addressDataMap }
            />
          );
        }
        return (
          <span key={ chunk + index }>
            <span className="text-[var(--color-text-secondary)]">{ chunk.trim() + (chunk.trim() && variablesNames[index] ? ' ' : '') }</span>
            { index < variablesNames.length && content }
          </span>
        );
      }) }
      { isNoves && (
        <Tooltip content="Human readable transaction provided by Noves.fi">
          <Badge className="ml-2 align-baseline -translate-y-[2px]">
            by
            <Image src={ novesLogoUrl } alt="Noves logo" h="12px" ml={ 1.5 } display="inline"/>
          </Badge>
        </Tooltip>
      ) }
    </Skeleton>
  );
};

export default TxInterpretation;
