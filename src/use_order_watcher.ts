import { OrderEvent, OrderEventEndState, WSClient } from '@0x/mesh-rpc-client';
import { assetDataUtils, ERC20AssetData } from '@0x/order-utils';
import { compareDesc } from 'date-fns';
import { uniqBy } from 'lodash';
import { useState } from 'react';

import { logger } from './logger';
import { utils } from './utils';

const MESH_ENDPOINT = 'wss://mesh.api.0x.org';
const wsClient = new WSClient(MESH_ENDPOINT);

interface Asset {
  tokenAddress: string;
  tokenSymbol: string;
  amount: string;
}

export interface Order {
  state: OrderEventEndState;
  time: Date;
  orderHash: string;
  makerAsset: Asset;
  takerAsset: Asset;
}

const toOrder = async (orderEvent: OrderEvent): Promise<Order | undefined> => {
  let order;
  try {
    const makerAssetData: ERC20AssetData = assetDataUtils.decodeERC20AssetData(orderEvent.signedOrder.makerAssetData);
    const takerAssetData: ERC20AssetData = assetDataUtils.decodeERC20AssetData(orderEvent.signedOrder.takerAssetData);

    const [makerInfo, takerInfo] = await Promise.all([
      utils.getEthporerInfo(makerAssetData.tokenAddress),
      utils.getEthporerInfo(takerAssetData.tokenAddress),
    ]);

    const makerAsset: Asset = {
      amount: orderEvent.signedOrder.makerAssetAmount.div(10 ** makerInfo.decimals).toFixed(2),
      tokenAddress: makerInfo.address,
      tokenSymbol: makerInfo.symbol,
    };

    const takerAsset: Asset = {
      amount: orderEvent.signedOrder.takerAssetAmount.div(10 ** takerInfo.decimals).toFixed(2),
      tokenAddress: takerInfo.address,
      tokenSymbol: takerInfo.symbol,
    };

    order = {
      state: orderEvent.endState,
      time: new Date(),
      orderHash: orderEvent.orderHash,
      makerAsset,
      takerAsset,
    };
  } catch (e) {}

  return order;
};

export const useOrderWatcher = () => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const appendOrders = (newOrders: Order[]) => setAllOrders(prevOrders => prevOrders.concat(newOrders));

  if (!isSubscribed) {
    setIsSubscribed(true);

    const addOrders = async (orderEvents: OrderEvent[]) => {
      const orders = (await Promise.all(orderEvents.map(orderEvent => toOrder(orderEvent))).then(maybeOrders =>
        maybeOrders.filter(o => !!o),
      )) as Order[];

      appendOrders(orders.filter(o => [OrderEventEndState.Filled, OrderEventEndState.Added].includes(o.state)));
    };

    wsClient
      .subscribeToOrdersAsync(async (orderEvents: OrderEvent[]) => {
        await addOrders(orderEvents);
      })
      .catch(err => {
        logger(err);
      });
  }

  const sortedOrders = uniqBy(
    allOrders.sort((a, b) => compareDesc(a.time, b.time)),
    o => o.orderHash,
  );

  return { filledOrders: sortedOrders.filter(o => o.state === OrderEventEndState.Filled), allOrders: sortedOrders };
};
