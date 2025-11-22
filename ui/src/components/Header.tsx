"use client";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-bold text-xl">Y</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Yoga Position Manager</h1>
              <p className="text-xs text-muted-foreground">
                Bend your liquidity
              </p>
            </div>
          </div>

          {/* Wallet Connect Section */}
          <div className="flex items-center gap-4">
            <appkit-button />
          </div>
        </div>
      </div>
    </header>
  );
}
