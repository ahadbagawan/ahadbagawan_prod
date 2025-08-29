
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, ArrowRight, History, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import ProtectedPage from '@/components/auth/ProtectedPage';
import { useAuth } from '@/context/AuthContext';


function CustomerInfoContent() {
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { logout } = useAuth();

  useEffect(() => {
    setIsMounted(true);
    const savedBill = localStorage.getItem('akbTradersCurrentBill');
    if (savedBill) {
        try {
            const bill = JSON.parse(savedBill);
            if (bill.customerName) setCustomerName(bill.customerName);
            if (bill.date) setDate(new Date(bill.date));
        } catch (error) {
            console.error("Failed to parse current bill from localStorage", error);
            localStorage.removeItem('akbTradersCurrentBill');
        }
    }
  }, []);

  const handleNext = () => {
    if (!customerName) {
        toast({
            title: "Customer Name Required",
            description: "Please enter a customer name to continue.",
            variant: "destructive",
        });
        return;
    }

    const savedBill = localStorage.getItem('akbTradersCurrentBill');
    const currentBill = savedBill ? JSON.parse(savedBill) : {};
    
    const updatedBill = {
        ...currentBill,
        customerName,
        date: (date || new Date()).toISOString(),
    };

    localStorage.setItem('akbTradersCurrentBill', JSON.stringify(updatedBill));
    router.push('/inventory');
  };
  
  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    setCustomerName(capitalizedValue);
  };
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!isMounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">
            AKB TRADERS
          </h1>
          <div className="text-muted-foreground mt-2 text-sm">
            <p>Muslim Galli Corner, Angol Belagavi.</p>
            <p>Contact: +919916347868 / +91 8971570309</p>
          </div>
        </header>

        <Card className="shadow-2xl shadow-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl">Customer Information</CardTitle>
            <CardDescription>Enter the customer's details to start a new bill.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="customerName" className="font-medium text-sm">Customer Name *</label>
               <Input
                    id="customerName"
                    type="text"
                    placeholder="Enter customer's name"
                    value={customerName}
                    onChange={handleCustomerNameChange}
                    className="font-medium bg-transparent focus-visible:ring-1"
                />
            </div>
             <div className="space-y-2">
                <label htmlFor="billDate" className="font-medium text-sm">Bill Date</label>
                 <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="billDate"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
            </div>
            <Button onClick={handleNext} className="w-full">
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        <div className="mt-4 flex justify-center gap-4">
            <Link href="/history" passHref>
                <Button variant="outline">
                    <History className="mr-2 h-4 w-4" /> View History
                </Button>
            </Link>
             <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
        </div>
      </div>
    </main>
  );
}

export default function CustomerInfoPage() {
    return (
        <ProtectedPage>
            <CustomerInfoContent />
        </ProtectedPage>
    )
}
