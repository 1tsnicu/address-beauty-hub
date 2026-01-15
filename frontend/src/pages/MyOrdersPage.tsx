import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService, Order } from '@/services/orderService';
import { maibPaymentService } from '@/services/maibPaymentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Calendar, DollarSign, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const STORAGE_KEY = 'my_orders_ids';

const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [refundAmount, setRefundAmount] = useState<string>('');
  const [refundProcessing, setRefundProcessing] = useState(false);

  // Obține ID-urile comenzilor din localStorage
  const getOrderIds = (): string[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading order IDs from localStorage:', error);
    }
    return [];
  };

  // Obține payId-ul pentru o comandă din localStorage
  const getPayIdForOrder = (orderId: string): string | null => {
    try {
      const PAYID_STORAGE_KEY = 'order_payids';
      const payIds = JSON.parse(localStorage.getItem(PAYID_STORAGE_KEY) || '{}');
      return payIds[orderId] || null;
    } catch (error) {
      console.error('Error reading payId from localStorage:', error);
      return null;
    }
  };

  // Încarcă comenzile pe baza ID-urilor salvate
  const loadOrders = async () => {
    const orderIds = getOrderIds();
    if (orderIds.length === 0) {
      setOrders([]);
      return;
    }

    setLoading(true);
    try {
      const ordersPromises = orderIds.map(id => orderService.getOrderById(id));
      const results = await Promise.all(ordersPromises);
      
      const loadedOrders: Order[] = [];
      for (const result of results) {
        if (result.success && result.order) {
          // Adăugăm payId din localStorage (dacă există) pentru comenzile plătite cu card
          const payId = getPayIdForOrder(result.order.id!);
          if (payId && result.order.payment?.method === 'card') {
            result.order.payment.maibPayId = payId;
          }
          loadedOrders.push(result.order);
        }
      }
      
      // Sortăm după dată (cele mai recente primele)
      loadedOrders.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      
      setOrders(loadedOrders);
    } catch (error) {
      toast.error('A apărut o eroare la încărcarea comenzilor');
    } finally {
      setLoading(false);
    }
  };

  // Efect pentru încărcarea automată a comenzilor
  useEffect(() => {
    loadOrders();
  }, []);

  const handleRefundClick = (order: Order) => {
    if (!order.payment?.maibPayId) {
      toast.error('Această comandă nu poate fi returnată (nu a fost plătită cu card)');
      return;
    }
    setSelectedOrder(order);
    setRefundAmount('');
    setRefundDialogOpen(true);
  };

  const handleRefundSubmit = async () => {
    if (!selectedOrder?.payment?.maibPayId) {
      return;
    }

    setRefundProcessing(true);
    try {
      const amount = refundAmount.trim() ? parseFloat(refundAmount.trim()) : undefined;
      
      if (amount !== undefined && (isNaN(amount) || amount <= 0)) {
        toast.error('Suma invalidă');
        setRefundProcessing(false);
        return;
      }

      const refundResponse = await maibPaymentService.refundPayment({
        payId: selectedOrder.payment.maibPayId,
        refundAmount: amount,
      });

      if (refundResponse.ok && refundResponse.status === 'OK') {
        toast.success('Returnarea a fost procesată cu succes!');
        setRefundDialogOpen(false);
        // Reîncărcăm comenzile
        await loadOrders();
      } else if (refundResponse.status === 'REVERSED') {
        toast.error('Tranzacția a fost deja returnată anterior. Refund-urile repetate nu sunt permise.');
      } else {
        const errorMsg = refundResponse.raw?.errors?.[0]?.errorMessage || 
                         refundResponse.statusMessage || 
                         'Returnarea nu a putut fi procesată';
        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Eroare la procesarea returnării';
      toast.error(errorMessage);
    } finally {
      setRefundProcessing(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (amount: number) => {
    return `${amount.toFixed(2)} MDL`;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'În așteptare', variant: 'outline' },
      confirmed: { label: 'Confirmată', variant: 'default' },
      processing: { label: 'În procesare', variant: 'default' },
      shipped: { label: 'Expediată', variant: 'default' },
      delivered: { label: 'Livrată', variant: 'default' },
      cancelled: { label: 'Anulată', variant: 'destructive' },
    };

    const statusInfo = statusMap[status] || { label: status, variant: 'outline' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Înapoi
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Comenzile Mele
            </h1>
            <p className="text-xl text-muted-foreground">
              Verifică statusul comenzilor tale și gestionează returnările
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Comandă #{order.id?.substring(0, 8).toUpperCase()}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(order.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {formatPrice(order.totals.total)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(order.status)}
                      {order.payment?.method === 'card' && order.payment?.maibPayId && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRefundClick(order)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Returnare
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Produse:</h4>
                      <ul className="space-y-1">
                        {order.items.map((item, index) => (
                          <li key={index} className="text-sm">
                            {item.quantity}x {item.name} - {formatPrice(item.price * item.quantity)}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Subtotal:</span> {formatPrice(order.totals.subtotal)}
                      </div>
                      <div>
                        <span className="font-semibold">Livrare:</span> {formatPrice(order.totals.delivery || 0)}
                      </div>
                      <div className="col-span-2">
                        <span className="font-semibold">Total:</span> {formatPrice(order.totals.total)}
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Metodă de plată:</span>{' '}
                      {order.payment?.method === 'card' ? 'Card' : 
                       order.payment?.method === 'cash' ? 'Numerar' : 
                       order.payment?.method === 'transfer' ? 'Transfer bancar' : 'N/A'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {orders.length === 0 && !loading && (
          <Alert>
            <Package className="h-4 w-4" />
            <AlertDescription>
              Nu ai comenzi plasate. Comenzile tale vor apărea aici după ce le plasezi.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Dialog pentru refund */}
      <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Returnare Plată</DialogTitle>
            <DialogDescription>
              Efectuează returnarea pentru comanda #{selectedOrder?.id?.substring(0, 8).toUpperCase()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="refundAmount">
                Sumă de returnat (opțional)
              </Label>
              <Input
                id="refundAmount"
                type="number"
                step="0.01"
                min="0.01"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="Lăsați gol pentru returnare completă"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Dacă lăsați gol, se va returna întreaga sumă a plății ({selectedOrder && formatPrice(selectedOrder.totals.total)})
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRefundDialogOpen(false)}
              disabled={refundProcessing}
            >
              Anulează
            </Button>
            <Button
              onClick={handleRefundSubmit}
              disabled={refundProcessing}
            >
              {refundProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Se procesează...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Efectuează Returnarea
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyOrdersPage;
