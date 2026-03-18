import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import React from 'react';

import config from 'configs/app';
import buildUrl from 'lib/api/buildUrl';
import 'graphiql/graphiql.css';
import useApiQuery from 'lib/api/useApiQuery';
import { useColorMode } from 'toolkit/chakra/color-mode';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import { ZERO_ADDRESS } from 'toolkit/utils/consts';
import { isBrowser } from 'toolkit/utils/isBrowser';

const feature = config.features.apiDocs;

const graphQLStyle = {
  '.graphiql-container': {
    backgroundColor: 'unset',
  },
};

const GraphQL = () => {

  const latestTxsQuery = useApiQuery('general:homepage_txs', {
    queryOptions: {
      enabled: feature.isEnabled,
    },
  });

  const { colorMode } = useColorMode();

  const graphqlTheme = window.localStorage.getItem('graphiql:theme');

  // colorModeState used as a key to re-render GraphiQL component after color mode change
  const [ colorModeState, setColorModeState ] = React.useState(graphqlTheme);

  React.useEffect(() => {
    if (isBrowser()) {
      if (graphqlTheme !== colorMode) {
        window.localStorage.setItem('graphiql:theme', colorMode);
        setColorModeState(colorMode);
      }
    }
  }, [ colorMode, graphqlTheme ]);

  if (!feature.isEnabled) {
    return null;
  }

  if (latestTxsQuery.isPending) {
    return <ContentLoader/>;
  }

  const latestTxHash = latestTxsQuery.data?.[0]?.hash;

  const initialQuery = latestTxHash ? `{
    transaction(
      hash: "${ latestTxHash }"
    ) {
      hash
      blockNumber
      value
      gasUsed
    }
  }` : `{
    address(
      hash: "${ ZERO_ADDRESS }"
    ) {
      hash
      fetchedCoinBalance
    }
  }`;

  const graphqlUrl = buildUrl('general:graphql');

  const fetcher = createGraphiQLFetcher({
    url: graphqlUrl,
    // graphql ws implementation with absinthe plugin is incompatible with graphiql-ws protocol
    // or the older one subscriptions-transport-ws
    // so we (@isstuev & @vbaranov) decided to configure playground without subscriptions
    // in case of any complaint consider reconfigure the graphql ws server with absinthe_graphql_ws package
    // subscriptionUrl: `wss://${config.app.host}/socket/`,
  });

  return (
    <div className="h-[100vh] overflow-x-scroll">
      <div className="h-[100vh] min-w-[900px]">
        <GraphiQL fetcher={ fetcher } defaultQuery={ initialQuery } key={ colorModeState }/>
      </div>
    </div>
  );
};

export default GraphQL;
