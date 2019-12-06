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

const LineGraphContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const App: React.FC = () => {
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
    setOpenOrderCount(37312);
  }, []);

  let connectionCount;
  let activeNodes;
  if (traffic && traffic.nodes.length) {
    connectionCount = traffic.connections.length;
    activeNodes = traffic.nodes.length;
  }
  return (
    <>
      <BaseStyles />
      <AppContainer>
        <Navigation />
        <Main>
          <Flex overflowY={'auto'} style={{ flexBasis: 370 }} flexDirection={'column'}>
            <Card title="trades" subtitle="last 24 hours">
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
            <Card title="recent trades" subtitle="last 24 hours">
              hello
            </Card>
            <Card title="volume" subtitle="last 24 hours">
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
                  <ActiveNodesSvg fill="#fff" width={40} height={40} />
                  <HeaderMetricDataContainer>
                    <GraphHeaderMetricLabel>active nodes</GraphHeaderMetricLabel>
                    <GraphHeaderMetricValue>{activeNodes ? activeNodes.toLocaleString() : '-'}</GraphHeaderMetricValue>
                  </HeaderMetricDataContainer>
                </GraphHeaderMetricContainer>
                {/* <HeaderVerticalDivider /> */}
                <GraphHeaderMetricContainer>
                  <ActiveNodesSvg fill="#fff" width={40} height={40} />
                  <HeaderMetricDataContainer>
                    <GraphHeaderMetricLabel>connections</GraphHeaderMetricLabel>
                    <GraphHeaderMetricValue>
                      {connectionCount ? connectionCount.toLocaleString() : '-'}
                    </GraphHeaderMetricValue>
                  </HeaderMetricDataContainer>
                </GraphHeaderMetricContainer>
                {/* <HeaderVerticalDivider /> */}
                <GraphHeaderMetricContainer>
                  <ActiveNodesSvg fill="#fff" width={40} height={40} />
                  <HeaderMetricDataContainer>
                    <GraphHeaderMetricLabel>open orders</GraphHeaderMetricLabel>
                    <GraphHeaderMetricValue>
                      {openOrderCount ? openOrderCount.toLocaleString() : '-'}
                    </GraphHeaderMetricValue>
                  </HeaderMetricDataContainer>
                </GraphHeaderMetricContainer>
              </GraphHeaderContainer>
              <VizceralContainer>
                {traffic.nodes.length > 0 &&
                  // Hack updating traffic does not work at the moment
                  <Vizceral
                    traffic={traffic}
                    viewChanged={logger.bind(logger, 'viewChanged')}
                    viewUpdated={logger.bind(logger, 'viewUpdated')}
                    objectHighlighted={logger.bind(logger, 'objectHighlighted')}
                  />
                }
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
