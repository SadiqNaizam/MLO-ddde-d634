import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

interface AccountSummaryCardWidgetProps {
  accountId: string; // Used for key and potentially future specific navigation
  accountName: string;
  accountNumber: string; // Full account number, will be masked
  balance: number;
  currencySymbol?: string;
  accountType?: string; // e.g., Checking, Savings
}

const AccountSummaryCardWidget: React.FC<AccountSummaryCardWidgetProps> = ({
  accountId,
  accountName,
  accountNumber,
  balance,
  currencySymbol = '$',
  accountType,
}) => {
  console.log(`AccountSummaryCardWidget loaded for account: ${accountName} (ID: ${accountId})`);

  const maskAccountNumber = (number: string): string => {
    if (number.length <= 4) {
      return `**** ${number}`;
    }
    return `•••• ${number.slice(-4)}`;
  };

  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencySymbol.replace('$', 'USD'), // Intl expects ISO currency code
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);

  return (
    <Card className="w-full max-w-sm bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-300 border border-border flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">
              {accountName}
            </CardTitle>
            {accountType && (
              <CardDescription className="text-sm text-muted-foreground">
                {accountType}
              </CardDescription>
            )}
          </div>
          {/* Optional: Icon for account type could go here */}
        </div>
        <p className="text-sm text-muted-foreground pt-1">
          {maskAccountNumber(accountNumber)}
        </p>
      </CardHeader>

      <CardContent className="flex-grow py-4">
        <div className="text-3xl font-bold text-primary">
          {formattedBalance}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Available Balance</p>
      </CardContent>

      <CardFooter className="pt-2 pb-4 border-t border-border">
        <Button asChild variant="ghost" className="w-full justify-start text-sm p-0 h-auto hover:bg-transparent text-primary hover:text-primary/80">
          <Link to="/accounts" className="flex items-center">
            View Account Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccountSummaryCardWidget;