import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Custom Layout Components
import AppHeader from '@/components/layout/AppHeader';
import CollapsibleAppSidebar from '@/components/layout/CollapsibleAppSidebar';
import AppFooter from '@/components/layout/AppFooter';

// Shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Lucide Icons
import { DollarSign, CreditCard, Landmark as BankIcon, FileText, AlertTriangle, Plane, Filter } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  transactionType: 'debit' | 'credit';
  status: 'Completed' | 'Pending' | 'Failed';
}

interface AccountDetails {
  holderName: string;
  openedDate: string;
  interestRate?: string;
  address?: string; // Example additional detail
}

interface Account {
  id: string;
  name: string;
  number: string; // Masked or last 4 digits
  type: 'Checking' | 'Savings' | 'Credit Card';
  balance: number;
  currency: string;
  transactions: Transaction[];
  details: AccountDetails;
}

const userAccountsData: Account[] = [
  {
    id: 'acc_chk_001',
    name: 'Primary Checking',
    number: '•••• 6789',
    type: 'Checking',
    balance: 5250.75,
    currency: 'USD',
    details: { holderName: 'Jane Doe', openedDate: '2018-05-15', interestRate: '0.01%', address: '123 Main St, Anytown, USA' },
    transactions: [
      { id: 'txn_c001', date: '2024-07-29', description: 'Grocery Store Run', amount: 75.20, transactionType: 'debit', status: 'Completed' },
      { id: 'txn_c002', date: '2024-07-28', description: 'Monthly Salary Deposit', amount: 2500.00, transactionType: 'credit', status: 'Completed' },
      { id: 'txn_c003', date: '2024-07-27', description: 'Online Purchase - Tech Gadgets', amount: 120.50, transactionType: 'debit', status: 'Pending' },
      { id: 'txn_c004', date: '2024-07-26', description: 'ATM Withdrawal', amount: 100.00, transactionType: 'debit', status: 'Completed' },
    ],
  },
  {
    id: 'acc_sav_002',
    name: 'High-Yield Savings',
    number: '•••• 1234',
    type: 'Savings',
    balance: 12870.00,
    currency: 'USD',
    details: { holderName: 'Jane Doe', openedDate: '2020-01-20', interestRate: '1.50%', address: '123 Main St, Anytown, USA' },
    transactions: [
      { id: 'txn_s001', date: '2024-07-25', description: 'Quarterly Interest Payment', amount: 45.80, transactionType: 'credit', status: 'Completed' },
      { id: 'txn_s002', date: '2024-07-01', description: 'Transfer from Checking', amount: 500.00, transactionType: 'credit', status: 'Completed' },
    ],
  },
  {
    id: 'acc_cc_003',
    name: 'Platinum Rewards Card',
    number: '•••• 5678',
    type: 'Credit Card',
    balance: -750.45, // Negative for credit card balance owed
    currency: 'USD',
    details: { holderName: 'Jane Doe', openedDate: '2019-11-01', interestRate: '18.99%', address: '123 Main St, Anytown, USA' },
    transactions: [
      { id: 'txn_cc001', date: '2024-07-29', description: 'Dinner at "The Gourmet Place"', amount: 65.00, transactionType: 'debit', status: 'Completed' },
      { id: 'txn_cc002', date: '2024-07-20', description: 'Payment to Credit Card', amount: 300.00, transactionType: 'credit', status: 'Completed' },
      { id: 'txn_cc003', date: '2024-07-15', description: 'Flight Ticket - Round Trip', amount: 450.25, transactionType: 'debit', status: 'Completed' },
       { id: 'txn_cc004', date: '2024-07-10', description: 'Subscription - Music Streaming', amount: 9.99, transactionType: 'debit', status: 'Failed' },
    ],
  },
];

const formatCurrency = (amount: number, currencyCode: string) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amount);
};

const getTransactionStatusVariant = (status: Transaction['status']): "default" | "secondary" | "destructive" => {
  switch (status) {
    case 'Completed': return 'default'; // Or success-like, if customized
    case 'Pending': return 'secondary';
    case 'Failed': return 'destructive';
    default: return 'default';
  }
};

