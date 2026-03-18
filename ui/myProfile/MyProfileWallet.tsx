import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { UserInfo } from 'types/api/account';

import config from 'configs/app';
import { Button } from 'toolkit/chakra/button';
import { Heading } from 'toolkit/chakra/heading';
import { Link } from 'toolkit/chakra/link';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props {
  profileQuery: UseQueryResult<UserInfo, unknown>;
  onAddWallet: () => void;
}

const MyProfileWallet = ({ profileQuery, onAddWallet }: Props) => {

  return (
    <section>
      <Heading level="2" className="mb-3">My linked wallet</Heading>
      <span className="mb-3">
        This wallet address is used for login{ ' ' }
        { config.features.rewards.isEnabled && (
          <>
            and participation in the Merits Program.
            <Link external href="https://docs.blockscout.com/using-blockscout/merits" className="ml-1">
              Learn more
            </Link>
          </>
        ) }
      </span>
      { profileQuery.data?.address_hash ? (
        <div className="rounded px-3 py-[18px]">
          <AddressEntity
            address={{ hash: profileQuery.data.address_hash }}
            fontWeight="500"
            noAltHash
          />
        </div>
      ) : <Button size="sm" onClick={ onAddWallet }>Link wallet</Button> }
    </section>
  );
};

export default React.memo(MyProfileWallet);
