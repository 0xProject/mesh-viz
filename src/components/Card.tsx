import React from 'react';
import { BoxProps, Flex, Text } from 'rebass';

import { colors } from '../theme';

export interface CardProps extends BoxProps {
  title?: string;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = props => {
  const { title, subtitle, ...boxProps } = props;
  return (
    <Flex justifyContent="start" m={4} bg={colors.greyBg} {...boxProps}>
      {title && <Text fontSize={24} p={3} color={colors.whiteText}>{title}</Text>}
      {subtitle && <Text>{subtitle}</Text>}
      {props.children}
    </Flex>
  );
};
