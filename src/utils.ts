import { memoize } from 'lodash';

import { MeshNode, VizceralConnection, VizceralGraph, VizceralNode } from './types';

function memoizePromise<T extends (...args: Args) => PromiseLike<any>, Args extends any[]>(
  f: T,
  resolver: (...args: Args) => any = ((a: any) => a) as any
) {
  const memorizedFunction = memoize(
    (async function(...args: Args) {
      try {
        return await f(...args);
      } catch (e) {
        memorizedFunction.cache.delete(resolver(...args));
        throw e;
      }
    } as any) as T,
    resolver
  );
  return memorizedFunction;
}

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

  getEthporerInfo: memoizePromise((address: string) =>
    fetch(`http://api.ethplorer.io/getTokenInfo/${address}?apiKey=freekey`).then(r => r.json())
  ),
};
