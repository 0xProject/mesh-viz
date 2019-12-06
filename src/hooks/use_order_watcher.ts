import { OrderEvent, OrderEventEndState, WSClient } from '@0x/mesh-rpc-client';
import { assetDataUtils, ERC20AssetData } from '@0x/order-utils';
import { compareDesc } from 'date-fns';
import { uniqBy } from 'lodash';
import { useState } from 'react';

import { logger } from '../logger';
import { utils } from '../utils';

const MESH_ENDPOINT_V2 = 'wss://mesh.backend.sra.0x.org';
const MESH_ENDPOINT_V3 = 'wss://mesh.api.0x.org';
const wsClientV2 = new WSClient(MESH_ENDPOINT_V2);
const wsClientV3 = new WSClient(MESH_ENDPOINT_V3);

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

const sortAndDedupe = (orders: Order[]) =>
  uniqBy(
    orders.sort((a, b) => compareDesc(a.time, b.time)),
    o => o.orderHash
  );

export const useOrderWatcher = () => {
  const [filledOrders, setFilledOrders] = useState<Order[]>([]);
  const [addedOrders, setAddedOrders] = useState<Order[]>([]);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  if (!isSubscribed) {
    setIsSubscribed(true);

    const addOrders = async (orderEvents: OrderEvent[]) => {
      const orders = (await Promise.all(orderEvents.map(orderEvent => toOrder(orderEvent))).then(maybeOrders =>
        maybeOrders.filter(o => !!o)
      )) as Order[];

      const newFilledOrders = orders.filter(o =>
        [OrderEventEndState.Filled, OrderEventEndState.FullyFilled].includes(o.state)
      );
      const newAddedOrders = orders.filter(o => o.state === OrderEventEndState.Added);

      setFilledOrders(oldFilledOrders => sortAndDedupe(oldFilledOrders.slice(0, 100).concat(newFilledOrders)));
      setAddedOrders(oldNewOrders => sortAndDedupe(oldNewOrders.slice(0, 100).concat(newAddedOrders)));
    };

    const handleErr = (err: Error) => {
      logger(err);
    };

    wsClientV3.subscribeToOrdersAsync(addOrders).catch(handleErr);
    wsClientV2.subscribeToOrdersAsync(addOrders).catch(handleErr);
  }

  return {
    filledOrders,
    addedOrders,
  };
};
