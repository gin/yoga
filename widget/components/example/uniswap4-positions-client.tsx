"use client";

import { useState } from 'react';
import Uniswap4Positions from './uniswap4-positions';

type Props = {
  initialAddress?: string;
};

export default function Uniswap4PositionsClient({ initialAddress = '0x6426af179aabebe47666f345d69fd9079673f6cd' }: Props) {
  const [ownerAddress, setOwnerAddress] = useState(initialAddress);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Owner address</span>
        <input
          value={ownerAddress}
          onChange={(e) => setOwnerAddress(e.target.value)}
          placeholder="0x..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </label>

      <Uniswap4Positions ownerAddress={ownerAddress} />
    </div>
  );
}
