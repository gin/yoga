import { Pool } from '@uniswap/v4-sdk';
import { Currency } from '@uniswap/sdk-core';

export function getPoolId(
  currency0: Currency,
  currency1: Currency,
  fee: number,
  tickSpacing: number,
  hooks: string
): string {
  const poolId = Pool.getPoolId(currency0, currency1, fee, tickSpacing, hooks);
  return poolId;
}
