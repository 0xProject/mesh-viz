import { BaseStyles } from '@nice-boys/components';
import React, { useEffect, useState } from 'react';
import { Flex } from 'rebass';
import styled from 'styled-components';

import { backendClient } from '../backend_client';
import { logger } from '../logger';
import { ReactComponent as ActiveNodesSvg } from '../svgs/computing-cloud.svg';
import { colors } from '../theme';
import { VizceralTraffic } from '../types';

import { Card } from './Card';
import { Footer } from './Footer';
import { LineGraphWithTooltip } from './LineGraph';
import { Navigation } from './Navigation';
import Vizceral from './vizceral-react/vizceral';
import './vizceral-react/vizceral.css';

const baseTraffic: VizceralTraffic = {
  // Which graph renderer to use for this graph (currently only 'global' and 'region')
  renderer: 'region',
  // since the root object is a node, it has a name too.
  name: 'Mesh Network',
  // OPTIONAL: The maximum volume seen recently to relatively measure particle density. This 'global' maxVolume is optional because it can be calculated by using all of the required sub-node maxVolumes.
  maxVolume: 100000,
  // list of nodes for this graph
  nodes: [],
  connections: [],
  // nodes: [
  //   {
  //     name: 'mesh-node-1',
  //     // OPTIONAL Override the name on the label
  //     displayName: 'mesh-node-1',
  //     //  The class of the node. will default to 'normal' if not provided. The coloring of the UI is based on 'normal', 'warning', and 'danger', so if you want to match the UI coloring, use those class names. Any class you provide will expect to have a style 'colorClassName' available, e.g. if the class is 'fuzzy', you should also call 'vizceral.updateStyles({ colorTraffic: { fuzzy: '#aaaaaa' } })'
  //     class: 'normal',
  //     // OPTIONAL Any data that may be handled by a plugin or other data that isn't important to vizceral itself (if you want to show stuff on the page that contains vizceral, for example). Since it is completely optional and not handled by vizceral, you technically could use any index, but this is the convention we use.
  //     metadata: {},
  //   },
  //   {
  //     name: 'mesh-node-2',
  //     // OPTIONAL Override the name on the label
  //     displayName: 'mesh-node-2',
  //     //  The class of the node. will default to 'normal' if not provided. The coloring of the UI is based on 'normal', 'warning', and 'danger', so if you want to match the UI coloring, use those class names. Any class you provide will expect to have a style 'colorClassName' available, e.g. if the class is 'fuzzy', you should also call 'vizceral.updateStyles({ colorTraffic: { fuzzy: '#aaaaaa' } })'
  //     class: 'normal',
  //     // OPTIONAL Any data that may be handled by a plugin or other data that isn't important to vizceral itself (if you want to show stuff on the page that contains vizceral, for example). Since it is completely optional and not handled by vizceral, you technically could use any index, but this is the convention we use.
  //     metadata: {},
  //   },
  //   {
  //     name: 'mesh-node-3',
  //     // OPTIONAL Override the name on the label
  //     displayName: 'mesh-node-3',
  //     //  The class of the node. will default to 'normal' if not provided. The coloring of the UI is based on 'normal', 'warning', and 'danger', so if you want to match the UI coloring, use those class names. Any class you provide will expect to have a style 'colorClassName' available, e.g. if the class is 'fuzzy', you should also call 'vizceral.updateStyles({ colorTraffic: { fuzzy: '#aaaaaa' } })'
  //     class: 'normal',
  //     // OPTIONAL Any data that may be handled by a plugin or other data that isn't important to vizceral itself (if you want to show stuff on the page that contains vizceral, for example). Since it is completely optional and not handled by vizceral, you technically could use any index, but this is the convention we use.
  //     metadata: {},
  //   },
  //   {
  //     name: 'mesh-node-4',
  //     // OPTIONAL Override the name on the label
  //     displayName: 'mesh-node-4',
  //     //  The class of the node. will default to 'normal' if not provided. The coloring of the UI is based on 'normal', 'warning', and 'danger', so if you want to match the UI coloring, use those class names. Any class you provide will expect to have a style 'colorClassName' available, e.g. if the class is 'fuzzy', you should also call 'vizceral.updateStyles({ colorTraffic: { fuzzy: '#aaaaaa' } })'
  //     class: 'normal',
  //     // OPTIONAL Any data that may be handled by a plugin or other data that isn't important to vizceral itself (if you want to show stuff on the page that contains vizceral, for example). Since it is completely optional and not handled by vizceral, you technically could use any index, but this is the convention we use.
  //     metadata: {},
  //   },
  // ],
  // connections: [
  //   {
  //     // The source node of the connection, will log a warning if the node does not exist.
  //     source: 'mesh-node-1',
  //     // The target node of the connection, will log a warning if the node does not exist.
  //     target: 'mesh-node-2',
  //     // These are the three default types/colors available in the component and the colors that are used for the nodes themselves. You are welcme to add others, or use other names instead knowing tha they may not match the UI coloring appropriately.
  //     metrics: {
  //       normal: 5000,
  //       danger: 5,
  //       warning: 0,
  //     },
  //     // OPTIONAL Any notices that you want to show up in the sidebar
  //     notices: [],
  //     // OPTIONAL Any data that may be handled by a plugin or other data that isn't important to vizceral itself (if you want to show stuff on the page that contains vizceral, for example). Since it is completely optional and not handled by vizceral, you technically could use any index, but this is the convention we use.
  //     metadata: {},
  //   },
  //   {
  //     // The source node of the connection, will log a warning if the node does not exist.
  //     source: 'mesh-node-3',
  //     // The target node of the connection, will log a warning if the node does not exist.
  //     target: 'mesh-node-4',
  //     // These are the three default types/colors available in the component and the colors that are used for the nodes themselves. You are welcme to add others, or use other names instead knowing tha they may not match the UI coloring appropriately.
  //     metrics: {
  //       normal: 5000,
  //       danger: 5,
  //       warning: 0,
  //     },
  //     // OPTIONAL Any notices that you want to show up in the sidebar
  //     notices: [],
  //     // OPTIONAL Any data that may be handled by a plugin or other data that isn't important to vizceral itself (if you want to show stuff on the page that contains vizceral, for example). Since it is completely optional and not handled by vizceral, you technically could use any index, but this is the convention we use.
  //     metadata: {},
  //   },
  //   {
  //     // The source node of the connection, will log a warning if the node does not exist.
  //     source: 'mesh-node-2',
  //     // The target node of the connection, will log a warning if the node does not exist.
  //     target: 'mesh-node-4',
  //     // These are the three default types/colors available in the component and the colors that are used for the nodes themselves. You are welcme to add others, or use other names instead knowing tha they may not match the UI coloring appropriately.
  //     metrics: {
  //       normal: 5000,
  //       danger: 5,
  //       warning: 0,
  //     },
  //     // OPTIONAL Any notices that you want to show up in the sidebar
  //     notices: [],
  //     // OPTIONAL Any data that may be handled by a plugin or other data that isn't important to vizceral itself (if you want to show stuff on the page that contains vizceral, for example). Since it is completely optional and not handled by vizceral, you technically could use any index, but this is the convention we use.
  //     metadata: {},
  //   },
  //   {
  //     // The source node of the connection, will log a warning if the node does not exist.
  //     source: 'mesh-node-4',
  //     // The target node of the connection, will log a warning if the node does not exist.
  //     target: 'mesh-node-2',
  //     // These are the three default types/colors available in the component and the colors that are used for the nodes themselves. You are welcme to add others, or use other names instead knowing tha they may not match the UI coloring appropriately.
  //     metrics: {
  //       normal: 5000,
  //       danger: 5,
  //       warning: 0,
  //     },
  //     // OPTIONAL Any notices that you want to show up in the sidebar
  //     notices: [],
  //     // OPTIONAL Any data that may be handled by a plugin or other data that isn't important to vizceral itself (if you want to show stuff on the page that contains vizceral, for example). Since it is completely optional and not handled by vizceral, you technically could use any index, but this is the convention we use.
  //     metadata: {},
  //   },
  // ],
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
  justify-content: space-around;
  height: 100px;
  flex-direction: row;
  width: 100%;
  border-bottom: 3px solid #2e2e2e;
  padding-top: 20px;
  padding-bottom: 8px;
  color: #fff;
  padding-left: 20px;
`;

const GraphHeaderMetricContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  flex-direction: row;
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
`;

// todo(jj) Figure out how to do container ratio better w/out max height ?
// works for now...
const VizceralContainer = styled.div`
  display: flex;
  flex: 1;
  max-height: 80%;
`;

const SidePanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex-basis: 300px;
`;

const SidePanelHeaderContainr = styled.div`
  display: flex;
  height: 100px;
`;

const HeaderVerticalDivider = styled.div`
  background-color: #2b2b2b;
  width: 2px;
  height: 100%;
`;

const LineGraphContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const App: React.FC = () => {
  const [activeNodes, setActiveNodes] = useState<number | undefined>(undefined);
  const [connectionCount, setConnectionCount] = useState<number | undefined>(undefined);
  const [openOrderCount, setOpenOrderCount] = useState<number | undefined>(undefined);
  const [traffic, setTraffic] = useState<VizceralTraffic>(baseTraffic);
  useEffect(() => {
    const fetchAndSetTrafficAsync = async () => {
      const graph = await backendClient.getVizsceralGraphAsync();
      setTraffic({
        ...baseTraffic,
        ...graph,
      });
    };
    // tslint:disable-next-line:no-floating-promises
    fetchAndSetTrafficAsync();
  }, []);

  // Set fake data...
  useEffect(() => {
    setActiveNodes(1739);
    setConnectionCount(5689);
    setOpenOrderCount(37312);
  }, []);

  return (
    <>
      <BaseStyles />
      <AppContainer>
        <Navigation />
        <Main>
          <Flex overflowY={'auto'} style={{ flexBasis: 370 }} flexDirection={'column'}>
            <Card title="trades" subtitle={'last 24 hours'}>
              <LineGraphContainer>
                {/* TODO calculate width height w/ js */}
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
            </Card>
            <Card title="recent trades" subtitle={'last 24 hours'}>
              hello
            </Card>
            <Card title="volume" subtitle={'last 24 hours'}>
              <LineGraphContainer>
                {/* TODO calculate width height w/ js */}
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
            </Card>
          </Flex>
          <GraphContainer>
            <MainGraphPanelContainer>
              <GraphHeaderContainer>
                <GraphHeaderMetricContainer>
                  <ActiveNodesSvg fill={'#fff'} width={40} height={40} />
                  <HeaderMetricDataContainer>
                    <GraphHeaderMetricLabel>active nodes</GraphHeaderMetricLabel>
                    <GraphHeaderMetricValue>{activeNodes ? activeNodes.toLocaleString() : '-'}</GraphHeaderMetricValue>
                  </HeaderMetricDataContainer>
                </GraphHeaderMetricContainer>
                {/* <HeaderVerticalDivider /> */}
                <GraphHeaderMetricContainer>
                  <ActiveNodesSvg fill={'#fff'} width={40} height={40} />
                  <HeaderMetricDataContainer>
                    <GraphHeaderMetricLabel>connections</GraphHeaderMetricLabel>
                    <GraphHeaderMetricValue>
                      {connectionCount ? connectionCount.toLocaleString() : '-'}
                    </GraphHeaderMetricValue>
                  </HeaderMetricDataContainer>
                </GraphHeaderMetricContainer>
                {/* <HeaderVerticalDivider /> */}
                <GraphHeaderMetricContainer>
                  <ActiveNodesSvg fill={'#fff'} width={40} height={40} />
                  <HeaderMetricDataContainer>
                    <GraphHeaderMetricLabel>open orders</GraphHeaderMetricLabel>
                    <GraphHeaderMetricValue>
                      {openOrderCount ? openOrderCount.toLocaleString() : '-'}
                    </GraphHeaderMetricValue>
                  </HeaderMetricDataContainer>
                </GraphHeaderMetricContainer>
              </GraphHeaderContainer>
              <VizceralContainer>
                <Vizceral
                  traffic={traffic}
                  viewChanged={logger.bind(logger, 'viewChanged')}
                  viewUpdated={logger.bind(logger, 'viewUpdated')}
                  objectHighlighted={logger.bind(logger, 'objectHighlighted')}
                />
              </VizceralContainer>
            </MainGraphPanelContainer>
            <SidePanelContainer>
              <SidePanelHeaderContainr>12234</SidePanelHeaderContainr>
            </SidePanelContainer>
          </GraphContainer>
          {/* </Flex> */}
        </Main>
        <Footer />
      </AppContainer>
    </>
  );
};
