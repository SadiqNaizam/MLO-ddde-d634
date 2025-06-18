import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GlobalSearchInput } from '@/components/GlobalSearchInput'; // Assuming this path
import { Bell, Menu, Banknote, Settings as SettingsIcon, LogOut, UserCircle, LayoutDashboard, WalletCards, Landmark, ArrowLeftRight } from 'lucide-react';

interface AppHeaderProps {}

const AppHeader: React.FC<AppHeaderProps> = () => {
  console.log('AppHeader loaded');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/accounts', label: 'Accounts', icon: <WalletCards className="h-5 w-5" /> },
    { href: '/transfers', label: 'Transfers', icon: <ArrowLeftRight className="h-5 w-5" /> },
    { href: '/bill-pay', label: 'Bill Pay', icon: <Landmark className="h-5 w-5" /> },
    { href: '/settings', label: 'Settings', icon: <SettingsIcon className="h-5 w-5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 mr-4">
            <Banknote className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl">FinDash</span>
          </Link>
        </div>

        <div className="flex-1 max-w-md ml-auto mr-4 hidden md:block">
          <GlobalSearchInput placeholder="Search transactions, payees..." />
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="sr-only">User Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Banknote className="h-7 w-7 text-primary" />
                    <span className="font-bold text-xl">FinDash</span>
                  </Link>
                </div>
                <div className="p-4 md:hidden">
                   <GlobalSearchInput placeholder="Search..." />
                </div>
                <nav className="flex-grow px-4 py-2 space-y-1">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <NavLink
                        to={link.href}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                            isActive ? 'bg-muted text-primary font-semibold' : ''
                          }`
                        }
                      >
                        {link.icon}
                        {link.label}
                      </NavLink>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-auto p-4 border-t">
                  {/* Additional mobile footer items if needed */}
                  <Button variant="outline" className="w-full">
                     <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;