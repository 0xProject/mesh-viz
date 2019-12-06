export interface VizceralNotices {
  severity?: number;
  title: string;
}
export interface VizceralNode {
  name: string;
  nodes?: VizceralNode[];
  displayName?: string;
  metadata?: { [key: string]: any };
  // The class of the node. will default to 'normal' if not provided. The coloring of the UI is based on 'normal', 'warning', and 'danger', so if you want to match the UI coloring, use those class names. Any class you provide will expect to have a style 'colorClassName' available, e.g. if the class is 'fuzzy', you should also call 'vizceral.updateStyles({ colorTraffic: { fuzzy: '#aaaaaa' } })'
  class?: string;
  notices?: VizceralNotices[];
}

export interface VizceralConnection {
  source: string;
  target: string;
  metrics?: { [key: string]: number };
  notices?: VizceralNotices[];
  metadata?: { [key: string]: any };
}

export interface VizceralGraph {
  nodes: VizceralNode[];
  connections: VizceralConnection[];
}

export interface VizceralTraffic extends VizceralGraph {
  renderer: 'global' | 'region';
  name: string;
  displayName?: string;
  updated?: number;
  maxVolume?: number;
}

export interface MeshNodeStats {
  version_string: string;
  startOfCurrentUTCDay_string: string;
  rendezvous_string: string;
  pubSubTopic_string: string;
  numPinnedOrders_number: number;
  numPeers_number: number;
  numOrders_number: number;
  numOrdersIncludingRemoved_number: number;
  myPeerID: string;
  msg: string;
  maxExpirationTime_string: string;
  level: string;
  latestBlock_rpc_LatestBlock: any;
  ethereumChainID_number: number;
  ethRPCRequestsSentInCurrentUTCDay_number: number;
  ethRPCRateLimitExpiredRequests_number: number;
}

export interface MeshPeer {
  ip: string;
  multiAddr: string;
  peerId: string;
  port: string;
}

export interface MeshNode {
  stats: MeshNodeStats;
  peers?: null | { [peerId: string]: MeshPeer };
  meshVersion: string;
  ip: string;
  multiAddress: string;
  peerId: string;
  name: string;
  geo?: {
    country: string;
    city: string;
    lat: number;
    long: number;
    timezone: string;
  };
}

export interface SnapshotResponse {
  meshNodes: MeshNode[];
}

export interface MeshOrderRecievedMessagePayload {
  from: string;
  to: string;
  orderHash: string;
}

export interface MeshOrderRecievedMessage {
  name: 'NEW_MESH_ORDER_RECEIVED';
  payload: MeshOrderRecievedMessagePayload;
}

export interface HistoricalAsset {
  amount: string;
  tokenAddress: string;
  tokenSymbol: string;
  traderType: 'maker' | 'taker';
  type: string;
}

export interface HistoricalOrder {
  id: string;
  date: string;
  assets: HistoricalAsset[];
}
