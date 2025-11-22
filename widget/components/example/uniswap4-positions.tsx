'use client';

import { ProtocolPosition } from '@/types/portfolio';
import { useGetPortfolio } from '@/services/octav/loader';

interface Uniswap4PositionsProps {
  ownerAddress?: string;
}

export default function Uniswap4Positions({ ownerAddress = '0x6426af179aabebe47666f345d69fd9079673f6cd' }: Uniswap4PositionsProps) {
  const { data, isLoading, error } = useGetPortfolio({
    address: ownerAddress,
    includeImages: true,
    includeExplorerUrls: true,
    waitForSync: true,
  });

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <p className="font-semibold text-red-800">Error</p>
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }
  console.log(data);
  // Wallet address with Uniswap v4 LP positions:
  //   Has 1 position:
  //   0xb2e3e82a95f5c4c47e30a5b420ac4f99d32ef61f
  //   Has 2 positions:
  //   0xbA85a470abAB9A283E7EfeB7BfA30ae04f6067fA
  //   Large account:
  //   0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13
  const uniswapValue = data?.assetByProtocols?.uniswap4?.value;
  const positions = data?.assetByProtocols?.uniswap4?.chains.ethereum?.protocolPositions.LIQUIDITYPOOL.protocolPositions;

  const chains = data?.assetByProtocols?.uniswap4?.chains;

  const renderPositionsByChain = () => {
    if (!chains) {
      return null;
    }

    return Object.keys(chains).map((chainKey) => {
      const chainData = chains[chainKey];
      const positions = chainData.protocolPositions?.LIQUIDITYPOOL?.protocolPositions;
      const numOfPositions = chainData.protocolPositions?.LIQUIDITYPOOL?.protocolPositions?.length;

      if (!positions || positions.length === 0) {
        return null;
      }

      return (
        <div key={chainKey} className="mt-4">
          <h3 className="text-md font-semibold capitalize mb-2">{chainKey}</h3>
          <p className="text-gray-600">Number of positions: {numOfPositions ?? 0}</p>
          <div className="space-y-2">
            {positions.map((position: ProtocolPosition, index: number) => (
              <div key={index} className="p-2 border border-gray-200 rounded-md bg-white">
                <p className="font-medium text-sm">Position {index + 1}: {position.assets?.[0].symbol}/{position.assets?.[1].symbol}</p>
                <p className="font-medium text-sm truncate">
                  NFT:{" "}
                  <a
                    href={`https://opensea.io/item/${chainKey}/${position.poolAddress}/${position.name.replace('#', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >{`${position.poolAddress}/${position.name.replace('#', '')}`}</a>
                </p>

                {/* note: This type error is ok. */}
                <p className="text-xs text-gray-500">Value: ${position.value}</p>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="p-4 border border-gray-300 bg-gray-50 rounded-md">
      <p className="font-semibold text-gray-800">Uniswap v4 LP positions</p>
      {uniswapValue != null ? (
        <>
          <p className="text-gray-600">Total value: ${uniswapValue}</p>
          {renderPositionsByChain()}
        </>
      ) : <p className="text-gray-600">No Uniswap v4 positions found.</p>}
    </div>
  );
}
