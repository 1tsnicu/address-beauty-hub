import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { maibPaymentService, MaibRefundRequest } from '@/services/maibPaymentService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const RefundPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const payId = searchParams.get('payId');
  
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!payId) {
      toast.error('PayId lipsă');
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const refundRequest: MaibRefundRequest = {
        payId: payId,
      };

      if (amount) {
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
          toast.error('Suma invalidă');
          setIsProcessing(false);
          return;
        }
        refundRequest.refundAmount = amountNum;
      }

      const refundResponse = await maibPaymentService.refundPayment(refundRequest);

      if (refundResponse.ok && refundResponse.status === 'OK') {
        const message = `Returnarea a fost procesată cu succes! 
          ${refundResponse.statusMessage || ''}
          ${refundResponse.refundAmount ? `Suma returnată: ${refundResponse.refundAmount}` : ''}
          ${refundResponse.orderId ? `Order ID: ${refundResponse.orderId}` : ''}`;
        setResult({
          success: true,
          message: message.trim(),
        });
        toast.success('Returnarea a fost procesată cu succes!');
      } else if (refundResponse.status === 'REVERSED') {
        setResult({
          success: false,
          message: 'Tranzacția a fost deja returnată anterior. Refund-urile repetate nu sunt permise.',
        });
        toast.error('Tranzacția a fost deja returnată anterior.');
      } else {
        const errorMsg = refundResponse.raw?.errors?.[0]?.errorMessage || 
                        refundResponse.statusMessage || 
                        'Returnarea nu a putut fi procesată';
        setResult({
          success: false,
          message: errorMsg,
        });
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Refund Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Eroare la procesarea returnării';
      setResult({
        success: false,
        message: errorMessage,
      });
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Înapoi
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Returnare Plată MAIB
            </h1>
            <p className="text-xl text-muted-foreground">
              Efectuează returnarea unei plăți procesate prin MAIB
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Returnare Plată</CardTitle>
          </CardHeader>
          <CardContent>
            {payId && (
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Pay ID:</p>
                <p className="font-mono font-semibold">{payId}</p>
              </div>
            )}

            {!payId && (
              <Alert className="mb-6">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  PayId lipsă. Te rugăm să accesezi pagina de returnare cu parametrul payId în URL.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleRefund} className="space-y-6">
              <div>
                <Label htmlFor="amount">
                  Sumă de returnat (opțional)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Lăsați gol pentru returnare completă"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Dacă lăsați gol, se va returna întreaga sumă a plății
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isProcessing || !payId}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Se procesează...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Efectuează Returnarea
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin')}
                >
                  Anulează
                </Button>
              </div>
            </form>

            {result && (
              <Alert className={`mt-6 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={result.success ? 'text-green-800' : 'text-red-800'}>
                  {result.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RefundPage;
