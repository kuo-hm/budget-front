'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const getPageTitle = (path: string) => {
    if (path.includes('/dashboard')) return 'Overview';
    if (path.includes('/transactions')) return 'Transactions';
    if (path.includes('/budgets')) return 'Budgets';
    if (path.includes('/goals')) return 'Goals';
    if (path.includes('/analytics')) return 'Analytics';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed inset-y-0 z-40">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen transition-all duration-300 ease-in-out">
        <Header
          onMenuClick={() => setIsMobileMenuOpen(true)}
          title={getPageTitle(pathname)}
        />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
