'use client';

import { Geist, Geist_Mono } from 'next/font/google';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, useState } from 'react';

import { AppSidebar } from '@/components/app-sidebar/app-sidebar';

import './global.css';

import { Toaster } from 'sonner';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Header } from '@/components/header/header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Create the query client once and set it directly
  const queryClient = new QueryClient();

  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full overflow-hidden`}
      >
        <Suspense fallback={<p>Loading...</p>}>
          <QueryClientProvider client={queryClient}>
            <SidebarProvider className="relative">
              <AppSidebar className="hidden lg:block" />
              <div className="block lg:hidden">
                <Header />
              </div>

              <SidebarInset>
                <SidebarTrigger className="absolute text-sidebar-foreground z-10 mt-[26px] hidden lg:block " />
                <div className="flex flex-1 flex-col gap-4 p-2 lg:p-6 pt-0 mt-16 lg:mt-0">{children}</div>
              </SidebarInset>
            </SidebarProvider>
            <Toaster />
          </QueryClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
