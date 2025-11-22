import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getPortfolio, GetPortfolioParams } from './portfolio';
import { Portfolio } from '@/types/portfolio';

export function useGetPortfolio(
  params: GetPortfolioParams,
  options?: Omit<UseQueryOptions<Portfolio, Error, Portfolio, (string | boolean | undefined)[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['portfolio', params.address, params.includeImages, params.includeExplorerUrls, params.waitForSync],
    queryFn: () => getPortfolio(params),
    ...options,
  });
}
