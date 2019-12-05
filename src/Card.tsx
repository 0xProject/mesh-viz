import React from 'react';
import { BoxProps, Flex } from 'rebass';

import { colors } from './theme';

export interface CardProps extends BoxProps {
  title?: string;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = props => {
  const { title, subtitle, ...boxProps } = props;
  return (
    <Flex justifyContent="center" m={4} bg={colors.greyBg} {...boxProps}>
      {props.children}
    </Flex>
  );
};
