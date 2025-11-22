/**
 * Main Portfolio response from Octav API
 * @see https://api-docs.octav.fi/api-models/portfolio
 */
export interface Portfolio {
  address: string;
  cashBalance: string;
  closedPnl: string | 'N/A';
  dailyIncome: string;
  dailyExpense: string;
  fees: string;
  feesFiat: string;
  lastUpdated: string; // Timestamp in milliseconds since epoch
  openPnl: string | 'N/A';
  networth: string;
  totalCostBasis: string | 'N/A';
  assetByProtocols: Record<string, AssetByProtocol>;
  chains: Record<string, ChainSummary>;
  nftsChains?: Record<string, ChainSummary>;
  nftsByCollection?: Record<string, NFTCollection>;
}

/**
 * Asset data organized by protocol
 * @see https://api-docs.octav.fi/api-models/portfolio/assetbyprotocols
 */
export interface AssetByProtocol {
  name: string;
  key: string;
  value: string;
  totalCostBasis: string | 'N/A';
  totalClosedPnl: string | 'N/A';
  totalOpenPnl: string | 'N/A';
  imgSmall?: string; // Requires includeImages=true
  imgLarge?: string; // Requires includeImages=true
  chains: Record<string, Chain>;
}

/**
 * Chain data within a protocol
 */
export interface Chain {
  name: string;
  key: string;
  value: string;
  totalCostBasis: string | 'N/A';
  totalClosedPnl: string | 'N/A';
  totalOpenPnl: string | 'N/A';
  protocolPositions: Record<string, ProtocolPosition>;
}

/**
 * Protocol position data
 * @see https://api-docs.octav.fi/api-models/portfolio/protocolposition
 */
export interface ProtocolPosition {
  name: string;
  totalOpenPnl: string | 'N/A';
  totalCostBasis: string | 'N/A';
  totalClosedPnl?: string | 'N/A';
  totalValue: string;
  unlockAt: string; // Timestamp in milliseconds since epoch
  imgSmall?: string; // Requires includeImages=true
  imgLarge?: string; // Requires includeImages=true
  explorerUrl?: string; // Requires includeExplorerUrls=true
  assets?: Asset[]; // Array of assets held in the protocol (if applicable)
  supplyAssets?: Asset[]; // Array of supplied assets (if applicable)
  borrowAssets?: Asset[]; // Array of borrowed assets (if applicable)
  rewardAssets?: Asset[]; // Array of reward assets (if applicable)
  dexAssets?: Asset[]; // Array of dex assets (if applicable)
  quoteAssets?: Asset[]; // Array of quoteAssets (for margin positions)
  marginAssets?: Asset[]; // Array of marginAssets (for margin positions)
  baseAssets?: Asset[]; // Array of baseAssets (for margin positions)
  protocolPositions?: ProtocolPosition[]; // Sub array containing the protocol positions (recursive structure for nested positions)
  healthRate?: string; // Health rate for lending protocols
  vaultAddress?: string; // Vault address if applicable
  poolAddress?: string; // Pool address if applicable
}

/**
 * Asset information
 * @see https://api-docs.octav.fi/api-models/portfolio/asset
 */
export interface Asset {
  balance: string;
  chainContract: string;
  chainKey: string;
  contract: string;
  decimal: string;
  name: string;
  openPnl: string | 'N/A'; // Only available for dexAssets
  price: string;
  symbol: string;
  totalCostBasis: string | 'N/A';
  value: string;
  imgSmall?: string; // Requires includeImages=true
  imgLarge?: string; // Requires includeImages=true
  explorerUrl?: string; // Requires includeExplorerUrls=true
}

/**
 * Chain summary data
 * @see https://api-docs.octav.fi/api-models/portfolio/chainsummary
 */
export interface ChainSummary {
  name: string;
  key: string;
  chainId: string;
  value: string;
  valuePercentile: string;
  totalCostBasis: string | 'N/A';
  totalClosedPnl: string | 'N/A';
  totalOpenPnl: string | 'N/A';
  imgSmall?: string; // Requires includeImages=true
  imgLarge?: string; // Requires includeImages=true
}

/**
 * NFT Collection data
 * @see https://api-docs.octav.fi/api-models/portfolio
 */
export interface NFTCollection {
  name: string;
  contractAddress: string;
  chainKey: string;
  chainId: string;
  value: string;
  count: string;
  imgSmall?: string; // Requires includeImages=true
  imgLarge?: string; // Requires includeImages=true
  explorerUrl?: string; // Requires includeExplorerUrls=true
}
