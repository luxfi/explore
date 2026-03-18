import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import { useSignMessage, useAccount, useSwitchChain } from 'wagmi';

import type {
  AddressVerificationFormSecondStepFields,
  AddressCheckStatusSuccess,
  AddressVerificationFormFirstStepFields,
  RootFields,
  AddressVerificationResponseError,
  AddressValidationResponseSuccess,
} from '../types';
import type { VerifiedAddress } from 'types/api/account';

import config from 'configs/app';
import { getEnvValue } from 'configs/app/utils';
import useApiFetch from 'lib/api/useApiFetch';
import shortenString from 'lib/shortenString';
import useWallet from 'lib/web3/useWallet';
import { Alert } from '@luxfi/ui/alert';
import { Button } from '@luxfi/ui/button';
import { Link } from 'toolkit/chakra/link';
import { Radio, RadioGroup } from '@luxfi/ui/radio';
import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';
import { SIGNATURE_REGEXP } from 'toolkit/components/forms/validators/signature';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import AdminSupportText from 'ui/shared/texts/AdminSupportText';

type Fields = RootFields & AddressVerificationFormSecondStepFields;

type SignMethod = 'wallet' | 'manual';

interface Props extends AddressVerificationFormFirstStepFields, AddressCheckStatusSuccess {
  onContinue: (newItem: VerifiedAddress, signMethod: SignMethod) => void;
  noWeb3Provider?: boolean;
}

