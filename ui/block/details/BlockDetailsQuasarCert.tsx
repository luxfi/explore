import React from 'react';

import type { QuasarCert } from 'types/api/block';

import { ndash } from 'toolkit/utils/htmlEntities';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';

interface Props {
  data: QuasarCert;
}

const BlockDetailsQuasarCert = ({ data }: Props) => {
  const hint = (
    <>
      Quasar triple consensus finality certificate.<br/><br/>
      Three independent cryptographic verification paths:<br/><br/>
      BLS (green) { ndash } BLS12-381 classical fast-path (ECDL hardness).<br/><br/>
      Ringtail (blue) { ndash } Ring-LWE 2-round threshold (Module-LWE hardness, post-quantum).<br/><br/>
      ML-DSA (purple) { ndash } ML-DSA-65 FIPS 204 identity proof (Module-LWE + Module-SIS hardness, post-quantum).<br/><br/>
      Validators { ndash } number of validators who signed. An adversary must break all three assumptions simultaneously.
    </>
  );

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ hint }
      >
        Quasar certificate
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue className="flex-wrap">
        <div className="flex gap-1 mb-2">
          <span className="inline-flex items-center rounded-full bg-green-500/10 text-green-400 px-2 py-0.5 text-xs font-medium">BLS</span>
          <span className="inline-flex items-center rounded-full bg-blue-500/10 text-blue-400 px-2 py-0.5 text-xs font-medium">Ringtail</span>
          <span className="inline-flex items-center rounded-full bg-purple-500/10 text-purple-400 px-2 py-0.5 text-xs font-medium">ML-DSA</span>
        </div>
        <div className="grid grid-cols-[min-content_1fr] gap-x-5 w-full mt-1 text-sm">
          <span className="font-semibold whitespace-nowrap">BLS aggregate</span>
          <span className="whitespace-pre-wrap break-words flex items-start">
            { data.bls }
            <CopyToClipboard text={ data.bls }/>
          </span>
          <DetailedInfo.ItemDivider className="my-2 col-span-2"/>
          <span className="font-semibold whitespace-nowrap">PQ proof</span>
          <span className="whitespace-pre-wrap break-words flex items-start">
            { data.pq_proof }
            <CopyToClipboard text={ data.pq_proof }/>
          </span>
          <DetailedInfo.ItemDivider className="my-2 col-span-2"/>
          <span className="font-semibold">Epoch</span>
          <span>{ data.epoch }</span>
          <DetailedInfo.ItemDivider className="my-2 col-span-2"/>
          <span className="font-semibold">Finality</span>
          <span>{ data.finality }</span>
          <DetailedInfo.ItemDivider className="my-2 col-span-2"/>
          <span className="font-semibold">Validators</span>
          <span>{ data.validators } validators proven</span>
        </div>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(BlockDetailsQuasarCert);
