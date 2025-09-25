import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, ShoppingCart, MapPin, Phone, Mail, 
  Calendar, Clock, Package, ArrowLeft, Download, Share2
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  variants?: Record<string, string>;
}

interface Order {
  id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      county: string;
    };
  };
  items: OrderItem[];
  delivery: {
    method: string;
    price: number;
  };
  payment: {
    method: string;
  };
  totals: {
    subtotal: number;
    delivery: number;
    total: number;
  };
  notes: string;
  status: string;
  createdAt: string;
}

const OrderConfirmationPage = () => {
  const { t } = useLanguage();
  const { getCurrencySymbol } = useCurrency();
  const location = useLocation();
  const order = location.state?.order as Order;

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Comanda nu a fost găsită</h1>
          <Link to="/magazin">
            <Button>Înapoi la Magazin</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getDeliveryMethodLabel = (method: string) => {
    switch (method) {
      case 'standard':
        return 'Livrare standard (2-3 zile lucrătoare)';
      case 'express':
        return 'Livrare express (1 zi lucrătoare)';
      case 'pickup':
        return 'Ridicare din magazin';
      default:
        return method;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'card':
        return 'Card bancar';
      case 'cash':
        return 'Ramburs la livrare';
      case 'transfer':
        return 'Transfer bancar';
      default:
        return method;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">În așteptare</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Confirmată</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Se procesează</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Expediată</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Livrată</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadInvoice = () => {
    // In a real app, this would generate and download a PDF invoice
    toast.success('Factura va fi trimisă pe email');
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Comanda mea - Address Beauty',
        text: `Am plasat comanda #${order.id} pe Address Beauty`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`Comanda #${order.id} - Address Beauty`);
      toast.success('Link-ul a fost copiat în clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-green-50 via-background to-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/magazin">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Înapoi la magazin
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Comanda a fost plasată cu succes!
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Mulțumim pentru încrederea acordată!
            </p>
            <p className="text-lg text-muted-foreground">
              Numărul comenzii: <span className="font-bold text-primary">#{order.id}</span>
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Detalii Comandă
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Status comanda</p>
                    <p className="text-sm text-muted-foreground">Plasată pe {formatDate(order.createdAt)}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <Separator />

                {/* Order Items */}
                <div className="space-y-3">
                  <h4 className="font-medium">Produse comandate</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm truncate">{item.name}</h5>
                        <p className="text-xs text-muted-foreground">
                          Cantitate: {item.quantity}
                        </p>
                        {item.variants && Object.keys(item.variants).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(item.variants).map(([key, value]) => (
                              <Badge key={key} variant="outline" className="text-xs">
                                {key}: {value}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {getCurrencySymbol()}{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({order.items.length} produse)</span>
                    <span>{getCurrencySymbol()}{order.totals.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livrare</span>
                    <span>
                      {order.totals.delivery === 0 ? 'Gratuit' : `${getCurrencySymbol()}${order.totals.delivery}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{getCurrencySymbol()}{order.totals.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Informații Client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nume complet</p>
                    <p className="font-medium">{order.customer.firstName} {order.customer.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {order.customer.email}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telefon</p>
                  <p className="font-medium flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {order.customer.phone}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Adresa de livrare</p>
                  <p className="font-medium">
                    {order.customer.address.street}<br />
                    {order.customer.address.city}, {order.customer.address.postalCode}<br />
                    Județul {order.customer.address.county}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Delivery & Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Livrare și Plată
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Metoda de livrare</p>
                    <p className="font-medium">{getDeliveryMethodLabel(order.delivery.method)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Metoda de plată</p>
                    <p className="font-medium">{getPaymentMethodLabel(order.payment.method)}</p>
                  </div>
                </div>

                {order.notes && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Observații</p>
                    <p className="font-medium">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Următorii pași</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Comanda a fost plasată</p>
                      <p className="text-xs text-muted-foreground">Ai primit confirmarea pe email</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Se procesează comanda</p>
                      <p className="text-xs text-muted-foreground">În următoarele 24 de ore</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Se expediază</p>
                      <p className="text-xs text-muted-foreground">Conform metodei alese</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button 
                    onClick={handleDownloadInvoice}
                    variant="outline" 
                    className="w-full justify-start gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Descarcă factura
                  </Button>
                  
                  <Button 
                    onClick={handleShareOrder}
                    variant="outline" 
                    className="w-full justify-start gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Partajează comanda
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Link to="/magazin" className="block">
                    <Button className="w-full">
                      Continuă cumpărăturile
                    </Button>
                  </Link>
                  
                  <Link to="/contact" className="block">
                    <Button variant="outline" className="w-full">
                      Contactează-ne
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
