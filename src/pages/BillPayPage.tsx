import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import CollapsibleAppSidebar from '@/components/layout/CollapsibleAppSidebar';
import AppFooter from '@/components/layout/AppFooter';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Edit3, Trash2, CalendarDays, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Payee {
  id: string;
  name: string;
  accountNumber: string;
  category?: string;
}

interface Payment {
  id: string;
  payeeId: string;
  payeeName: string;
  amount: number;
  paymentDate: string; // "YYYY-MM-DD"
  status: 'Scheduled' | 'Pending' | 'Paid' | 'Failed';
  frequency?: 'One-time' | 'Monthly';
}

const payeeFormSchema = z.object({
  id: z.string().optional(), // For editing
  name: z.string().min(2, { message: "Payee name must be at least 2 characters." }),
  accountNumber: z.string().min(5, { message: "Account number must be valid (min 5 digits)." }).regex(/^\d+$/, { message: "Account number must be digits only." }),
  category: z.string().optional(),
});
type PayeeFormData = z.infer<typeof payeeFormSchema>;

const schedulePaymentFormSchema = z.object({
  payeeId: z.string({ required_error: "Please select a payee." }),
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
  paymentDate: z.string().refine((date) => new Date(date) >= new Date(new Date().setHours(0,0,0,0)), { message: "Payment date cannot be in the past." }),
  frequency: z.enum(['One-time', 'Monthly']).default('One-time'),
});
type SchedulePaymentFormData = z.infer<typeof schedulePaymentFormSchema>;

const initialPayees: Payee[] = [
  { id: 'payee_1', name: 'City Electric Co.', accountNumber: '100200300', category: 'Utilities' },
  { id: 'payee_2', name: 'AquaFlow Water', accountNumber: 'AFW98765', category: 'Utilities' },
  { id: 'payee_3', name: 'ConnectNet Broadband', accountNumber: 'CNB123123', category: 'Internet' },
  { id: 'payee_4', name: 'Prime Credit Card', accountNumber: '4444555566667777', category: 'Credit Card' },
];

const initialUpcomingPayments: Payment[] = [
  { id: 'up_1', payeeId: 'payee_1', payeeName: 'City Electric Co.', amount: 75.50, paymentDate: '2024-08-15', status: 'Scheduled', frequency: 'Monthly' },
  { id: 'up_2', payeeId: 'payee_3', payeeName: 'ConnectNet Broadband', amount: 59.99, paymentDate: '2024-08-20', status: 'Scheduled', frequency: 'Monthly' },
];

const initialPaymentHistory: Payment[] = [
  { id: 'ph_1', payeeId: 'payee_1', payeeName: 'City Electric Co.', amount: 72.30, paymentDate: '2024-07-15', status: 'Paid', frequency: 'Monthly' },
  { id: 'ph_2', payeeId: 'payee_4', payeeName: 'Prime Credit Card', amount: 250.00, paymentDate: '2024-07-10', status: 'Paid', frequency: 'One-time' },
  { id: 'ph_3', payeeId: 'payee_2', payeeName: 'AquaFlow Water', amount: 45.00, paymentDate: '2024-07-05', status: 'Paid', frequency: 'Monthly' },
];


