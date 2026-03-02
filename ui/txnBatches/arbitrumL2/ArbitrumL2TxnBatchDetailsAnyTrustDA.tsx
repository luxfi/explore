import React from 'react';

import type { ArbitrumL2TxnBatchDAAnytrust } from 'types/api/arbitrumL2';

import dayjs from 'lib/date/dayjs';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailsTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import HashStringShorten from 'ui/shared/HashStringShorten';
import IconSvg from 'ui/shared/IconSvg';
import TextSeparator from 'ui/shared/TextSeparator';

type Props = {
  data: ArbitrumL2TxnBatchDAAnytrust;
};

const ArbitrumL2TxnBatchDetailsAnyTrustDA = ({ data }: Props) => {
  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Aggregated BLS signature of AnyTrust committee members"
      >
        Signature
      </DetailedInfo.ItemLabel><DetailedInfo.ItemValue className="break-all whitespace-break-spaces">
        { data.bls_signature }
      </DetailedInfo.ItemValue><DetailedInfo.ItemLabel
        hint="The hash of the data blob stored by the AnyTrust committee"
      >
        Data hash
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue className="whitespace-pre-wrap break-all items-start lg:items-center">
        { data.data_hash }
        <CopyToClipboard text={ data.data_hash } className="ml-2"/>
      </DetailedInfo.ItemValue>
      <DetailedInfo.ItemLabel
        hint="Expiration timeout for the data blob"
      >
        Timeout
      </DetailedInfo.ItemLabel><DetailedInfo.ItemValue multiRow>
        { dayjs(data.timeout) < dayjs() ?
          <DetailsTimestamp timestamp={ data.timeout }/> :
          (
            <>
              <DetailsTimestamp timestamp={ data.timeout } noRelativeTime/>
              <TextSeparator/>
              <span className="text-red-500">{ dayjs(data.timeout).diff(dayjs(), 'day') } days left</span>
            </>
          ) }
      </DetailedInfo.ItemValue>
      <DetailedInfo.ItemLabel
        hint="Members of AnyTrust committee"
      >
        Signers
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue className="overflow-x-auto text-sm">
        <div
          className="hidden lg:grid gap-5 bg-black/5 dark:bg-white/5 p-4 rounded-md min-w-[600px]"
          style={{ gridTemplateColumns: '1fr auto auto' }}
        >
          <span className="font-semibold">Key</span>
          <span className="font-semibold">Trusted</span>
          <span className="font-semibold">Proof</span>
          { data.signers.map(signer => (
            <React.Fragment key={ signer.key }>
              <div className="flex justify-between">
                <span className="break-all whitespace-break-spaces">{ signer.key }</span>
                <CopyToClipboard text={ signer.key } className="ml-2"/>
              </div>
              <div className="justify-self-center">
                { signer.trusted ? <IconSvg name="check" className="size-6"/> : <IconSvg name="cross" className="size-6"/> }
              </div>
              { signer.proof ? (
                <div className="flex">
                  <HashStringShorten hash={ signer.proof }/>
                  <CopyToClipboard text={ signer.proof } className="ml-2"/>
                </div>
              ) : '-' }
            </React.Fragment>
          )) }
        </div>

        <div className="block lg:hidden bg-black/5 dark:bg-white/5 rounded-md">
          { data.signers.map(signer => (
            <div className="flex flex-col gap-2 p-4" key={ signer.key }>
              <div className="flex w-full justify-between">
                <span className="font-semibold">Key</span>
                <CopyToClipboard text={ signer.key }/>
              </div>
              <span className="break-all whitespace-break-spaces">{ signer.key }</span>
              <div className="flex w-full items-center">
                <div className="flex items-center w-1/2">
                  <span className="font-semibold mr-2">Trusted</span>
                  { signer.trusted ? <IconSvg name="check" className="size-6"/> : <IconSvg name="cross" className="size-6"/> }
                </div>
                <div className="flex items-center w-1/2">
                  <span className="font-semibold mr-2">Proof</span>
                  { signer.proof ? (
                    <div className="flex">
                      <HashStringShorten hash={ signer.proof }/>
                      <CopyToClipboard text={ signer.proof } className="ml-2"/>
                    </div>
                  ) : '-' }
                </div>
              </div>
            </div>
          )) }
        </div>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default ArbitrumL2TxnBatchDetailsAnyTrustDA;
