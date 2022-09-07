import { Center, VStack, Box } from '@chakra-ui/react';
import type { NextPage, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import getAvailablePaths from 'lib/networks/getAvailablePaths';
import Page from 'ui/shared/Page/Page';

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <Page>
      <Center h="100%" fontSize={{ base: 'sm', lg: 'xl' }}>
        <VStack gap={ 4 }>
          <Box>
            <p>home page for { router.query.network_type } { router.query.network_sub_type } network</p>
          </Box>
        </VStack>
      </Center>
    </Page>
  );
};

export default Home;

export const getStaticPaths: GetStaticPaths = async() => {
  return { paths: getAvailablePaths(), fallback: false };
};

export const getStaticProps = async() => {
  return {
    props: {},
  };
};