const BillPayPage = () => {
  console.log('BillPayPage loaded');

  const [payees, setPayees] = useState<Payee[]>(initialPayees);
  const [upcomingPayments, setUpcomingPayments] = useState<Payment[]>(initialUpcomingPayments);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>(initialPaymentHistory);

  const [isAddPayeeDialogOpen, setIsAddPayeeDialogOpen] = useState(false);
  const [isEditPayeeDialogOpen, setIsEditPayeeDialogOpen] = useState(false);
  const [payeeToEdit, setPayeeToEdit] = useState<Payee | null>(null);
  
  const [isSchedulePaymentDialogOpen, setIsSchedulePaymentDialogOpen] = useState(false);

  const payeeForm = useForm<PayeeFormData>({
    resolver: zodResolver(payeeFormSchema),
    defaultValues: { name: '', accountNumber: '', category: '' },
  });

  const schedulePaymentForm = useForm<SchedulePaymentFormData>({
    resolver: zodResolver(schedulePaymentFormSchema),
    defaultValues: { payeeId: '', amount: 0, paymentDate: new Date().toISOString().split('T')[0], frequency: 'One-time' },
  });

  const handleAddPayeeSubmit = (data: PayeeFormData) => {
    const newPayee: Payee = { ...data, id: `payee_${Date.now()}` };
    setPayees([...payees, newPayee]);
    payeeForm.reset();
    setIsAddPayeeDialogOpen(false);
  };

  const openEditPayeeDialog = (payee: Payee) => {
    setPayeeToEdit(payee);
    payeeForm.reset(payee); // Pre-fill form with payee data
    setIsEditPayeeDialogOpen(true);
  };

  const handleEditPayeeSubmit = (data: PayeeFormData) => {
    if (!payeeToEdit) return;
    setPayees(payees.map(p => p.id === payeeToEdit.id ? { ...payeeToEdit, ...data } : p));
    payeeForm.reset();
    setIsEditPayeeDialogOpen(false);
    setPayeeToEdit(null);
  };

  const handleDeletePayee = (payeeId: string) => {
    // In a real app, check for pending payments to this payee before deleting
    setPayees(payees.filter(p => p.id !== payeeId));
  };
  
  const handleSchedulePaymentSubmit = (data: SchedulePaymentFormData) => {
    const selectedPayee = payees.find(p => p.id === data.payeeId);
    if (!selectedPayee) return;

    const newPayment: Payment = {
      id: `payment_${Date.now()}`,
      payeeId: data.payeeId,
      payeeName: selectedPayee.name,
      amount: data.amount,
      paymentDate: data.paymentDate,
      status: 'Scheduled',
      frequency: data.frequency,
    };
    setUpcomingPayments([...upcomingPayments, newPayment].sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime()));
    schedulePaymentForm.reset({ payeeId: '', amount: 0, paymentDate: new Date().toISOString().split('T')[0], frequency: 'One-time' });
    setIsSchedulePaymentDialogOpen(false);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <div className="flex flex-1">
        <CollapsibleAppSidebar />
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-foreground">Bill Pay</h1>
            <Dialog open={isSchedulePaymentDialogOpen} onOpenChange={setIsSchedulePaymentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Schedule New Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Schedule New Payment</DialogTitle>
                  <DialogDescription>
                    Set up a new one-time or recurring payment.
                  </DialogDescription>
                </DialogHeader>
                <Form {...schedulePaymentForm}>
                  <form onSubmit={schedulePaymentForm.handleSubmit(handleSchedulePaymentSubmit)} className="space-y-4">
                    <FormField
                      control={schedulePaymentForm.control}
                      name="payeeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payee</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a payee" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {payees.map(payee => (
                                <SelectItem key={payee.id} value={payee.id}>{payee.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={schedulePaymentForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount ($)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0.00" {...field} step="0.01" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={schedulePaymentForm.control}
                      name="paymentDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} min={today} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={schedulePaymentForm.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="One-time">One-time</SelectItem>
                              <SelectItem value="Monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                         <Button type="button" variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Schedule Payment</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Manage Payees Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Payees</CardTitle>
                <CardDescription>Add, edit, or remove your bill payees.</CardDescription>
              </div>
              <Dialog open={isAddPayeeDialogOpen} onOpenChange={setIsAddPayeeDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Payee
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Payee</DialogTitle>
                  </DialogHeader>
                  <Form {...payeeForm}>
                    <form onSubmit={payeeForm.handleSubmit(handleAddPayeeSubmit)} className="space-y-4 py-4">
                      <FormField
                        control={payeeForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payee Name</FormLabel>
                            <FormControl><Input placeholder="e.g., City Electric" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={payeeForm.control}
                        name="accountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl><Input placeholder="e.g., 1234567890" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={payeeForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category (Optional)</FormLabel>
                            <FormControl><Input placeholder="e.g., Utilities" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <DialogClose asChild>
                           <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Add Payee</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payees.length > 0 ? payees.map(payee => (
                    <TableRow key={payee.id}>
                      <TableCell className="font-medium">{payee.name}</TableCell>
                      <TableCell>{payee.accountNumber}</TableCell>
                      <TableCell>{payee.category || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditPayeeDialog(payee)}>
                                    <Edit3 className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeletePayee(payee.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">No payees added yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Upcoming Payments Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Payments</CardTitle>
              <CardDescription>View your scheduled future payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payee</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingPayments.length > 0 ? upcomingPayments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.payeeName}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{new Date(payment.paymentDate + 'T00:00:00').toLocaleDateString()}</TableCell>
                      <TableCell>{payment.frequency}</TableCell>
                      <TableCell><Badge variant={payment.status === 'Scheduled' ? 'default' : 'secondary'}>{payment.status}</Badge></TableCell>
                    </TableRow>
                  )) : (
                     <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">No upcoming payments.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Payment History Section */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Review your past bill payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payee</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Date</TableHead>
                     <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                 {paymentHistory.length > 0 ? paymentHistory.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.payeeName}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{new Date(payment.paymentDate + 'T00:00:00').toLocaleDateString()}</TableCell>
                      <TableCell><Badge variant={payment.status === 'Paid' ? 'default' : (payment.status === 'Failed' ? 'destructive' : 'secondary')}>{payment.status}</Badge></TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">No payment history found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Edit Payee Dialog (re-uses payeeForm) */}
          <Dialog open={isEditPayeeDialogOpen} onOpenChange={setIsEditPayeeDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Payee</DialogTitle>
                <DialogDescription>Update the details for {payeeToEdit?.name}.</DialogDescription>
              </DialogHeader>
              <Form {...payeeForm}>
                <form onSubmit={payeeForm.handleSubmit(handleEditPayeeSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={payeeForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payee Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={payeeForm.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={payeeForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category (Optional)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline" onClick={() => {setIsEditPayeeDialogOpen(false); setPayeeToEdit(null); payeeForm.reset();}}>Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

        </main>
      </div>
      <AppFooter />
    </div>
  );
};

export default BillPayPage;