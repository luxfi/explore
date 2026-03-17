import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import { Link } from 'toolkit/chakra/link';

const RpcApi = () => {
  return (
    <Box>
      <Text>
        This API is provided for developers building applications on Lux Network requiring general API and data support.
        It supports GET and POST requests.
      </Text>
      <Link href="https://docs.lux.network/api/rpc" external className="mt-6">View modules</Link>
    </Box>
  );
};

export default React.memo(RpcApi);
