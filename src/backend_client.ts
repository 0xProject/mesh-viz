import { VizceralGraph } from './types';
import { utils } from './utils';

const VIZ_BASE_URL = 'https://viz.mesh.0x.org';
const VIZ_WS_URL = 'wss://viz.mesh.0x.org/events';

export const backendClient = {
  getVizsceralGraphAsync: async (): Promise<VizceralGraph> => {
    const response = await fetch(`${VIZ_BASE_URL}/snapshot`);
    const responseJson = await response.json();
    const graph = utils.getGraphFromMeshNodes(responseJson.meshNodes);
    return graph;
  },
};

export const backendWebSocketClient = new WebSocket(VIZ_WS_URL);
