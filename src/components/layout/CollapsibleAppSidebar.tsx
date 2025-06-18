import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  WalletCards, // Using WalletCards for Accounts as it might be more fitting
  Landmark, // Using Landmark for Bill Pay (often associated with banking/payments)
  ArrowLeftRight,
  Settings,
  PanelLeftClose,
  PanelRightOpen,
  Banknote, // For logo if sidebar is independent or includes it
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming utils.ts exists for cn

interface CollapsibleAppSidebarProps {
  initialCollapsed?: boolean;
}

const CollapsibleAppSidebar: React.FC<CollapsibleAppSidebarProps> = ({ initialCollapsed = false }) => {
  console.log('CollapsibleAppSidebar loaded');
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/accounts', label: 'Accounts', icon: WalletCards },
    { to: '/transfers', label: 'Transfers', icon: ArrowLeftRight },
    { to: '/bill-pay', label: 'Bill Pay', icon: Landmark },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'hidden md:flex flex-col h-screen border-r bg-muted/40 transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className={cn("flex h-16 items-center border-b px-4 shrink-0", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed && (
            <Link to="/" className="flex items-center gap-2 font-bold">
              <Banknote className="h-6 w-6 text-primary" />
              <span>FinDash</span>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className={cn(isCollapsed && "mx-auto")}>
            {isCollapsed ? <PanelRightOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            <span className="sr-only">{isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}</span>
          </Button>
        </div>
        <nav className="flex-grow py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const navLinkContent = (
              <>
                <Icon className={cn('h-5 w-5', isCollapsed ? 'mx-auto' : 'mr-3')} />
                <span className={cn(isCollapsed ? 'sr-only' : 'opacity-100 transition-opacity duration-300 delay-200')}>{item.label}</span>
              </>
            );

            return (
              <Tooltip key={item.to}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                        isActive && 'bg-muted text-primary font-semibold',
                        isCollapsed ? 'justify-center' : ''
                      )
                    }
                  >
                    {navLinkContent}
                  </NavLink>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" sideOffset={5}>
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>
        {/* Optional: Add user profile or settings link at the bottom if needed */}
        {/* <div className="mt-auto p-2 border-t"> ... </div> */}
      </aside>
    </TooltipProvider>
  );
};

export default CollapsibleAppSidebar;