import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useInterval } from 'react-use';
import { Box, Flex, Text } from 'rebass';
import styled from 'styled-components';

import { backendClient, backendWebSocketClient } from '../backend_client';
import { DATA_POLL_DELAY_MS } from '../constants';
import { useOrderWatcher } from '../hooks/use_order_watcher';
import { logger } from '../logger';
import { sraV2Client, sraV3Client } from '../sra_client';
import { ReactComponent as ActiveNodesSvg } from '../svgs/computing-cloud.svg';
import { ReactComponent as ConnectionsSvg } from '../svgs/modeling.svg';
import { ReactComponent as OrderbookSvg } from '../svgs/order-book-thing.svg';
import { ReactComponent as XIconSvg } from '../svgs/x.svg';
import { colors } from '../theme';
import { MeshOrderRecievedMessage, VizceralTraffic } from '../types';
import { utils } from '../utils';

import { Card } from './Card';
import { Footer } from './Footer';
import { Navigation } from './Navigation';
import { Vizceral } from './Vizceral';

const baseTraffic: VizceralTraffic = {
  // Which graph renderer to use for this graph (currently only 'global' and 'region')
  renderer: 'region',
  // since the root object is a node, it has a name too.
  name: 'Mesh Network',
  // OPTIONAL: The maximum volume seen recently to relatively measure particle density. This 'global' maxVolume is optional because it can be calculated by using all of the required sub-node maxVolumes.
  maxVolume: 100000,
  // list of nodes for this graph
  nodes: [],
  // list of edges for this graph
  connections: [],
};

const AppContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  max-height: 100vh;
  max-width: 100vw;
  padding-left: 32px;
  padding-right: 32px;
`;

const Main = styled.main`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

const GraphContainer = styled.div`
  background-color: ${colors.greyBg};
  display: flex;
  flex: 1;
  flex-direction: row;
  margin-left: 20px;
`;

const GraphHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100px;
  flex-direction: row;
  color: #fff;
  width: 100%;
  border-bottom: 2px solid #2e2e2e;
  padding-top: 20px;
  padding-bottom: 8px;
  padding-left: 20px;
`;

const GraphHeaderMetricsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const GraphHeaderStatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 24px;
`;

const StatusCircle = styled.div`
  background-color: ${colors.zeroExGreen};
  border-radius: 100%;
  height: 16px;
  width: 16px;
  margin-right: 12px;
`;

const StatusLabel = styled.div`
  font-size: 16px;
  color: ${colors.whiteText};
`;

const HeaderVerticalDivider = styled.div`
  height: 100%;
  width: 2px;
  background-color: #2b2b2b;
  margin-right: 24px;
`;

const GraphHeaderMetricContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 8px;
  margin-right: 24px;
`;

const GraphHeaderMetricLabel = styled.div`
  color: ${colors.secondaryText};
  font-size: 18px;
  padding-bottom: 10px;
`;

const GraphHeaderMetricValue = styled.div`
  color: ${colors.whiteText};
  font-size: 24px;
`;

const HeaderMetricDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 16px;
`;

const MainGraphPanelContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  position: relative;
`;

// todo(jj) Figure out how to do container ratio better w/out max height ?
// works for now...
const VizceralContainer = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  max-height: 80%;
  padding: 0 16px;
  padding-right: 120px;
`;

const SidePanelContainer = styled.div`
  background-color: #000;
  opacity: 0.8;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 220px;
  border: 2px solid #2e2e2e;
  border-top: none;
`;

const SidePanelHeaderContainer = styled.div`
  display: flex;
  height: 100px;
  border-bottom: 2px solid #2e2e2e;
  flex-direction: row;
  padding: 0 16px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const LineGraphContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SidePanelHeaderLabel = styled.div`
  font-size: 24px;
  color: ${colors.whiteText};
