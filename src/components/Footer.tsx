import React from 'react';
import { Flex } from 'rebass';

import { colors } from '../theme';

import { PoweredByZeroEx } from './ZeroExLogo';

export const Footer: React.FC = () => (
  <Flex px={3} py={3} bg={colors.black} alignItems="center" justifyContent="center">
    <PoweredByZeroEx />
  </Flex>
);
