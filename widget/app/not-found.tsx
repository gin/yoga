'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-12 text-center">
        <div className="flex flex-col gap-6">
          <p className="text-2xl font-medium leading-[24px]">
            Sorry we couldn&apos;t find the page you&apos;re looking for.
          </p>
          <p className="text-xl leading-[20px]">
            Try our{' '}
            <Button variant="link" onClick={handleHomeClick} className="text-foreground text-xl font-normal">
              home page
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