const AccountsPage = () => {
  console.log('AccountsPage loaded');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  useEffect(() => {
    // Set the first account as selected by default
    if (userAccountsData.length > 0) {
      setSelectedAccount(userAccountsData[0]);
    }
  }, []);

  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'Checking': return <BankIcon className="h-5 w-5 mr-2" />;
      case 'Savings': return <DollarSign className="h-5 w-5 mr-2" />;
      case 'Credit Card': return <CreditCard className="h-5 w-5 mr-2" />;
      default: return <BankIcon className="h-5 w-5 mr-2" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <AppHeader />
      <div className="flex flex-1">
        <CollapsibleAppSidebar />
        <ScrollArea className="flex-1 bg-background">
          <main className="p-4 sm:p-6 md:p-8">
            <header className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">My Accounts</h1>
              <p className="text-muted-foreground">View and manage your accounts and transactions.</p>
            </header>

            {/* Account Selector Section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Select an Account</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userAccountsData.map(acc => (
                  <Card 
                    key={acc.id} 
                    onClick={() => setSelectedAccount(acc)} 
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedAccount?.id === acc.id ? 'ring-2 ring-primary shadow-lg' : 'border-border'}`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-base font-medium flex items-center">
                        {getAccountIcon(acc.type)}
                        {acc.name}
                      </CardTitle>
                      <span className="text-xs text-muted-foreground">{acc.type}</span>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(acc.balance, acc.currency)}</div>
                      <p className="text-xs text-muted-foreground">{acc.number}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Selected Account Details Section */}
            {selectedAccount && (
              <Card className="shadow-lg border-border">
                <CardHeader className="bg-muted/30">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <CardTitle className="text-2xl flex items-center">
                        {getAccountIcon(selectedAccount.type)}
                        {selectedAccount.name}
                      </CardTitle>
                      <CardDescription>{selectedAccount.type} Account: {selectedAccount.number}</CardDescription>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-3xl font-bold text-primary">{formatCurrency(selectedAccount.balance, selectedAccount.currency)}</p>
                      <p className="text-sm text-muted-foreground">Available Balance</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 sm:p-4 md:p-6">
                  <Tabs defaultValue="transactions" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 mb-4 sm:mb-6 border-b rounded-none p-0 sm:p-1">
                      <TabsTrigger value="transactions" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none">Transactions</TabsTrigger>
                      <TabsTrigger value="details" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none">Account Details</TabsTrigger>
                      <TabsTrigger value="manage" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none">Manage</TabsTrigger>
                    </TabsList>

                    {/* Transactions Tab */}
                    <TabsContent value="transactions" className="mt-0">
                      <Card className="border-none shadow-none">
                        <CardHeader className="px-0 sm:px-2">
                          <div className="flex justify-between items-center">
                            <CardTitle>Transaction History</CardTitle>
                            <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" />Filter</Button>
                          </div>
                        </CardHeader>
                        <CardContent className="px-0 sm:px-2">
                          {selectedAccount.transactions.length > 0 ? (
                            <ScrollArea className="h-[400px] w-full">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[100px]">Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-center hidden sm:table-cell">Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedAccount.transactions.map((txn) => (
                                    <TableRow key={txn.id}>
                                      <TableCell className="font-medium">{txn.date}</TableCell>
                                      <TableCell>{txn.description}</TableCell>
                                      <TableCell className={`text-right font-semibold ${txn.transactionType === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                        {txn.transactionType === 'credit' ? '+' : '-'}
                                        {formatCurrency(txn.amount, selectedAccount.currency)}
                                      </TableCell>
                                      <TableCell className="text-center hidden sm:table-cell">
                                        <Badge variant={getTransactionStatusVariant(txn.status)}>{txn.status}</Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </ScrollArea>
                          ) : (
                            <p className="text-muted-foreground text-center py-8">No transactions found for this account.</p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Account Details Tab */}
                    <TabsContent value="details" className="mt-0">
                      <Card className="border-none shadow-none">
                        <CardHeader className="px-0 sm:px-2"><CardTitle>Detailed Information</CardTitle></CardHeader>
                        <CardContent className="space-y-3 px-0 sm:px-2">
                          <div className="flex justify-between py-2 border-b"><span>Account Holder:</span> <span className="font-medium">{selectedAccount.details.holderName}</span></div>
                          <div className="flex justify-between py-2 border-b"><span>Account Type:</span> <span className="font-medium">{selectedAccount.type}</span></div>
                          <div className="flex justify-between py-2 border-b"><span>Account Number:</span> <span className="font-medium">{selectedAccount.number}</span></div>
                          <div className="flex justify-between py-2 border-b"><span>Opened Date:</span> <span className="font-medium">{selectedAccount.details.openedDate}</span></div>
                          {selectedAccount.details.interestRate && <div className="flex justify-between py-2 border-b"><span>Interest Rate:</span> <span className="font-medium">{selectedAccount.details.interestRate}</span></div>}
                          {selectedAccount.details.address && <div className="flex justify-between py-2 border-b"><span>Registered Address:</span> <span className="font-medium">{selectedAccount.details.address}</span></div>}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Manage Card/Account Tab */}
                    <TabsContent value="manage" className="mt-0">
                      <Card className="border-none shadow-none">
                        <CardHeader className="px-0 sm:px-2"><CardTitle>Account & Card Management</CardTitle></CardHeader>
                        <CardContent className="space-y-4 px-0 sm:px-2">
                          <Dialog>
                            <DialogTrigger asChild><Button variant="outline" className="w-full sm:w-auto justify-start sm:justify-center"><FileText className="h-4 w-4 mr-2"/>View e-Statements</Button></DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>e-Statements for {selectedAccount.name}</DialogTitle>
                                <DialogDescription>
                                  Download or view your electronic statements. (Placeholder)
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <p>List of statements would appear here.</p>
                                <Button variant="link">January 2024 Statement.pdf</Button><br/>
                                <Button variant="link">February 2024 Statement.pdf</Button>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Button variant="outline" className="w-full sm:w-auto justify-start sm:justify-center"><AlertTriangle className="h-4 w-4 mr-2"/>Report Lost/Stolen Card</Button>
                          <Button variant="outline" className="w-full sm:w-auto justify-start sm:justify-center"><Plane className="h-4 w-4 mr-2"/>Set Travel Notice</Button>
                          {selectedAccount.type === 'Credit Card' && <Button variant="outline" className="w-full sm:w-auto justify-start sm:justify-center"><CreditCard className="h-4 w-4 mr-2"/>Manage Card Controls</Button>}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
            {!selectedAccount && userAccountsData.length > 0 && (
                 <div className="text-center py-10 text-muted-foreground">
                    <p>Please select an account above to view its details.</p>
                </div>
            )}
             {!userAccountsData || userAccountsData.length === 0 && (
                <Card className="text-center py-10">
                    <CardTitle>No Accounts Found</CardTitle>
                    <CardDescription>There are no accounts associated with your profile.</CardDescription>
                    <Button asChild className="mt-4"><Link to="/contact-support">Contact Support</Link></Button>
                </Card>
            )}
          </main>
        </ScrollArea>
      </div>
      <AppFooter />
    </div>
  );
};

export default AccountsPage;