`;

const SidePanelHeaderSecondaryLabel = styled.div`
  font-size: 24px;
  cursor: pointer;
  color: ${colors.secondaryText};
  transition: 0.2s color;
  :hover {
    color: ${colors.zeroExGreen};
  }
`;

const Table = styled.table`
  width: calc(100% - 32px);
  color: #fff;
  margin: 10px 16px;
  box-sizing: border-box;
  max-height: 400px;
  overflow-y: auto;
`;

const TableHeaderRow = styled.tr`
  border-bottom: 2px solid #2e2e2e;
`;

const RecentTrandeTableDataRow = styled.tr`
  margin-bottom: 8px;
  margin-top: 8px;
`;

const TableHeaderItem = styled.th`
  padding-top: 8px;
  margin-bottom: 8px;
  box-sizing: border-box;
  height: 30px;
  padding: 10px 0;
  text-align: left;
`;

const TableDataItem = styled.td`
  margin-bottom: 8px;
  margin-top: 8px;
  height: 30px;
  padding-top: 10px;
`;

const NodeDetailPanelContainer = styled.div`
  padding-left: 28px;
`;

const NodeDetailPanelTitle = styled.div`
  font-size: 24px;
  color: ${colors.whiteText};
  padding-top: 42px;
  margin-bottom: 40px;
`;

const NodeDetailLabel = styled.div`
  margin-bottom: 10px;
  color: ${colors.secondaryText};
  font-size: 18px;
`;

const NodeDetailValue = styled.div`
  margin-bottom: 28px;
  color: ${colors.whiteText};
  font-size: 24px;
`;

const XIconContainer = styled.div`
  position: absolute;
  right: 0;
  padding: 16px;
  top: 0;
  cursor: pointer;
`;

const TokenIcon = styled.img`
  height: 24px;
  & + & {
    margin-left: 5px;
  }
