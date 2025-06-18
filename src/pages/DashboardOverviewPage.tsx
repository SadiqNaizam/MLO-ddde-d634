import React from 'react';
import { Link } from 'react-router-dom';

// Custom Components
import AppHeader from '@/components/layout/AppHeader';
import CollapsibleAppSidebar from '@/components/layout/CollapsibleAppSidebar';
import AppFooter from '@/components/layout/AppFooter';
import AccountSummaryCardWidget from '@/components/AccountSummaryCardWidget';
import RecentTransactionsListWidget from '@/components/RecentTransactionsListWidget';
import SpendingAnalysisChartWidget from '@/components/SpendingAnalysisChartWidget';

// Shadcn/ui Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowRight, DollarSign, Zap } from 'lucide-react'; // Icons for Quick Actions

// Placeholder data for widgets
const accountSummariesData = [
  {
    accountId: 'acc_chk_001',
    accountName: 'Primary Checking',
    accountNumber: '123456789012',
    balance: 15250.75,
    currencySymbol: '$',
    accountType: 'Checking Account',
  },
  {
    accountId: 'acc_sav_002',
    accountName: 'High-Yield Savings',
    accountNumber: '987654321098',
    balance: 48750.20,
    currencySymbol: '$',
    accountType: 'Savings Account',
  },
  {
    accountId: 'acc_crd_003',
    accountName: 'Platinum Rewards Card',
    accountNumber: '4444********1234',
    balance: -750.50, // Negative for credit card balance
    currencySymbol: '$',
    accountType: 'Credit Card',
  }
];

const spendingAnalysisData = [
  { category: 'Groceries', amount: 350.75, fill: 'hsl(var(--chart-1))' },
  { category: 'Utilities', amount: 180.20, fill: 'hsl(var(--chart-2))' },
  { category: 'Dining Out', amount: 220.50, fill: 'hsl(var(--chart-3))' },
  { category: 'Transport', amount: 120.00, fill: 'hsl(var(--chart-4))' },
  { category: 'Shopping', amount: 410.00, fill: 'hsl(var(--chart-5))' },
];

// RecentTransactionsListWidget will use its own default data as per its implementation.

const DashboardOverviewPage: React.FC = () => {
  console.log('DashboardOverviewPage loaded');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <CollapsibleAppSidebar initialCollapsed={false} />
        <ScrollArea className="flex-1 h-[calc(100vh-4rem-1px)]"> {/* Adjust height for header and potential footer */}
          <main className="p-4 md:p-6 lg:p-8 space-y-8">
            
            {/* Welcome Message / Page Title - could be part of header or a separate element */}
            <section>
              <h1 className="text-3xl font-bold text-foreground">Welcome Back!</h1>
              <p className="text-muted-foreground">Here's a snapshot of your financial health.</p>
            </section>

            {/* Account Summaries Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Account Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {accountSummariesData.map((account) => (
                  <AccountSummaryCardWidget
                    key={account.accountId}
                    accountId={account.accountId}
                    accountName={account.accountName}
                    accountNumber={account.accountNumber}
                    balance={account.balance}
                    currencySymbol={account.currencySymbol}
                    accountType={account.accountType}
                  />
                ))}
              </div>
            </section>

            {/* Recent Transactions & Spending Analysis Section */}
            <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <RecentTransactionsListWidget 
                  title="Your Recent Activity"
                  maxHeight="500px" // Example custom max height
                />
              </div>
              <div className="lg:col-span-2">
                <SpendingAnalysisChartWidget
                  title="Spending Breakdown"
                  description="Your expenses by category this month."
                  chartType="pie"
                  data={spendingAnalysisData}
                  dataKey="category"
                  valueKey="amount"
                  height={460} // Adjusted height to better fit alongside transaction list
                />
              </div>
            </section>

            {/* Quick Actions Section */}
            <section>
              <Card className="shadow-sm border-border">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
                  <CardDescription>Access common banking tasks with one click.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Button asChild size="lg" className="w-full justify-start text-left h-auto py-3">
                    <Link to="/transfers" className="flex items-center">
                      <ArrowLeftRight className="mr-3 h-5 w-5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Make a Transfer</p>
                        <p className="text-xs text-muted-foreground group-hover:text-primary-foreground/80">Move funds between accounts or to others.</p>
                      </div>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full justify-start text-left h-auto py-3 group">
                    <Link to="/bill-pay" className="flex items-center">
                      <DollarSign className="mr-3 h-5 w-5 flex-shrink-0 text-primary group-hover:text-primary-foreground" />
                       <div>
                        <p className="font-semibold">Pay Bills</p>
                        <p className="text-xs text-muted-foreground group-hover:text-primary-foreground/80">Manage and pay your upcoming bills.</p>
                      </div>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full justify-start text-left h-auto py-3 group">
                     <Link to="/accounts" className="flex items-center">
                      <Zap className="mr-3 h-5 w-5 flex-shrink-0 text-primary group-hover:text-primary-foreground" />
                       <div>
                        <p className="font-semibold">View All Accounts</p>
                        <p className="text-xs text-muted-foreground group-hover:text-primary-foreground/80">See details for all your accounts.</p>
                      </div>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </section>

          </main>
        </ScrollArea>
      </div>
      {/* AppFooter is placed outside the flex-1, flex-col on main ensures it's at bottom */}
      {/* However, if ScrollArea is meant to be the only scrollable part excluding footer, this structure is fine.
          If AppFooter should always be visible at the bottom of the viewport, adjustments might be needed.
          The current AppFooter is static, so it will appear after the content of ScrollArea.
          For a sticky footer within this layout, the middle div (flex flex-1) would need to be the one that allows its content (ScrollArea's main) to scroll,
          and AppFooter would be a direct child of the outermost flex flex-col.
          For simplicity and common dashboard patterns, keeping AppFooter after the ScrollArea is acceptable.
      */}
      <AppFooter />
    </div>
  );
};

export default DashboardOverviewPage;