const AddressVerificationStepSignature = ({ address, signingMessage, contractCreator, contractOwner, onContinue, noWeb3Provider }: Props) => {
  const [ signMethod, setSignMethod ] = React.useState<SignMethod>(noWeb3Provider ? 'manual' : 'wallet');

  const { isConnected } = useAccount();
  const { openModal: openWeb3Modal } = useWallet({ source: 'Smart contracts' });

  const formApi = useForm<Fields>({
    mode: 'onBlur',
    defaultValues: {
      message: signingMessage,
    },
  });
  const { handleSubmit, formState, setValue, getValues, setError, clearErrors, watch } = formApi;

  const apiFetch = useApiFetch();

  const signature = watch('signature');
  React.useEffect(() => {
    clearErrors('root');
  }, [ clearErrors, signature ]);

  const onFormSubmit: SubmitHandler<Fields> = React.useCallback(async(data) => {
    try {
      const body = {
        contractAddress: address,
        message: data.message,
        signature: data.signature,
      };

      const response = await apiFetch<'contractInfo:address_verification', AddressValidationResponseSuccess, AddressVerificationResponseError>(
        'contractInfo:address_verification',
        {
          fetchParams: { method: 'POST', body },
          pathParams: { chainId: config.chain.id, type: ':verify' },
        },
      );

      if (response.status !== 'SUCCESS') {
        const type = typeof response.status === 'number' ? 'UNKNOWN_STATUS' : response.status;
        return setError('root', { type, message: response.status === 'INVALID_SIGNER_ERROR' ? response.invalidSigner.signer : undefined });
      }

      onContinue(response.result.verifiedAddress, signMethod);
    } catch (error) {
      setError('root', { type: 'UNKNOWN_STATUS' });
    }
  }, [ address, apiFetch, onContinue, setError, signMethod ]);

  const onSubmit = handleSubmit(onFormSubmit);

  const { signMessage, isPending: isSigning } = useSignMessage();
  const { switchChainAsync } = useSwitchChain();

  const handleSignMethodChange = React.useCallback(({ value }: { value: string | null }) => {
    if (!value) {
      return;
    }

    setSignMethod(value as SignMethod);
    clearErrors('root');
  }, [ clearErrors ]);

  const handleOpenWeb3Modal = React.useCallback(() => {
    clearErrors('root');
    openWeb3Modal();
  }, [ clearErrors, openWeb3Modal ]);

  const handleWeb3SignClick = React.useCallback(async() => {
    clearErrors('root');

    if (!isConnected) {
      return setError('root', { type: 'manual', message: 'Please connect to your Web3 wallet first' });
    }

    await switchChainAsync({ chainId: Number(config.chain.id) });
    const message = getValues('message');
    signMessage({ message }, {
      onSuccess: (data) => {
        setValue('signature', data);
        onSubmit();
      },
      onError: (error) => {
        return setError('root', { type: 'SIGNING_FAIL', message: (error as Error)?.message || 'Oops! Something went wrong' });
      },
    });
  }, [ clearErrors, isConnected, getValues, signMessage, setError, setValue, onSubmit, switchChainAsync ]);

  const handleManualSignClick = React.useCallback(() => {
    clearErrors('root');
    onSubmit();
  }, [ clearErrors, onSubmit ]);

  const button = (() => {
    if (signMethod === 'manual') {
      return (
        <Button
          onClick={ handleManualSignClick }
          loading={ formState.isSubmitting }
          loadingText="Verifying"
        >
          Verify
        </Button>
      );
    }

    return (
      <Button
        onClick={ isConnected ? handleWeb3SignClick : handleOpenWeb3Modal }
        loading={ formState.isSubmitting || isSigning }
        loadingText={ isSigning ? 'Signing' : 'Verifying' }
      >
        { isConnected ? 'Sign and verify' : 'Connect wallet' }
      </Button>
    );
  })();

  const supportUrl = getEnvValue('NEXT_PUBLIC_NETWORK_SUPPORT_URL') || 'mailto:support@blockscout.com';
  const supportLabel = supportUrl.startsWith('mailto:') ? supportUrl.replace('mailto:', '') : 'support';
  const contactUsLink = <span>contact us <Link href={ supportUrl } rel="noopener noreferrer">{ supportLabel }</Link></span>;

  const rootError = (() => {
    switch (formState.errors.root?.type) {
      case 'INVALID_SIGNATURE_ERROR': {
        return <span>The signature could not be processed.</span>;
      }
      case 'VALIDITY_EXPIRED_ERROR': {
        return <span>This verification message has expired. Add the contract address to restart the process.</span>;
      }
      case 'SIGNING_FAIL': {
        return <span>{ formState.errors.root.message }</span>;
      }
      case 'INVALID_SIGNER_ERROR': {
        const signer = shortenString(formState.errors.root.message || '');
        const expectedSigners = [ contractCreator, contractOwner ].filter(Boolean).map(s => shortenString(s)).join(', ');
        return (
          <div>
            <span>This address </span>
            <span>{ signer }</span>
            <span> is not a creator/owner of the requested contract and cannot claim ownership. Only </span>
            <span>{ expectedSigners }</span>
            <span> can verify ownership of this contract.</span>
          </div>
        );
      }
      case 'UNKNOWN_STATUS': {
        return (
          <div>
            <span>We are not able to process the verify account ownership for this contract address. Kindly </span>
            { contactUsLink }
            <span> for further assistance.</span>
          </div>
        );
      }
      case undefined: {
        return null;
      }
    }
  })();

  return (
    <FormProvider { ...formApi }>
      <form noValidate onSubmit={ onSubmit }>
        { rootError && <Alert status="warning" className="mb-6">{ rootError }</Alert> }
        <div className="mb-8">
          <span>Please select the address to sign and copy the message and sign it using the explorer message provider of your choice. </span>
          <Link href="https://docs.blockscout.com/using-blockscout/my-account/verified-addresses/copy-and-sign-message" external noIcon>
            Additional instructions
          </Link>
          <span>. If you do not see your address here but are sure that you are the owner of the contract, kindly </span>
          { contactUsLink }
          <span> for further assistance.</span>
        </div>
        { (contractOwner || contractCreator) && (
          <div className="flex flex-col gap-y-4 mb-4">
            { contractCreator && (
              <div>
                <span className="font-semibold">Contract creator: </span>
                <span>{ contractCreator }</span>
              </div>
            ) }
            { contractOwner && (
              <div>
                <span className="font-semibold">Contract owner: </span>
                <span>{ contractOwner }</span>
              </div>
            ) }
          </div>
        ) }
        <div className="flex flex-col gap-y-5">
          <div className="flex flex-col">
            <CopyToClipboard text={ signingMessage } className="ml-auto"/>
            <FormFieldText<Fields>
              name="message"
              placeholder="Message to sign"
              required
              asComponent="Textarea"
              readOnly
              inputProps={{
                className: 'h-[175px] lg:h-[100px] min-h-auto',
              }}
            />
          </div>
          { !noWeb3Provider && (
            <RadioGroup
              onValueChange={ handleSignMethodChange }
              value={ signMethod }
              className="flex flex-col gap-y-4"
            >
              <Radio value="wallet">Sign via Web3 wallet</Radio>
              <Radio value="manual">Sign manually</Radio>
            </RadioGroup>
          ) }
          { signMethod === 'manual' && (
            <FormFieldText<Fields>
              name="signature"
              placeholder="Signature hash"
              required
              rules={{ pattern: SIGNATURE_REGEXP }}
              bgColor="dialog.bg"
            />
          ) }
        </div>
        <div className="flex gap-x-5 gap-y-2 mt-8 flex-col lg:flex-row items-start lg:items-center">
          { button }
          <AdminSupportText/>
        </div>
      </form>
    </FormProvider>
  );
};

export default React.memo(AddressVerificationStepSignature);
