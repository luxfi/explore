import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { VALIDATOR_ZILLIQA } from 'stubs/validators';
import TextAd from 'ui/shared/ad/TextAd';
import ValidatorEntity from 'ui/shared/entities/validator/ValidatorEntity';
import PageTitle from 'ui/shared/Page/PageTitle';
import ValidatorDetails from 'ui/validators/zilliqa/ValidatorDetails';

const ValidatorZilliqa = () => {
  const router = useRouter();
  const blsPublicKey = getQueryParamString(router.query.id);

  const query = useApiQuery('general:validator_zilliqa', {
    pathParams: { bls_public_key: blsPublicKey },
    queryOptions: {
      placeholderData: VALIDATOR_ZILLIQA,
    },
  });

  throwOnResourceLoadError(query);

  const isLoading = query.isPlaceholderData;

  const titleSecondRow = (
    <div className="flex items-center w-full gap-x-3 gap-y-3 flex-wrap lg:flex-nowrap">
      <ValidatorEntity
        id={ query.data?.bls_public_key ?? '' }
        isLoading={ isLoading }
        variant="subheading"
        noLink
      />
    </div>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle title="Validator details" secondRow={ titleSecondRow }/>
      { query.data && <ValidatorDetails data={ query.data } isLoading={ isLoading }/> }
    </>
  );
};

export default ValidatorZilliqa;
