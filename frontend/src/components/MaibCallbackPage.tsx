import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { maibPaymentService } from '@/services/maibPaymentService';
import { orderService } from '@/services/orderService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const MaibCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Extragem parametrii din URL
        const payId = searchParams.get('payId');
        const orderIdParam = searchParams.get('orderId');
        const statusParam = searchParams.get('status');

        if (!payId || !orderIdParam) {
          throw new Error('Parametri lipsă în callback');
        }

        setOrderId(orderIdParam);

        // Verificăm statusul plății
        const paymentStatus = await maibPaymentService.checkPaymentStatus(payId);

        if (paymentStatus.status === 'SUCCESS') {
          // Actualizăm comanda în baza de date cu statusul de plată
          try {
            await orderService.updateMaibPaymentStatus(
              orderIdParam,
              payId,
              paymentStatus.transactionId,
              'SUCCESS',
              paymentStatus as any
            );
            setStatus('success');
            clearCart();
            toast.success('Plata a fost procesată cu succes!');
            
            // Redirecționăm către pagina de confirmare după 2 secunde
            setTimeout(() => {
              navigate(`/comanda-confirmata?orderId=${orderIdParam}`);
            }, 2000);
          } catch (error) {
            console.error('Error updating order:', error);
            setStatus('success'); // Plata a fost procesată, chiar dacă actualizarea comenzii a eșuat
            toast.success('Plata a fost procesată cu succes!');
            setTimeout(() => {
              navigate(`/comanda-confirmata?orderId=${orderIdParam}`);
            }, 2000);
          }
        } else {
          // Actualizăm statusul plății ca FAILED
          try {
            await orderService.updateMaibPaymentStatus(
              orderIdParam,
              payId,
              paymentStatus.transactionId,
              paymentStatus.status === 'CANCELLED' ? 'CANCELLED' : 'FAILED',
              paymentStatus as any
            );
          } catch (error) {
            console.error('Error updating payment status:', error);
          }
          
          setStatus('failed');
          toast.error(
            paymentStatus.errorMessage || 
            'Plata nu a putut fi procesată. Te rugăm să încerci din nou.'
          );
        }
      } catch (error) {
        console.error('MAIB Callback Error:', error);
        setStatus('failed');
        toast.error('Eroare la procesarea răspunsului de plată.');
      }
    };

    processCallback();
  }, [searchParams, navigate, clearCart]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 mx-auto mb-4 text-primary animate-spin" />
              <h2 className="text-2xl font-bold mb-2">Se procesează plata...</h2>
              <p className="text-muted-foreground">
                Te rugăm să aștepți în timp ce verificăm statusul plății.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-2 text-green-600">Plată reușită!</h2>
              <p className="text-muted-foreground mb-4">
                Plata ta a fost procesată cu succes. Vei fi redirecționat către pagina de confirmare...
              </p>
              {orderId && (
                <p className="text-sm text-muted-foreground">
                  ID comandă: {orderId.substring(0, 8)}
                </p>
              )}
            </>
          )}

          {status === 'failed' && (
            <>
              <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
              <h2 className="text-2xl font-bold mb-2 text-red-600">Plată eșuată</h2>
              <p className="text-muted-foreground mb-6">
                Plata nu a putut fi procesată. Te rugăm să încerci din nou sau să alegi altă metodă de plată.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/checkout')} variant="outline">
                  Înapoi la checkout
                </Button>
                <Button onClick={() => navigate('/magazin')}>
                  Continuă cumpărăturile
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MaibCallbackPage;