`;

export const App: React.FC = () => {
  const [openOrderCount, setOpenOrderCount] = useState<number | undefined>(undefined);
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined);
  const [meshEvents, setMeshEvents] = useState<MeshOrderRecievedMessage[]>([]);
  // tslint:disable-next-line: boolean-naming
  const [userOverrideNodePanel, setUserOverrideNodePanel] = useState<boolean>(false);

  const handleNodeClick = (clickNodeEvent: any | undefined) => {
    if (!clickNodeEvent) {
      // Implies a blur
      return setSelectedNodeId(undefined);
    }
    setUserOverrideNodePanel(false);
    setSelectedNodeId(clickNodeEvent.name);
  };

  const [traffic, setTraffic] = useState<VizceralTraffic>(baseTraffic);
  const [selectedNode] = selectedNodeId ? traffic.nodes.filter(x => x.name === selectedNodeId) : [];

  useInterval(() => {
    const fetchAndSetDataAsync = async () => {
      const [graph, v3orderCount, v2orderCount] = await Promise.all([
        backendClient.getVizsceralGraphAsync(),
        sraV3Client.getOpenOrderCountAsync(),
        sraV2Client.getOpenOrderCountAsync(),
      ]);
      setTraffic({
        ...baseTraffic,
        ...graph,
      });
      setOpenOrderCount(v3orderCount + v2orderCount);
    };
    // tslint:disable-next-line:no-floating-promises
    fetchAndSetDataAsync();
  }, DATA_POLL_DELAY_MS);

  useEffect(() => {
    backendWebSocketClient.onmessage = msg => {
      const data = JSON.parse(msg.data);
      if (data.name === 'NEW_MESH_ORDER_RECEIVED') {
        const orderReceivedMessage: MeshOrderRecievedMessage = data;
        setMeshEvents(prevMeshEvents => {
          return [...prevMeshEvents, orderReceivedMessage];
        });
      }
    };
  }, []);

  let connectionCount;
  let activeNodes;
  if (traffic && traffic.nodes.length) {
    connectionCount = traffic.connections.length;
    activeNodes = traffic.nodes.length;
  }

  const { filledOrders, addedOrders } = useOrderWatcher();
  return (
    <AppContainer>
      <Navigation />
      <Main>
        <Flex overflowY={'auto'} style={{ flexBasis: 370 }} flexDirection={'column'}>
          {/* <Card title="trades" subtitle="last 24 hours">
            <LineGraphContainer>
              <LineGraphWithTooltip
                width={370}
                height={200}
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
              />
            </LineGraphContainer>
          </Card> */}

          <Card height={325} overflowY={'auto'} title="mesh event stream">
            <Table>
              <TableHeaderRow>
                <TableHeaderItem>From</TableHeaderItem>
                <TableHeaderItem>To</TableHeaderItem>
                <TableHeaderItem>Order Hash</TableHeaderItem>
              </TableHeaderRow>
              {meshEvents.map(({ payload }) => {
                return (
                  <RecentTrandeTableDataRow key={`${payload.from}-${payload.to}-${payload.orderHash}`}>
                    <TableDataItem>{utils.truncateString(payload.from)}</TableDataItem>
                    <TableDataItem>{utils.truncateString(payload.to)}</TableDataItem>
                    <TableDataItem>{utils.truncateString(payload.orderHash)}</TableDataItem>
                  </RecentTrandeTableDataRow>
                );
              })}
            </Table>
          </Card>

          <Card height={325} overflowY={'auto'} title="new orders">
            <Box margin={10}>
              {addedOrders.slice(0, 7).map(order => (
                <Flex key={order.orderHash} flexDirection="row" alignItems="center">
                  <Flex flexDirection="row" padding={10}>
                    <TokenIcon
                      src={utils.getTokenIconPath(order.makerAsset.tokenSymbol)}
                      onError={(ev: any) => {
                        ev.target.src = utils.getTokenIconPath('fallback');
                      }}
                    />
                    <TokenIcon
                      src={utils.getTokenIconPath(order.takerAsset.tokenSymbol)}
                      onError={(ev: any) => {
                        ev.target.src = utils.getTokenIconPath('fallback');
                      }}
                    />
                  </Flex>
                  <Box>
                    <Text
                      color={colors.whiteText}
                    >{`${order.makerAsset.amount} ${order.makerAsset.tokenSymbol} for ${order.takerAsset.amount} ${order.takerAsset.tokenSymbol}`}</Text>

                    <Text marginTop="5px" color={colors.secondaryText}>
                      {format(order.time, 'dd/MM h:mm:ss')}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </Box>
          </Card>

          <Card height={325} mb={0} overflowY={'auto'} title="recent completed trades" subtitle="last 24 hours">
            <Table>
              <TableHeaderRow>
                <TableHeaderItem>Maker</TableHeaderItem>
                <TableHeaderItem>Taker</TableHeaderItem>
                <TableHeaderItem>Time</TableHeaderItem>
              </TableHeaderRow>
              {filledOrders.map(trade => {
                return (
                  <RecentTrandeTableDataRow key={trade.orderHash}>
                    <TableDataItem>
                      {trade.makerAsset.amount} {trade.makerAsset.tokenSymbol}
                    </TableDataItem>
                    <TableDataItem>
                      {trade.takerAsset.amount} {trade.takerAsset.tokenSymbol}
                    </TableDataItem>
                    <TableDataItem>{format(trade.time, 'h:mm:ss')}</TableDataItem>
                  </RecentTrandeTableDataRow>
                );
              })}
            </Table>
          </Card>
          {/* <Card title="volume" subtitle="last 24 hours">
            <LineGraphContainer>
              <LineGraphWithTooltip
                width={370}
                height={200}
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
              />
            </LineGraphContainer>
          </Card> */}
        </Flex>
        <GraphContainer>
          <MainGraphPanelContainer>
            <GraphHeaderContainer>
              <GraphHeaderMetricsContainer>
                <GraphHeaderMetricContainer>
                  <ActiveNodesSvg fill="#fff" width={40} height={40} />
                  <HeaderMetricDataContainer>
                    <GraphHeaderMetricLabel>active nodes</GraphHeaderMetricLabel>
                    <GraphHeaderMetricValue>{activeNodes ? activeNodes.toLocaleString() : '-'}</GraphHeaderMetricValue>
                  </HeaderMetricDataContainer>
                </GraphHeaderMetricContainer>
                <HeaderVerticalDivider />
                <GraphHeaderMetricContainer>
                  <ConnectionsSvg fill={'#fff'} width={40} height={40} />
                  <HeaderMetricDataContainer>
                    <GraphHeaderMetricLabel>connections</GraphHeaderMetricLabel>
                    <GraphHeaderMetricValue>
                      {connectionCount ? connectionCount.toLocaleString() : '-'}
                    </GraphHeaderMetricValue>
                  </HeaderMetricDataContainer>
                </GraphHeaderMetricContainer>
                <HeaderVerticalDivider />
                <GraphHeaderMetricContainer>
                  <OrderbookSvg fill="#fff" width={40} height={40} />
                  <HeaderMetricDataContainer>
                    <GraphHeaderMetricLabel>open orders</GraphHeaderMetricLabel>
                    <GraphHeaderMetricValue>
                      {openOrderCount ? openOrderCount.toLocaleString() : '-'}
                    </GraphHeaderMetricValue>
                  </HeaderMetricDataContainer>
                </GraphHeaderMetricContainer>
              </GraphHeaderMetricsContainer>
              <GraphHeaderStatusContainer>
                <StatusCircle />
                <StatusLabel>All systems operational</StatusLabel>
              </GraphHeaderStatusContainer>
            </GraphHeaderContainer>
            <VizceralContainer>
              {traffic.nodes.length > 0 && (
                // Hack updating traffic does not work at the moment
                <Vizceral
                  traffic={traffic}
                  viewChanged={logger.bind(logger, 'viewChanged')}
                  viewUpdated={logger.bind(logger, 'viewUpdated')}
                  objectHighlighted={(e: any) => handleNodeClick(e)}
                />
              )}
              <SidePanelContainer>
                {selectedNode && !userOverrideNodePanel ? (
                  <NodeDetailPanelContainer>
                    <XIconContainer onClick={() => setUserOverrideNodePanel(true)}>
                      <XIconSvg />
                    </XIconContainer>
                    <NodeDetailPanelTitle>Node {selectedNode.displayName || selectedNodeId}</NodeDetailPanelTitle>
                    {selectedNode.metadata && (
                      <>
                        <NodeDetailLabel>order count</NodeDetailLabel>
                        <NodeDetailValue>{selectedNode.metadata.numOrders_number || 'n/a'}</NodeDetailValue>
                        <NodeDetailLabel>peer count</NodeDetailLabel>
                        <NodeDetailValue>{selectedNode.metadata.numPeers_number || 'n/a'}</NodeDetailValue>
                        <NodeDetailLabel>ip</NodeDetailLabel>
                        <NodeDetailValue>{selectedNode.metadata.ip || 'n/a'}</NodeDetailValue>
                        <NodeDetailLabel>location</NodeDetailLabel>
                        <NodeDetailValue>
                          {selectedNode.metadata.geo.city
                            ? `${selectedNode.metadata.geo.city}, ${selectedNode.metadata.geo.country}`
                            : selectedNode.metadata.geo.country
                            ? selectedNode.metadata.geo.country
                            : 'N/A'}
                        </NodeDetailValue>
                      </>
                    )}
                  </NodeDetailPanelContainer>
                ) : null}
              </SidePanelContainer>
            </VizceralContainer>
          </MainGraphPanelContainer>
        </GraphContainer>
      </Main>
      <Footer />
    </AppContainer>
  );
};
