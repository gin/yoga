import { Portfolio } from '@/types/portfolio';
import { NextRequest, NextResponse } from 'next/server';

const OCTAV_API_BASE_URL = 'https://api.octav.fi/v1';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.OCTAV_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'OCTAV_API_KEY environment variable is not set' }, { status: 500 });
    }

    const searchParams = request.nextUrl.searchParams;
    const addresses = searchParams.get('addresses');

    if (!addresses) {
      return NextResponse.json({ error: 'addresses parameter is required' }, { status: 400 });
    }

    // Build query parameters
    const queryParams = new URLSearchParams({
      addresses,
    });

    // Add optional parameters if provided
    const includeNFTs = searchParams.get('includeNFTs');
    if (includeNFTs) {
      queryParams.append('includeNFTs', includeNFTs);
    }

    const includeImages = searchParams.get('includeImages');
    if (includeImages) {
      queryParams.append('includeImages', includeImages);
    }

    const includeExplorerUrls = searchParams.get('includeExplorerUrls');
    if (includeExplorerUrls) {
      queryParams.append('includeExplorerUrls', includeExplorerUrls);
    }

    const waitForSync = searchParams.get('waitForSync');
    if (waitForSync) {
      queryParams.append('waitForSync', waitForSync);
    }

    // Call Octav API
    const response = await fetch(`${OCTAV_API_BASE_URL}/portfolio?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: errorData.error || 'Failed to fetch portfolio data',
          message: errorData.message || `Octav API returned status ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data: Portfolio[] = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
