import { useRouter } from 'next/router';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';

import type { FormFields, FormSubmitResult } from './types';
import type { UserInfo } from 'types/api/account';
import type { PublicTagTypesResponse } from 'types/api/addressMetadata';

import appConfig from 'configs/app';
import useApiFetch from 'lib/api/useApiFetch';
import getErrorObj from 'lib/errors/getErrorObj';
import getErrorObjPayload from 'lib/errors/getErrorObjPayload';
import useIsMobile from 'lib/hooks/useIsMobile';
import { Button } from '@luxfi/ui/button';
import { Heading } from '@luxfi/ui/heading';
import { FormFieldEmail } from 'toolkit/components/forms/fields/FormFieldEmail';
import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';
import { FormFieldUrl } from 'toolkit/components/forms/fields/FormFieldUrl';
import { Hint } from 'toolkit/components/Hint/Hint';
import ReCaptcha from 'ui/shared/reCaptcha/ReCaptcha';
import useReCaptcha from 'ui/shared/reCaptcha/useReCaptcha';

import PublicTagsSubmitFieldAddresses from './fields/PublicTagsSubmitFieldAddresses';
import PublicTagsSubmitFieldTags from './fields/PublicTagsSubmitFieldTags';
import { convertFormDataToRequestsBody, getFormDefaultValues } from './utils';

interface Props {
  config?: PublicTagTypesResponse | undefined;
  userInfo?: UserInfo | undefined;
  onSubmitResult: (result: FormSubmitResult) => void;
}

const PublicTagsSubmitForm = ({ config, userInfo, onSubmitResult }: Props) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const apiFetch = useApiFetch();
  const recaptcha = useReCaptcha();

  const formApi = useForm<FormFields>({
    mode: 'onBlur',
    defaultValues: getFormDefaultValues(router.query, userInfo),
  });

  React.useEffect(() => {
    if (
      router.query.addresses ||
      router.query.requesterName ||
      router.query.requesterEmail ||
      router.query.companyName ||
      router.query.companyWebsite
    ) {
      router.replace({ pathname: '/public-tags/submit' }, undefined, { shallow: true });
    }
  }, [ router ]);

  const onFormSubmit: SubmitHandler<FormFields> = React.useCallback(async(data) => {

    const token = await recaptcha.executeAsync();

    if (!token) {
      throw new Error('ReCaptcha is not solved');
    }

    const requestsBody = convertFormDataToRequestsBody(data);

    const result = await Promise.all(requestsBody.map(async(body) => {
      return apiFetch<'admin:public_tag_application', unknown, { message: string }>(
        'admin:public_tag_application', {
          pathParams: { chainId: appConfig.chain.id },
          fetchParams: {
            method: 'POST',
            body: { submission: body },
            headers: {
              'recaptcha-v2-response': token,
            },
          },
        })
        .then(() => ({ error: null, payload: body }))
        .catch((error: unknown) => {
          const errorObj = getErrorObj(error);
          const messageFromPayload = getErrorObjPayload<{ message?: string }>(errorObj)?.message;
          const messageFromError = errorObj && 'message' in errorObj && typeof errorObj.message === 'string' ? errorObj.message : undefined;
          const message = messageFromPayload || messageFromError || 'Something went wrong.';
          return { error: message, payload: body };
        });
    }));

    onSubmitResult(result);
  }, [ apiFetch, onSubmitResult, recaptcha ]);

  if (!appConfig.services.reCaptchaV2.siteKey) {
    return null;
  }

  return (
    <FormProvider { ...formApi }>
      <form
        noValidate
        onSubmit={ formApi.handleSubmit(onFormSubmit) }
      >
        <div className="grid gap-3 grid-cols-1 lg:grid-cols-[1fr_1fr_minmax(0,200px)] xl:grid-cols-[1fr_1fr_minmax(0,250px)]">
          <div className="col-span-1 lg:col-span-3">
            <Heading level="2">
              Company info
            </Heading>
          </div>
          <FormFieldText<FormFields> name="requesterName" required placeholder="Your name"/>
          <FormFieldEmail<FormFields> name="requesterEmail" required/>

          { !isMobile && <div/> }
          <FormFieldText<FormFields> name="companyName" placeholder="Company name"/>
          <FormFieldUrl<FormFields> name="companyWebsite" placeholder="Company website"/>
          { !isMobile && <div/> }

          <div className="col-span-1 lg:col-span-3 mt-3 lg:mt-5">
            <Heading level="2" className="flex items-center gap-1">
              Public tags/labels
              <Hint label="Submit a public tag proposal for our moderation team to review"/>
            </Heading>
          </div>
          <PublicTagsSubmitFieldAddresses/>
          <PublicTagsSubmitFieldTags tagTypes={ config?.tagTypes }/>
          <div className="col-span-1 lg:col-span-2">
            <FormFieldText<FormFields>
              name="description"
              required
              placeholder={
                isMobile ?
                  'Confirm the connection between addresses and tags' :
                  'Provide a comment to confirm the connection between addresses and tags (max 500 characters)'
              }
              rules={{ maxLength: 500 }}
              asComponent="Textarea"
              size="2xl"
              className="max-h-[160px]"
            />
          </div>

          <div className="col-span-1 lg:col-span-2">
            <ReCaptcha { ...recaptcha }/>
          </div>
          { !isMobile && <div/> }

          <Button
            variant="solid"
            type="submit"
            className="mt-3 w-min"
            loading={ formApi.formState.isSubmitting }
            loadingText="Send request"
            disabled={ recaptcha.isInitError }
          >
            Send request
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default React.memo(PublicTagsSubmitForm);
