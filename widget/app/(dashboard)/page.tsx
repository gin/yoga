import Portfolio from '@/components/example/portfolio';
import Uniswap4PositionsClient from '@/components/example/uniswap4-positions-client';
import { generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata({
  title: 'Yoga',
  description: 'Flexible liquidity',
});

export default function Page() {
  const ownerAddress = '0x6426af179aabebe47666f345d69fd9079673f6cd';

  return (
    <div className="flex flex-col gap-4">
      <p className="py-4 mt-2 md:mt-0">Hello</p>
      <p>Example widget</p>
      <Portfolio />
      <p>Uniswap v4 LP positions widget</p>
      <Uniswap4PositionsClient initialAddress={ownerAddress} />
    </div>
  );
}
