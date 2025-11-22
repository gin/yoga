import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PositionType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate position type based on current price and range
export const getPositionType = (
  minPrice: number,
  maxPrice: number,
  currentPrice: number
): PositionType => {
  if (!currentPrice || !minPrice || !maxPrice) return PositionType.UNKNOWN;

  if (minPrice > currentPrice) {
    // Entire range above current price - only ETH needed
    return PositionType.ONLY_ETH;
  } else if (maxPrice < currentPrice) {
    // Entire range below current price - only USDC needed
    return PositionType.ONLY_USDC;
  } else {
    // Price within range - both tokens needed
    return PositionType.BOTH;
  }
};

export const getColors = (index: number) => {
  const colors = [
    {
      colorClass: "bg-primary/10 border-l-2 border-r-2 border-primary/60",
      handleColor: "bg-primary",
      borderColor: "border-primary/20",
    },
    {
      colorClass: "bg-blue-500/10 border-l-2 border-r-2 border-blue-500/60",
      handleColor: "bg-blue-500",
      borderColor: "border-blue-500/20",
    },
    {
      colorClass: "bg-purple-500/10 border-l-2 border-r-2 border-purple-500/60",
      handleColor: "bg-purple-500",
      borderColor: "border-purple-500/20",
    },
    {
      colorClass: "bg-amber-500/10 border-l-2 border-r-2 border-amber-500/60",
      handleColor: "bg-amber-500",
      borderColor: "border-amber-500/20",
    },
  ];

  return colors[index % colors.length];
};
