"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUniswap } from "@/providers/UniswapProvider";
import type { PositionDetails } from "@/providers/UniswapProvider";
import ethLogo from "cryptocurrency-icons/svg/color/eth.svg";
import usdcLogo from "cryptocurrency-icons/svg/color/usdc.svg";
import { ArrowLeft, Plus, Minus, Coins } from "lucide-react";

export default function PositionPage() {
  const params = useParams();
  const router = useRouter();
  const {
    fetchUserPositions,
    addLiquidity,
    removeLiquidity,
    collectFees,
    isMinting,
    isConfirming,
    isConfirmed,
    error,
  } = useUniswap();

  const [position, setPosition] = useState<PositionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Add liquidity state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addAmount0, setAddAmount0] = useState("");
  const [addAmount1, setAddAmount1] = useState("");

  // Remove liquidity state
  const [showRemoveForm, setShowRemoveForm] = useState(false);
  const [removePercentage, setRemovePercentage] = useState("50");

  const tokenId = params.tokenId as string;

  const fetchPosition = async () => {
    try {
      const accounts = (await (window as any).ethereum?.request({
        method: "eth_accounts",
      })) as string[];

      if (accounts && accounts[0]) {
        const positions = await fetchUserPositions(
          accounts[0] as `0x${string}`
        );
        const foundPosition = positions.find(
          (p) => p.tokenId.toString() === tokenId
        );
        setPosition(foundPosition || null);
      }
    } catch (error) {
      console.error("Error fetching position:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosition();
  }, [tokenId]);

  // Refresh position after successful transaction
  useEffect(() => {
    if (isConfirmed) {
      setTimeout(() => {
        fetchPosition();
        setShowAddForm(false);
        setShowRemoveForm(false);
      }, 2000);
    }
  }, [isConfirmed]);

  const handleAddLiquidity = async () => {
    if (!position) return;

    try {
      await addLiquidity({
        tokenId: position.tokenId,
        amount0Desired: BigInt(Math.floor(parseFloat(addAmount0) * 1e18)),
        amount1Desired: BigInt(Math.floor(parseFloat(addAmount1) * 1e6)),
      });
    } catch (err) {
      console.error("Failed to add liquidity:", err);
    }
  };

  const handleRemoveLiquidity = async () => {
    if (!position) return;

    try {
      await removeLiquidity({
        tokenId: position.tokenId,
        liquidityPercentage: parseFloat(removePercentage) / 100,
      });
    } catch (err) {
      console.error("Failed to remove liquidity:", err);
    }
  };

  const handleCollectFees = async () => {
    if (!position) return;

    try {
      const accounts = (await (window as any).ethereum?.request({
        method: "eth_accounts",
      })) as string[];

      if (accounts && accounts[0]) {
        await collectFees(position.tokenId, accounts[0]);
      }
    } catch (err) {
      console.error("Failed to collect fees:", err);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="p-12">
              <p className="text-center text-muted-foreground">
                Loading position...
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (!position) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="p-12">
              <p className="text-center text-muted-foreground">
                Position not found
              </p>
              <div className="flex justify-center mt-4">
                <Button onClick={() => router.push("/")} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Button
          onClick={() => router.push("/")}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Positions
        </Button>

        <div className="grid gap-6">
          {/* Position Details Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex items-center -space-x-2">
                  <img
                    width={48}
                    height={48}
                    src={ethLogo}
                    alt="ETH"
                    className="rounded-full border-2 border-background"
                  />
                  <img
                    width={48}
                    height={48}
                    src={usdcLogo}
                    alt="USDC"
                    className="rounded-full border-2 border-background"
                  />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    ETH / USDC Position
                  </CardTitle>
                  <CardDescription>
                    Token ID: {position.tokenId.toString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pool Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Pool Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Fee Tier</p>
                    <p className="font-medium">
                      {position.poolKey.fee / 10000}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Tick Spacing
                    </p>
                    <p className="font-medium">{position.poolKey.tickSpacing}</p>
                  </div>
                </div>
              </div>

              {/* Position Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Position Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tick Lower</p>
                    <p className="font-medium">{position.tickLower}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tick Upper</p>
                    <p className="font-medium">{position.tickUpper}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-sm text-muted-foreground">Liquidity</p>
                    <p className="font-medium text-lg">
                      {position.liquidity.toString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Status */}
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
                  <p className="text-sm text-destructive font-medium">
                    Error: {error.message}
                  </p>
                </div>
              )}

              {isConfirmed && (
                <div className="p-4 bg-success/10 border border-success rounded-md">
                  <p className="text-sm text-success font-medium">
                    Transaction successful! Position will update shortly...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            <Button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setShowRemoveForm(false);
              }}
              variant="outline"
              className="h-auto py-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Liquidity
            </Button>
            <Button
              onClick={() => {
                setShowRemoveForm(!showRemoveForm);
                setShowAddForm(false);
              }}
              variant="outline"
              className="h-auto py-4"
            >
              <Minus className="mr-2 h-4 w-4" />
              Remove Liquidity
            </Button>
            <Button
              onClick={handleCollectFees}
              disabled={isMinting || isConfirming}
              variant="outline"
              className="h-auto py-4"
            >
              <Coins className="mr-2 h-4 w-4" />
              Collect Fees
            </Button>
          </div>

          {/* Add Liquidity Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add Liquidity</CardTitle>
                <CardDescription>
                  Increase your position size by adding more tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="addAmount0">ETH Amount</Label>
                  <Input
                    id="addAmount0"
                    type="number"
                    step="0.0001"
                    value={addAmount0}
                    onChange={(e) => setAddAmount0(e.target.value)}
                    placeholder="0.001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addAmount1">USDC Amount</Label>
                  <Input
                    id="addAmount1"
                    type="number"
                    step="0.01"
                    value={addAmount1}
                    onChange={(e) => setAddAmount1(e.target.value)}
                    placeholder="1.0"
                  />
                </div>
                <Button
                  onClick={handleAddLiquidity}
                  disabled={
                    isMinting ||
                    isConfirming ||
                    !addAmount0 ||
                    !addAmount1
                  }
                  className="w-full"
                >
                  {isMinting || isConfirming
                    ? "Processing..."
                    : "Add Liquidity"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Remove Liquidity Form */}
          {showRemoveForm && (
            <Card>
              <CardHeader>
                <CardTitle>Remove Liquidity</CardTitle>
                <CardDescription>
                  Withdraw tokens from your position
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="removePercentage">
                    Percentage to Remove: {removePercentage}%
                  </Label>
                  <Input
                    id="removePercentage"
                    type="range"
                    min="1"
                    max="100"
                    value={removePercentage}
                    onChange={(e) => setRemovePercentage(e.target.value)}
                  />
                  <div className="flex gap-2 justify-between mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRemovePercentage("25")}
                    >
                      25%
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRemovePercentage("50")}
                    >
                      50%
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRemovePercentage("75")}
                    >
                      75%
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRemovePercentage("100")}
                    >
                      Max
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleRemoveLiquidity}
                  disabled={isMinting || isConfirming}
                  className="w-full"
                  variant="destructive"
                >
                  {isMinting || isConfirming
                    ? "Processing..."
                    : "Remove Liquidity"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
