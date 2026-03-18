import mixpanel from 'mixpanel-browser';
import type { ChangeEvent } from 'react';
import React from 'react';

import config from 'configs/app';
import * as cookies from 'lib/cookies';
import useFeatureValue from 'lib/growthbook/useFeatureValue';
import useGradualIncrement from 'lib/hooks/useGradualIncrement';
import { useRollbar } from 'lib/rollbar';
import { Alert } from '@luxfi/ui/alert';
import { Button } from '@luxfi/ui/button';
import { Textarea } from '@luxfi/ui/textarea';
import { toaster } from '@luxfi/ui/toaster';
import PageTitle from 'ui/shared/Page/PageTitle';

const Login = () => {
  const rollbar = useRollbar();
  const [ num, setNum ] = useGradualIncrement(0);
  const testFeature = useFeatureValue('test_value', 'fallback');

  const [ isFormVisible, setFormVisibility ] = React.useState(false);
  const [ token, setToken ] = React.useState('');

  React.useEffect(() => {
    const token = cookies.get(cookies.NAMES.API_TOKEN);
    setFormVisibility(Boolean(!token && config.features.account.isEnabled));
    // throw new Error('Render error');
  }, []);

  const checkRollbar = React.useCallback(() => {
    rollbar?.error('Test error', { payload: 'foo' });
  }, [ rollbar ]);

  const checkMixpanel = React.useCallback(() => {
    mixpanel.track('Test event', { my_prop: 'foo bar' });
  }, []);

  const handleTokenChange = React.useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setToken(event.target.value);
  }, []);

  const handleSetTokenClick = React.useCallback(() => {
    cookies.set(cookies.NAMES.API_TOKEN, token);
    setToken('');
    toaster.create({
      title: 'Success 🥳',
      description: 'Successfully set cookie',
      type: 'success',
      onStatusChange: (details) => {
        if (details.status === 'unmounted') {
          setFormVisibility(false);
        }
      },
    });
  }, [ token ]);

  const handleNumIncrement = React.useCallback(() => {
    for (let index = 0; index < 5; index++) {
      setNum(5);
    }
  }, [ setNum ]);

  return (
    <div className="flex items-start max-w-[1000px] gap-4">
      <PageTitle title="Login page 😂"/>
      { isFormVisible && (
        <>
          <Alert
            status="warning"
            title="!!! Temporary solution for authentication on localhost !!!"
            inline={ false }
          >
            To Sign in go to production instance first, sign in there, copy obtained API token from cookie
            <code className="ml-1">{ cookies.NAMES.API_TOKEN }</code> and paste it in the form below. After submitting the form you should be successfully
            authenticated in current environment
          </Alert>
          <Textarea value={ token } onChange={ handleTokenChange } placeholder="API token"/>
          <Button onClick={ handleSetTokenClick }>Set cookie</Button>
        </>
      ) }
      <div className="flex gap-x-2">
        <Button className="bg-red-600 text-white hover:bg-red-500" onClick={ checkRollbar }>Check Rollbar</Button>
        <Button className="bg-teal-600 text-white hover:bg-teal-500" onClick={ checkMixpanel }>Check Mixpanel</Button>
      </div>
      <div className="flex items-center gap-x-2">
        <div className="text-center w-[50px]">{ num }</div>
        <Button onClick={ handleNumIncrement } size="sm">add</Button>
      </div>
      <div>Test feature value: <b>{ testFeature.isLoading ? 'loading...' : JSON.stringify(testFeature.value) }</b></div>
    </div>
  );

};

export default Login;
