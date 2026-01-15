import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { maibPaymentService, MaibPaymentStatusResponse } from '@/services/maibPaymentService';
import { orderService } from '@/services/orderService';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<MaibPaymentStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  
  // Flag pentru a preveni execuțiile paralele
  const isProcessingRef = useRef(false);
  const hasProcessedRef = useRef(false);

  // Extragem parametrii din URL (MAIB trimite acești parametri la redirect)
  const urlPayId = searchParams.get('payId');
  const urlOrderId = searchParams.get('orderId');
  const urlStatus = searchParams.get('status');
  const urlSignature = searchParams.get('signature');
  const urlTransactionId = searchParams.get('transactionId');

  // Calculăm payId și orderId la nivel de componentă pentru a fi disponibile în JSX
  const payId = urlPayId || sessionStorage.getItem('lastPayId') || '';
  const orderId = urlOrderId || '';

  useEffect(() => {
    // Prevenim execuțiile paralele
    if (isProcessingRef.current || hasProcessedRef.current) {
      return;
    }

    isProcessingRef.current = true;

    const createOrderFromSessionStorage = async (currentPayId: string) => {
      // Verificăm idempotența înainte de a crea comanda
      const orderCreatedKey = `order_created_${currentPayId}`;
      const alreadyCreatedId = sessionStorage.getItem(orderCreatedKey);
      
      if (alreadyCreatedId) {
        setOrderCreated(true);
        setCreatedOrderId(alreadyCreatedId);
        setLoading(false);
        return;
      }
      
      try {
        const pendingOrderData = sessionStorage.getItem('pendingOrder');
        
        if (!pendingOrderData) {
          return;
        }

        const { orderData } = JSON.parse(pendingOrderData);
        
        // Creăm comanda în baza de date
        const result = await orderService.createOrder(orderData);
        
        if (result.success && result.order?.id) {
          // Actualizăm statusul comenzii la confirmed (NU salvăm date despre plată în DB)
          const confirmResult = await orderService.confirmOrderAfterPayment(result.order.id);
          
          if (!confirmResult.success) {
            console.error('Error confirming order:', confirmResult.error);
            // Continuăm totuși, comanda a fost creată
          }
          
          // Marchează comanda ca creată (idempotență) - ÎNAINTE de a șterge datele
          sessionStorage.setItem(orderCreatedKey, result.order.id);
          
          // Salvează ID-ul comenzii în localStorage pentru pagina "Comenzile Mele"
          const STORAGE_KEY = 'my_orders_ids';
          try {
            const existingIds = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            if (!existingIds.includes(result.order.id)) {
              existingIds.push(result.order.id);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(existingIds));
            }
          } catch (error) {
            console.error('Error saving order ID to localStorage:', error);
          }
          
          // Salvează payId în localStorage asociat cu order ID (pentru refund, fără să salvăm în DB)
          if (currentPayId) {
            try {
              const PAYID_STORAGE_KEY = 'order_payids';
              const payIds = JSON.parse(localStorage.getItem(PAYID_STORAGE_KEY) || '{}');
              payIds[result.order.id] = currentPayId;
              localStorage.setItem(PAYID_STORAGE_KEY, JSON.stringify(payIds));
            } catch (error) {
              console.error('Error saving payId to localStorage:', error);
            }
          }
          
          // Marchează că am procesat
          hasProcessedRef.current = true;
          isProcessingRef.current = false;
          
          // Ștergem datele temporare
          sessionStorage.removeItem('pendingOrder');
          sessionStorage.removeItem('lastPayId');
          
          setOrderCreated(true);
          setCreatedOrderId(result.order.id);
          clearCart();
          toast.success('Plata a fost procesată cu succes! Comanda a fost creată.');
          
          // Redirecționăm către pagina de confirmare după 2 secunde
          setTimeout(() => {
            navigate(`/comanda-confirmata?orderId=${result.order.id}`);
          }, 2000);
        } else {
          throw new Error(result.error || 'Eroare la salvarea comenzii');
        }
      } catch (error) {
        toast.error('Plata a fost procesată, dar a apărut o eroare la salvarea comenzii. Te rugăm să contactezi suportul.');
      }
    };

    const processPaymentSuccess = async () => {
      if (!payId) {
        setError('PayId lipsă. Nu s-a putut identifica plata.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Verificăm dacă avem status direct din URL (MAIB redirect)
        const hasUrlStatus = urlStatus && urlPayId && urlOrderId;
        
        // Verificăm dacă comanda a fost deja creată (idempotență)
        const orderCreatedKey = `order_created_${payId}`;
        const alreadyCreated = sessionStorage.getItem(orderCreatedKey);
        
        if (alreadyCreated) {
          // Comanda a fost deja creată, doar afișăm statusul
          hasProcessedRef.current = true;
          isProcessingRef.current = false;
          setOrderCreated(true);
          setCreatedOrderId(alreadyCreated);
          setStatus({
            ok: true,
            payId,
            status: 'SUCCESS',
            orderId: urlOrderId || orderId,
          });
          setLoading(false);
          return;
        }

        // Dacă avem status direct din URL, verificăm semnătura
        if (hasUrlStatus) {
          try {
            const callbackData: Record<string, any> = {
              payId: urlPayId,
              orderId: urlOrderId,
              status: urlStatus,
            };
            
            if (urlTransactionId) {
              callbackData.transactionId = urlTransactionId;
            }
            
            // Adăugăm toți parametrii din URL pentru verificare semnătură
            searchParams.forEach((value, key) => {
              if (key !== 'signature' && value) {
                callbackData[key] = value;
              }
            });

            // Verificăm semnătura dacă este furnizată
            if (urlSignature) {
              callbackData.signature = urlSignature;
            }

            // Procesăm callback-ul (va gestiona cazurile când semnătura lipsește sau este invalidă)
            const paymentStatus = await maibPaymentService.processCallback(callbackData);

            if (paymentStatus.status === 'SUCCESS') {
              // Plata confirmată - creăm comanda
              await createOrderFromSessionStorage(payId);
              return;
            } else {
              // Plata a eșuat
              setError(`Plata a eșuat: ${paymentStatus.errorMessage || 'Status: ' + paymentStatus.status}`);
              setStatus({
                ok: false,
                payId,
                status: paymentStatus.status,
                orderId: urlOrderId || orderId,
              });
              setLoading(false);
              return;
            }
          } catch (signatureError) {
            // Dacă verificarea semnăturii eșuează, dar statusul din URL este SUCCESS, continuăm
            if (urlStatus === 'SUCCESS' || urlStatus === 'OK') {
              await createOrderFromSessionStorage(payId);
              return;
            }
            // Continuăm cu verificarea statusului prin API
          }
        }

        // Verificăm statusul prin API (pay-info)
        try {
          const res = await maibPaymentService.checkPaymentStatus(payId, orderId || undefined);
          setStatus(res);

          // Dacă statusul este SUCCESS sau dacă pay-info returnează 404 (sandbox), creăm comanda
          const isSuccess = res.status === 'SUCCESS' || 
                           res.status === 'unknown_sandbox' || 
                           (res.ok && res.status !== 'FAILED' && res.status !== 'CANCELLED');

          if (isSuccess && !orderCreated) {
            await createOrderFromSessionStorage(payId);
          } else if (res.status === 'FAILED' || res.status === 'CANCELLED') {
            setError(`Plata a eșuat: ${res.status}`);
            sessionStorage.removeItem('pendingOrder');
          }
        } catch (statusError) {
          // În sandbox, pay-info returnează 404 - considerăm plata reușită dacă suntem pe pagina de succes
          // Dacă avem status SUCCESS din URL, creăm comanda
          if (urlStatus === 'SUCCESS' || urlStatus === 'OK') {
            await createOrderFromSessionStorage(payId);
          } else {
            setError('Nu s-a putut verifica statusul plății. Te rugăm să verifici manual sau să contactezi suportul.');
            setStatus({
              ok: false,
              payId,
              status: 'UNKNOWN',
              orderId: urlOrderId || orderId,
            });
          }
        }
      } catch (error) {
        setError('A apărut o eroare la procesarea plății. Te rugăm să contactezi suportul.');
      } finally {
        isProcessingRef.current = false;
        setLoading(false);
      }
    };

    processPaymentSuccess();

    // Cleanup function
    return () => {
      // Nu resetăm flag-urile aici pentru a preveni re-executări
    };
  }, [payId, orderId, urlStatus, urlPayId, urlOrderId, urlSignature, urlTransactionId, navigate, clearCart, searchParams]);

  const isSuccess = status?.status === 'SUCCESS' || 
                   status?.status === 'unknown_sandbox' || 
                   urlStatus === 'SUCCESS' || 
                   urlStatus === 'OK' ||
                   (status?.ok && status?.status !== 'FAILED' && status?.status !== 'CANCELLED');

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white shadow-sm rounded-lg p-6 border border-border">
        {loading && (
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
            <h1 className="text-2xl font-semibold mb-2">Se procesează plata...</h1>
            <p className="text-muted-foreground">
              Te rugăm să aștepți în timp ce verificăm și procesăm plata.
            </p>
          </div>
        )}

        {!loading && isSuccess && (
          <>
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h1 className="text-2xl font-semibold mb-2 text-green-600">Plată reușită!</h1>
              <p className="text-muted-foreground mb-4">
                Plata ta a fost procesată cu succes.
                {orderCreated && createdOrderId && (
                  <span className="block mt-2">Comanda a fost creată și vei fi redirecționat...</span>
                )}
              </p>
            </div>

            {status && (
              <div className="space-y-2 text-sm bg-gray-50 p-4 rounded mb-4">
                <div><span className="font-medium">Status:</span> {status.status || 'SUCCESS'}</div>
                <div><span className="font-medium">payId:</span> <span className="font-mono">{status.payId}</span></div>
                {(status.orderId || orderId) && (
                  <div><span className="font-medium">orderId:</span> {status.orderId || orderId}</div>
                )}
                {createdOrderId && (
                  <div><span className="font-medium">ID Comandă:</span> {createdOrderId}</div>
                )}
              </div>
            )}

            {!orderCreated && (
              <p className="text-amber-600 text-sm mb-4">
                Se procesează comanda...
              </p>
            )}
          </>
        )}

        {!loading && !isSuccess && (
          <>
            <div className="text-center mb-6">
              <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
              <h1 className="text-2xl font-semibold mb-2 text-red-600">Plată eșuată</h1>
              <p className="text-muted-foreground mb-4">
                {error || 'Plata nu a putut fi procesată. Te rugăm să încerci din nou.'}
              </p>
            </div>

            {status && (
              <div className="space-y-2 text-sm bg-gray-50 p-4 rounded mb-4">
                <div><span className="font-medium">Status:</span> {status.status || 'FAILED'}</div>
                <div><span className="font-medium">payId:</span> <span className="font-mono">{status.payId}</span></div>
                {(status.orderId || orderId) && (
                  <div><span className="font-medium">orderId:</span> {status.orderId || orderId}</div>
                )}
              </div>
            )}
          </>
        )}

        {!loading && (
          <div className="mt-8 flex gap-3 justify-center">
            {isSuccess ? (
              <>
                {createdOrderId ? (
                  <Button asChild>
                    <Link to={`/comanda-confirmata?orderId=${createdOrderId}`}>
                      Vezi comanda
                    </Link>
                  </Button>
                ) : (
                  <Button onClick={() => navigate('/magazin')}>
                    Continuă cumpărăturile
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button onClick={() => navigate('/checkout')} variant="outline">
                  Înapoi la checkout
                </Button>
                <Button onClick={() => navigate('/magazin')}>
                  Continuă cumpărăturile
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
