import { MeshNode, VizceralConnection, VizceralGraph, VizceralNode } from './types';

export const utils = {
  getGraphFromMeshNodes: (meshNodes: MeshNode[]): VizceralGraph => {
    const nodes: VizceralNode[] = [];
    const connections: VizceralConnection[] = [];
    for (const meshNode of meshNodes) {
      const node: VizceralNode = {
        name: meshNode.name,
        displayName: meshNode.name.substr(meshNode.name.length - 5),
        metadata: meshNode.stats,
      };
      nodes.push(node);
      if (meshNode.peers) {
        const peerIds = Object.keys(meshNode.peers);
        for (const peerId of peerIds) {
          const peer = meshNode.peers[peerId];
          const connection: VizceralConnection = {
            source: meshNode.peerId,
            target: peerId,
            // TODO: metrics,
            metadata: peer,
          };
          connections.push(connection);
        }
      }
    }
    return {
      nodes,
      connections,
    };
  },
};
