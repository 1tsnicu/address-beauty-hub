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

        // Verificăm statusul plății folosind procesarea callback-ului
        // MAIB trimite datele direct în URL params, le procesăm corect
        const callbackData: Record<string, any> = {
          orderId: orderIdParam,
          payId: payId,
          status: statusParam || 'FAILED',
        };

        // Adăugăm toți parametrii din URL
        searchParams.forEach((value, key) => {
          if (key !== 'orderId' && key !== 'payId' && key !== 'status') {
            callbackData[key] = value;
          }
        });

        // Procesăm callback-ul cu verificare semnătură
        const paymentStatus = await maibPaymentService.processCallback(callbackData);

        if (paymentStatus.status === 'SUCCESS') {
          // Plata a fost confirmată - acum salvăm comanda în baza de date
          // NU salvăm informații despre plată (payId, transactionId, etc.)
          try {
            // Recuperăm datele comenzii din sessionStorage
            const pendingOrderData = sessionStorage.getItem('pendingOrder');
            
            if (pendingOrderData) {
              const { orderData } = JSON.parse(pendingOrderData);
              
              // Salvăm comanda în baza de date doar după confirmarea plății
              const result = await orderService.createOrder(orderData);
              
              if (result.success) {
                // Ștergem datele temporare
                sessionStorage.removeItem('pendingOrder');
                
                // Actualizăm statusul comenzii la confirmed
                if (result.order?.id) {
                  await orderService.confirmOrderAfterPayment(result.order.id);
                }
                
                setStatus('success');
                clearCart();
                toast.success('Plata a fost procesată cu succes!');
                
                // Redirecționăm către pagina de confirmare
                setTimeout(() => {
                  navigate(`/comanda-confirmata?orderId=${result.order?.id}`);
                }, 2000);
              } else {
                throw new Error(result.error || 'Eroare la salvarea comenzii');
              }
            } else {
              // Dacă nu avem date în sessionStorage, doar confirmăm plata
              setStatus('success');
              clearCart();
              toast.success('Plata a fost procesată cu succes!');
              setTimeout(() => {
                navigate('/comanda-confirmata');
              }, 2000);
            }
          } catch (error) {
            console.error('Error saving order after payment:', error);
            setStatus('success'); // Plata a fost procesată, chiar dacă salvarea comenzii a eșuat
            toast.success('Plata a fost procesată cu succes!');
            sessionStorage.removeItem('pendingOrder');
            setTimeout(() => {
              navigate('/comanda-confirmata');
            }, 2000);
          }
        } else {
          // Plata a eșuat - ștergem datele temporare
          sessionStorage.removeItem('pendingOrder');
          
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

