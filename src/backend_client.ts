import { HttpClient } from '@0x/connect';

import { VizceralGraph } from './types';
import { utils } from './utils';

const VIZ_BASE_URL = 'https://viz.mesh.0x.org';
const SRA_BASE_URL = 'https://api.0x.org/sra';

const connect = new HttpClient(SRA_BASE_URL);

export const backendClient = {
  getVizsceralGraphAsync: async (): Promise<VizceralGraph> => {
    const response = await fetch(`${VIZ_BASE_URL}/snapshot`);
    const responseJson = await response.json();
    const graph = utils.getGraphFromMeshNodes(responseJson.meshNodes);
    return graph;
  },
  ...connect,
};
