@@ .. @@
 'use client';
 
 import { useState } from 'react';
+import { MainLayout } from '@/components/layout/main-layout';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
@@ .. @@
 import { useUser } from '@/lib/hooks/use-user';
-import { useLoans } from '@/lib/hooks/use-loans';
+import { useBNPL } from '@/lib/hooks/use-bnpl';
 import { 
@@ .. @@
   Settings
 } from 'lucide-react';
-import { LoanApplication } from './loan-application';
+import { BNPLApplication } from './bnpl-application';
 import { PaymentSchedule } from './payment-schedule';
@@ .. @@
 export function Dashboard() {
   const { user, loading: userLoading } = useUser();
-  const { loans, loading: loansLoading } = useLoans();
+  const { purchases, loading: bnplLoading } = useBNPL();
   const [activeTab, setActiveTab] = useState('overview');
-  const [showLoanModal, setShowLoanModal] = useState(false);
+  const [showBNPLModal, setShowBNPLModal] = useState(false);
 
-  if (userLoading || loansLoading) {
+  if (userLoading || bnplLoading) {
     return <div className="p-8">Loading...</div>;
   }
 
-  const totalDebt = loans.reduce((sum, loan) => sum + loan.remainingBalance, 0);
-  const nextPayment = loans.reduce((sum, loan) => sum + loan.nextPaymentAmount, 0);
+  const totalDebt = purchases.reduce((sum, purchase) => sum + purchase.remainingBalance, 0);
+  const nextPayment = purchases.reduce((sum, purchase) => sum + purchase.nextPaymentAmount, 0);
   const creditUtilization = user ? (totalDebt / (user.creditScore * 100)) * 100 : 0;
 
   return (
-    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
+    <MainLayout>
+      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
       {/* Header */}
@@ .. @@
               <div>
                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                 <p className="text-gray-600 dark:text-gray-300">Welcome back, {user?.address.slice(0, 6)}...{user?.address.slice(-4)}</p>
               </div>
             </div>
             <div className="flex items-center space-x-3">
               <Button variant="outline" size="sm">
                 <Bell className="w-4 h-4 mr-2" />
                 Notifications
               </Button>
               <Button variant="outline" size="sm">
                 <Settings className="w-4 h-4 mr-2" />
                 Settings
               </Button>
             </div>
           </div>
         </div>
       </header>
 
       <div className="p-6">
         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
           <TabsList className="grid w-full grid-cols-6">
             <TabsTrigger value="overview">Overview</TabsTrigger>
-            <TabsTrigger value="loans">Loans</TabsTrigger>
+            <TabsTrigger value="bnpl">BNPL</TabsTrigger>
             <TabsTrigger value="payments">Payments</TabsTrigger>
@@ .. @@
                 <CardContent>
                   <div className="text-2xl font-bold">KES {totalDebt.toLocaleString()}</div>
                   <p className="text-xs text-muted-foreground">
-                    Across {loans.length} active loans
+                    Across {purchases.length} active purchases
                   </p>
@@ .. @@
               <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
-                    onClick={() => setShowLoanModal(true)}>
+                    onClick={() => setShowBNPLModal(true)}>
                 <CardHeader>
                   <CardTitle className="flex items-center space-x-2">
                     <PlusCircle className="w-5 h-5 text-green-600" />
-                    <span>Apply for Loan</span>
+                    <span>Shop with BNPL</span>
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <p className="text-gray-600 dark:text-gray-300">
-                    Get instant approval for loans up to KES {((user?.creditScore || 0) * 100).toLocaleString()}
+                    Get instant approval for purchases up to KES {((user?.creditScore || 0) * 100).toLocaleString()}
                   </p>
                   <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
-                    Apply Now
+                    Start Shopping
                   </Button>
                 </CardContent>
               </Card>
@@ .. @@
                 <CardContent>
                   <p className="text-gray-600 dark:text-gray-300">
-                    Pay your loans early and improve your credit score
+                    Pay your BNPL purchases early and improve your credit score
                   </p>
@@ .. @@
                     {
                       type: 'payment',
                       description: 'Loan payment received',
+                      description: 'BNPL payment received',
                       amount: 'KES 8,750',
@@ .. @@
                     {
-                      type: 'loan',
-                      description: 'New loan disbursed',
+                      type: 'purchase',
+                      description: 'New purchase completed',
                       amount: 'USD 1,500',
@@ .. @@
           </TabsContent>
 
-          <TabsContent value="loans">
-            <LoanApplication />
+          <TabsContent value="bnpl">
+            <BNPLApplication />
           </TabsContent>
@@ .. @@
         </Tabs>
       </div>
 
-      {/* Loan Application Modal */}
-      {showLoanModal && (
-        <LoanApplication onClose={() => setShowLoanModal(false)} />
+      {/* BNPL Application Modal */}
+      {showBNPLModal && (
+        <BNPLApplication onClose={() => setShowBNPLModal(false)} />
       )}
-    </div>
+      </div>
+    </MainLayout>
   );