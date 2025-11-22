'use client';

import { cn } from '@/lib/utils';
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavItem {
  name: string;
  url: string;
  pathname: string;
  icon: React.ReactNode;
  className?: string;
  spacingBottom?: boolean;
  visible?: boolean;
}

export function NavItems({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';

  const isActive = (item: NavItem) => {
    // For other routes, match the exact path or path with trailing slash
    return pathname === item.pathname || pathname === `${item.pathname}/`;
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items
          .filter((item) => item.visible !== false)
          .map((item) => (
            <SidebarMenuItem
              key={item.name}
              className={cn(isExpanded ? 'w-full' : 'w-11', item.spacingBottom && 'mb-4')}
            >
              <SidebarMenuButton
                className={cn(
                  isExpanded ? 'w-full justify-start' : 'min-w-11 justify-center',
                  isActive(item) && 'text-sidebar-accent-foreground bg-sidebar-accent',
                  'h-10 md:h-10'
                )}
                asChild
              >
                <Link
                  href={item.url}
                  className={cn('flex items-center gap-3', !isExpanded && 'justify-center', item.className)}
                >
                  <div className="flex items-center justify-center w-5 h-5">{item.icon}</div>
                  {isExpanded && <span className={cn('text-sm', isActive(item) && 'font-medium')}>{item.name}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
