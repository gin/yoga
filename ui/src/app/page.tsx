"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUniswap } from "@/providers/UniswapProvider";
import type {
  MintPositionParams,
  PositionDetails,
} from "@/providers/UniswapProvider";
import { PriceRangeSelector } from "@/components/PriceRangeSelector";
import ethLogo from "cryptocurrency-icons/svg/color/eth.svg";
import usdcLogo from "cryptocurrency-icons/svg/color/usdc.svg";

export default function Home() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const {
    mintPosition,
    getCurrentPrice,
    priceToTick,
    fetchUserPositions,
    isMinting,
    isConfirming,
    isConfirmed,
    transactionHash,
    error,
  } = useUniswap();

  // Price state
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<number>(2000); // Default min price
  const [maxPrice, setMaxPrice] = useState<number>(3500); // Default max price
  const [amount0Max, setAmount0Max] = useState<string>("0.0003");
  const [amount1Max, setAmount1Max] = useState<string>("1");

  // Positions state
  const [positions, setPositions] = useState<PositionDetails[]>([]);
  const [isLoadingPositions, setIsLoadingPositions] = useState(false);

  // Fetch current price on mount
  useEffect(() => {
    getCurrentPrice().then((price) => {
      if (price) {
        setCurrentPrice(price);
        // Set default range to +/- 25% from current price
        setMinPrice(price * 0.75);
        setMaxPrice(price * 1.25);
      }
    });
  }, [getCurrentPrice]);

  // Fetch positions on mount and when address changes
  useEffect(() => {
    if (address) {
      setIsLoadingPositions(true);
      fetchUserPositions(address)
        .then((fetchedPositions) => {
          // Filter out closed positions (liquidity === 0)
          const openPositions = fetchedPositions.filter(
            (position) => position.liquidity > BigInt(0)
          );
          setPositions(openPositions);
        })
        .finally(() => {
          setIsLoadingPositions(false);
        });
    }
  }, [address, fetchUserPositions]);

  // Refresh positions when a new position is created
  useEffect(() => {
    if (isConfirmed && address) {
      // Wait a bit for the subgraph to index the new position
      setTimeout(() => {
        fetchUserPositions(address).then((fetchedPositions) => {
          const openPositions = fetchedPositions.filter(
            (position) => position.liquidity > BigInt(0)
          );
          setPositions(openPositions);
        });
      }, 2000);
    }
  }, [isConfirmed, address, fetchUserPositions]);

  const handleCreatePosition = () => {
    if (!address) return;

    // Convert prices to ticks
    const tickLower = priceToTick(minPrice);
    const tickUpper = priceToTick(maxPrice);

    mintPosition({
      tickLower,
      tickUpper,
      amount0Desired: BigInt(Math.floor(parseFloat(amount0Max) * 1e18)),
      amount1Desired: BigInt(Math.floor(parseFloat(amount1Max) * 1e6)),
      recipient: address,
    });
  };

  const handlePositionClick = (tokenId: bigint) => {
    router.push(`/position/${tokenId}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      {/* Main Content */}
      {isConnected && (
        <div className="max-w-2xl mx-auto">
          {/* Position Management Card */}
          <Card>
            <CardHeader>
              <CardTitle>Create a new position</CardTitle>
              <CardDescription>
                Create a new position by providing the following details:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Token Pair Display */}
              <div className="flex items-center gap-16 justify-center pb-4 border-b">
                <div>
                  <img width={64} height={64} src={ethLogo} alt="ETH" />
                  <p className="text-lg text-muted-foreground text-center">
                    ETH
                  </p>
                </div>
                <div>
                  <img width={64} height={64} src={usdcLogo} alt="USDC" />
                  <p className="text-lg text-muted-foreground text-center">
                    USDC
                  </p>
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Fee tier: 0.05%
              </div>

              {/* Position Parameters Form */}
              <div className="grid gap-4">
                {/* Price Range Selector */}
                {currentPrice && (
                  <PriceRangeSelector
                    currentPrice={currentPrice}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onRangeChange={(min, max) => {
                      setMinPrice(min);
                      setMaxPrice(max);
                    }}
                    tokenSymbol="ETH/USDC"
                  />
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount0Max">Max ETH Amount</Label>
                    <Input
                      id="amount0Max"
                      type="number"
                      step="0.01"
                      value={amount0Max}
                      onChange={(e) => setAmount0Max(e.target.value)}
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount1Max">Max USDC Amount</Label>
                    <Input
                      id="amount1Max"
                      type="number"
                      step="1"
                      value={amount1Max}
                      onChange={(e) => setAmount1Max(e.target.value)}
                      placeholder="1000"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCreatePosition}
                  disabled={!address || isMinting || isConfirming}
                  className="w-full"
                >
                  {isMinting
                    ? "Creating Position..."
                    : isConfirming
                    ? "Confirming..."
                    : "Create Position"}
                </Button>

                {/* Transaction Status */}
                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive rounded-md overflow-auto">
                    <p className="text-sm text-destructive font-medium">
                      Error: {error.name}
                    </p>
                  </div>
                )}

                {isConfirmed && transactionHash && (
                  <div className="p-4 bg-success/10 border border-success rounded-md">
                    <p className="text-sm text-success font-medium">
                      Position created successfully!
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 break-all">
                      Transaction: {transactionHash}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Open Positions Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Open Positions</h2>

            {isLoadingPositions ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">
                    Loading positions...
                  </p>
                </CardContent>
              </Card>
            ) : positions.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">
                    No open positions found
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {positions.map((position) => (
                  <Card
                    key={position.tokenId.toString()}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handlePositionClick(position.tokenId)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Token pair icons */}
                          <div className="flex items-center -space-x-2">
                            <img
                              width={40}
                              height={40}
                              src={ethLogo}
                              alt="ETH"
                              className="rounded-full border-2 border-background"
                            />
                            <img
                              width={40}
                              height={40}
                              src={usdcLogo}
                              alt="USDC"
                              className="rounded-full border-2 border-background"
                            />
                          </div>

                          <div>
                            <h3 className="font-semibold text-lg">
                              ETH / USDC
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Token ID: {position.tokenId.toString()}
                            </p>
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="text-sm text-muted-foreground">
                            Fee: {position.poolKey.fee / 10000}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Range: {position.tickLower} to {position.tickUpper}
                          </div>
                          <div className="text-sm font-medium">
                            Liquidity: {position.liquidity.toString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
