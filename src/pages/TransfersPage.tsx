import React, 'react';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import AppHeader from '@/components/layout/AppHeader';
import CollapsibleAppSidebar from '@/components/layout/CollapsibleAppSidebar';
import AppFooter from '@/components/layout/AppFooter';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowRightLeft, Send, AlertTriangle } from 'lucide-react';

// Placeholder data for user accounts
const userAccounts = [
  { id: "acc_chk_001", name: "Main Checking (•••• 1234)", balance: 5250.75, currency: "USD" },
  { id: "acc_sav_002", name: "High-Yield Savings (•••• 5678)", balance: 12800.20, currency: "USD" },
  { id: "acc_bus_003", name: "Business Account (•••• 9012)", balance: 27300.00, currency: "USD" },
];

// Schema for Internal Transfer
const internalTransferSchema = z.object({
  fromAccount: z.string().min(1, "Please select a source account"),
  toAccount: z.string().min(1, "Please select a destination account"),
  amount: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().positive({ message: "Amount must be a positive number" })
  ),
  memo: z.string().optional(),
}).refine(data => data.fromAccount !== data.toAccount, {
  message: "Source and destination accounts cannot be the same",
  path: ["toAccount"], // Attach error to 'toAccount' field
});

type InternalTransferFormData = z.infer<typeof internalTransferSchema>;

// Schema for External Transfer
const externalTransferSchema = z.object({
  fromAccount: z.string().min(1, "Please select a source account"),
  recipientName: z.string().min(2, { message: "Recipient name must be at least 2 characters" }),
  recipientAccountNumber: z.string().min(5, { message: "Recipient account number must be at least 5 digits" }),
  bankIdentifier: z.string().min(3, { message: "Bank identifier (e.g., SWIFT/ABA) is required" }),
  amount: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().positive({ message: "Amount must be a positive number" })
  ),
  memo: z.string().optional(),
});

type ExternalTransferFormData = z.infer<typeof externalTransferSchema>;


const TransfersPage = () => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
  const [transferDetails, setTransferDetails] = React.useState<string | null>(null);
  const [confirmAction, setConfirmAction] = React.useState<(() => void) | null>(null);

  console.log('TransfersPage loaded');

  const internalForm = useForm<InternalTransferFormData>({
    resolver: zodResolver(internalTransferSchema),
    defaultValues: {
      fromAccount: '',
      toAccount: '',
      amount: undefined, // Use undefined for number inputs to allow placeholder
      memo: '',
    },
  });

  const externalForm = useForm<ExternalTransferFormData>({
    resolver: zodResolver(externalTransferSchema),
    defaultValues: {
      fromAccount: '',
      recipientName: '',
      recipientAccountNumber: '',
      bankIdentifier: '',
      amount: undefined,
      memo: '',
    },
  });

  const handleInternalSubmit: SubmitHandler<InternalTransferFormData> = (data) => {
    const fromAccName = userAccounts.find(acc => acc.id === data.fromAccount)?.name || data.fromAccount;
    const toAccName = userAccounts.find(acc => acc.id === data.toAccount)?.name || data.toAccount;
    setTransferDetails(`Transfer $${data.amount.toFixed(2)} from ${fromAccName} to ${toAccName}?`);
    setConfirmAction(() => () => {
      console.log("Confirmed internal transfer:", data);
      toast.success("Internal transfer initiated successfully!");
      internalForm.reset();
      setIsConfirmDialogOpen(false);
    });
    setIsConfirmDialogOpen(true);
  };

  const handleExternalSubmit: SubmitHandler<ExternalTransferFormData> = (data) => {
    const fromAccName = userAccounts.find(acc => acc.id === data.fromAccount)?.name || data.fromAccount;
    setTransferDetails(`Transfer $${data.amount.toFixed(2)} from ${fromAccName} to ${data.recipientName} (Acc: ${data.recipientAccountNumber}, Bank: ${data.bankIdentifier})?`);
    setConfirmAction(() => () => {
      console.log("Confirmed external transfer:", data);
      toast.success("External transfer initiated successfully!");
      externalForm.reset();
      setIsConfirmDialogOpen(false);
    });
    setIsConfirmDialogOpen(true);
  };


  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <AppHeader />
      <div className="flex flex-1">
        <CollapsibleAppSidebar />
        <ScrollArea className="flex-1">
          <main className="p-4 md:p-6 lg:p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Fund Transfers</h1>
              <Button variant="outline" asChild>
                <Link to="/accounts"> {/* Example link - uses path from App.tsx */}
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  View Transaction History
                </Link>
              </Button>
            </div>

            {/* Internal Transfer Form */}
            <Card>
              <CardHeader>
                <CardTitle>Internal Transfer</CardTitle>
                <CardDescription>Move funds between your FinDash accounts.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...internalForm}>
                  <form onSubmit={internalForm.handleSubmit(handleInternalSubmit)} className="space-y-6">
                    <FormField
                      control={internalForm.control}
                      name="fromAccount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Account</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select source account" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Your Accounts</SelectLabel>
                                {userAccounts.map(account => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.name} - ${account.balance.toFixed(2)} {account.currency}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={internalForm.control}
                      name="toAccount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To Account</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select destination account" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Your Accounts</SelectLabel>
                                {userAccounts.map(account => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={internalForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || '')} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={internalForm.control}
                      name="memo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Memo (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Savings contribution" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full md:w-auto" disabled={internalForm.formState.isSubmitting}>
                      <Send className="mr-2 h-4 w-4" />
                      Transfer Funds
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* External Transfer Form */}
            <Card>
              <CardHeader>
                <CardTitle>External Transfer</CardTitle>
                <CardDescription>Send funds to an account at another bank or to an individual.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...externalForm}>
                  <form onSubmit={externalForm.handleSubmit(handleExternalSubmit)} className="space-y-6">
                    <FormField
                      control={externalForm.control}
                      name="fromAccount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Account</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select source account" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Your Accounts</SelectLabel>
                                {userAccounts.map(account => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.name} - ${account.balance.toFixed(2)} {account.currency}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={externalForm.control}
                      name="recipientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient's Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={externalForm.control}
                      name="recipientAccountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient's Account Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter account number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={externalForm.control}
                      name="bankIdentifier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Identifier (SWIFT/ABA/Routing)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., CITIUS33XXX or 021000021" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the SWIFT/BIC code for international or ABA/Routing number for domestic transfers.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={externalForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || '')} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={externalForm.control}
                      name="memo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Memo (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Payment for services" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full md:w-auto" disabled={externalForm.formState.isSubmitting}>
                      <Send className="mr-2 h-4 w-4" />
                      Initiate External Transfer
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </main>
        </ScrollArea>
      </div>
      <AppFooter />

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Confirm Transfer
            </AlertDialogTitle>
            <AlertDialogDescription>
              {transferDetails || "Please review your transfer details carefully. This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmAction(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmAction && confirmAction()}>
              Confirm & Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TransfersPage;