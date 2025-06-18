import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Transaction {
  id: string;
  date: string; // e.g., "Jul 28, 2024"
  description: string;
  amount: number;
  currency: string; // e.g., "USD"
  type: 'debit' | 'credit';
  status: 'Completed' | 'Pending' | 'Failed';
}

interface RecentTransactionsListWidgetProps {
  transactions?: Transaction[];
  title?: string;
  maxHeight?: string; // e.g. "400px" to make it scrollable if content exceeds this
}

const defaultTransactions: Transaction[] = [
  { id: 'txn_1', date: 'Jul 28, 2024', description: 'Monthly Streaming Service', amount: 15.99, currency: 'USD', type: 'debit', status: 'Completed' },
  { id: 'txn_2', date: 'Jul 27, 2024', description: 'Online Purchase - Books & Stationery Supplies Inc.', amount: 45.50, currency: 'USD', type: 'debit', status: 'Completed' },
  { id: 'txn_3', date: 'Jul 26, 2024', description: 'Client Payment Received', amount: 1200.00, currency: 'USD', type: 'credit', status: 'Completed' },
  { id: 'txn_4', date: 'Jul 25, 2024', description: 'Utility Bill - Electricity', amount: 75.20, currency: 'USD', type: 'debit', status: 'Pending' },
  { id: 'txn_5', date: 'Jul 24, 2024', description: 'Restaurant Dinner with Friends', amount: 62.00, currency: 'USD', type: 'debit', status: 'Completed' },
  { id: 'txn_6', date: 'Jul 23, 2024', description: 'Refund Processed - Item Returned', amount: 22.50, currency: 'USD', type: 'credit', status: 'Failed' },
  { id: 'txn_7', date: 'Jul 22, 2024', description: 'Coffee Shop Purchase', amount: 5.75, currency: 'USD', type: 'debit', status: 'Completed' },
];

const RecentTransactionsListWidget: React.FC<RecentTransactionsListWidgetProps> = ({
  transactions = defaultTransactions,
  title = "Recent Transactions",
  maxHeight = "400px" // Default height for the scrollable area
}) => {
  console.log('RecentTransactionsListWidget loaded');

  const getStatusBadgeVariant = (status: Transaction['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Completed':
        return 'default'; // Shadcn 'default' variant, often themed with primary color
      case 'Pending':
        return 'secondary'; // Shadcn 'secondary' variant, often greyish
      case 'Failed':
        return 'destructive'; // Shadcn 'destructive' variant, often reddish
      default:
        return 'outline'; // Fallback
    }
  };

  const formatCurrency = (amount: number, currencyCode: string) => {
    // A more robust solution would use Intl.NumberFormat, but this is simple for display
    const symbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
    };
    const symbol = symbols[currencyCode] || currencyCode + ' ';
    return `${symbol}${amount.toFixed(2)}`;
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0"> {/* Remove padding from CardContent if table has its own */}
        {transactions && transactions.length > 0 ? (
          <ScrollArea style={{ height: maxHeight }} className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px] px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</TableHead>
                  <TableHead className="text-right w-[120px] px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</TableHead>
                  <TableHead className="text-center w-[110px] px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-muted/50">
                    <TableCell className="px-4 py-3 text-sm text-foreground whitespace-nowrap">{transaction.date}</TableCell>
                    <TableCell className="px-4 py-3 text-sm text-foreground line-clamp-1" title={transaction.description}>{transaction.description}</TableCell>
                    <TableCell
                      className={`px-4 py-3 text-right text-sm font-medium whitespace-nowrap ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600' // Using red for debits for stronger visual cue
                      }`}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <Badge variant={getStatusBadgeVariant(transaction.status)} className="text-xs px-2 py-0.5">
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No recent transactions to display.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsListWidget;