import React from 'react';
import { Flex, Text } from 'rebass';

import { colors } from '../theme';

import { MeshLogo } from './MeshLogo';

export const Navigation: React.FC = () => (
  <Flex px={3} py={3} color="0x Mesh Network" bg={colors.black} alignItems="center">
    <MeshLogo />
    <Text ml={2} p={2} color={colors.whiteText} fontSize={32}>
      0x Mesh Network
    </Text>
  </Flex>
);
