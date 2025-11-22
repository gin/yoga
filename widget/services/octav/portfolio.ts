import axios, { AxiosError } from 'axios';
import { Portfolio } from '@/types/portfolio';

export interface GetPortfolioParams {
  address: string;
  includeImages?: boolean;
  includeExplorerUrls?: boolean;
  waitForSync?: boolean;
}

export interface ApiErrorResponse {
  error: string;
  message?: string;
}

/**
 * Get portfolio data from NextJS API endpoint
 * @param params - Portfolio query parameters
 * @returns {Promise<PortfolioResponse>} Portfolio data
 * @throws {Error} Error with message from API response
 */
export const getPortfolio = async (params: GetPortfolioParams): Promise<Portfolio> => {
  const { address, includeImages, includeExplorerUrls, waitForSync } = params;

  const queryParams = new URLSearchParams({
    addresses: address,
  });

  if (includeImages !== undefined) {
    queryParams.append('includeImages', String(includeImages));
  }

  if (includeExplorerUrls !== undefined) {
    queryParams.append('includeExplorerUrls', String(includeExplorerUrls));
  }

  if (waitForSync !== undefined) {
    queryParams.append('waitForSync', String(waitForSync));
  }

  try {
    const response = await axios.get<Portfolio[]>(`/api/portfolio?${queryParams.toString()}`, {
      withCredentials: true,
    });

    return response.data[0];
  } catch (error) {
    // Handle axios errors and extract API error message
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;

      if (axiosError.response?.data) {
        const apiError = axiosError.response.data;
        const errorMessage = apiError.message || apiError.error || 'Failed to fetch portfolio data';
        throw new Error(errorMessage);
      }

      // Network or other axios errors
      throw new Error(axiosError.message || 'Network error occurred');
    }

    // Unknown error
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
};
