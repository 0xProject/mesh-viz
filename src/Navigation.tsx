import React from 'react';
import { Flex, Text } from 'rebass';

export const Navigation: React.FC = () => (
  <Flex px={3} py={3} color="0x Mesh Network" bg="black" alignItems="center">
    <Text p={2} color="white" fontSize={32}>
      0x Mesh Network
    </Text>
  </Flex>
);
