import { pickBy } from 'es-toolkit';
import React from 'react';

import type { FormSubmitResult } from './types';

import { route } from 'nextjs-routes';

import { Alert } from 'toolkit/chakra/alert';
import { Button } from 'toolkit/chakra/button';
import { Heading } from 'toolkit/chakra/heading';
import { Link } from 'toolkit/chakra/link';
import { makePrettyLink } from 'toolkit/utils/url';

import PublicTagsSubmitResultSuccess from './result/PublicTagsSubmitResultSuccess';
import PublicTagsSubmitResultWithErrors from './result/PublicTagsSubmitResultWithErrors';
import { groupSubmitResult } from './utils';

interface Props {
  data: FormSubmitResult | undefined;
}

const PublicTagsSubmitResult = ({ data }: Props) => {
  const groupedData = React.useMemo(() => groupSubmitResult(data), [ data ]);

  if (!groupedData) {
    return null;
  }

  const hasErrors = groupedData.items.some((item) => item.error !== null);
  const companyWebsite = makePrettyLink(groupedData.companyWebsite);
  const startOverButtonQuery = hasErrors ? pickBy({
    requesterName: groupedData.requesterName,
    requesterEmail: groupedData.requesterEmail,
    companyName: groupedData.companyName,
    companyWebsite: groupedData.companyWebsite,
  }, Boolean) : undefined;

  return (
    <div>
      { !hasErrors && (
        <Alert status="success" className="mb-6">
          Success! All tags went into moderation pipeline and soon will appear in the explorer.
        </Alert>
      ) }

      <Heading level="2">Company info</Heading>
      <div className="grid gap-y-3 gap-x-6 mt-6" style={{ gridTemplateColumns: '170px 1fr' }}>
        <div>Your name</div>
        <div>{ groupedData.requesterName }</div>
        <div>Email</div>
        <div>{ groupedData.requesterEmail }</div>
        { groupedData.companyName && (
          <>
            <div>Company name</div>
            <div>{ groupedData.companyName }</div>
          </>
        ) }
        { companyWebsite && (
          <>
            <div>Company website</div>
            <div>
              <Link external href={ companyWebsite.href }>{ companyWebsite.domain }</Link>
            </div>
          </>
        ) }
      </div>

      <Heading level="2" className="mt-8 mb-5">Public tags/labels</Heading>
      { hasErrors ? <PublicTagsSubmitResultWithErrors data={ groupedData }/> : <PublicTagsSubmitResultSuccess data={ groupedData }/> }

      <div className="flex flex-col lg:flex-row gap-x-6 mt-8 gap-y-3">
        { hasErrors && (
          <Link href={ route({ pathname: '/public-tags/submit', query: startOverButtonQuery }) }>
            <Button variant="outline" className="w-full lg:w-auto">
              Start over
            </Button>
          </Link>
        ) }
        <Link href={ route({ pathname: '/public-tags/submit' }) }>
          <Button className="w-full lg:w-auto">Add new tag</Button>
        </Link>
      </div>
    </div>
  );
};

export default React.memo(PublicTagsSubmitResult);
