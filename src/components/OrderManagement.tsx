import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Eye,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { OrderService } from '@/lib/firebaseService';
import { Order } from '@/types/Order';
import { toast } from 'sonner';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const statusConfig = {
  pending: { label: 'În așteptare', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  processing: { label: 'În procesare', color: 'bg-blue-100 text-blue-800', icon: Package },
  shipped: { label: 'Expediat', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Livrat', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Anulat', color: 'bg-red-100 text-red-800', icon: XCircle }
};

const OrderManagement: React.FC = () => {
  const { currency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load orders from Firebase
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const orderData = await OrderService.getAllOrders();
      setOrders(orderData);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Eroare la încărcarea comenzilor');
      toast.error('Nu s-au putut încărca comenzile');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      toast.success('Statusul comenzii a fost actualizat cu succes!');
      loadOrders(); // Refresh orders list
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Eroare la actualizarea statusului comenzii');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestionare Comenzi</h2>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comenzi</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              în ultimele 30 zile
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">În Așteptare</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              necesită procesare
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">În Procesare</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{processingOrders}</div>
            <p className="text-xs text-muted-foreground">
              în preparare
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Venituri</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalRevenue.toFixed(2)} {currency}
            </div>
            <p className="text-xs text-muted-foreground">
              comenzi livrate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Caută comenzi (ID, nume client, email)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Toate statusurile" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate statusurile</SelectItem>
            {Object.entries(statusConfig).map(([status, config]) => (
              <SelectItem key={status} value={status}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista Comenzilor</CardTitle>
          <CardDescription>
            Toate comenzile din sistem cu posibilitatea de gestionare
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">Nu au fost găsite comenzi</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Comandă</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusConfig[order.status as OrderStatus].icon;
                    
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customerInfo.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {order.customerInfo.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(order.createdAt.toISOString())}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig[order.status as OrderStatus].color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[order.status as OrderStatus].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {order.total.toFixed(2)} {currency}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openOrderDetails(order)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Detalii
                            </Button>
                            
                            {order.status === 'pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'processing')}
                                className="text-blue-600 hover:bg-blue-50"
                              >
                                Procesează
                              </Button>
                            )}
                            
                            {order.status === 'processing' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'shipped')}
                                className="text-purple-600 hover:bg-purple-50"
                              >
                                Expediază
                              </Button>
                            )}
                            
                            {order.status === 'shipped' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                                className="text-green-600 hover:bg-green-50"
                              >
                                Marchează livrat
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalii Comandă {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Informații complete despre comandă și client
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status and Date */}
              <div className="flex justify-between items-start">
                <div>
                  <Badge className={statusConfig[selectedOrder.status as OrderStatus].color}>
                    {statusConfig[selectedOrder.status as OrderStatus].label}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Comandat pe {formatDate(selectedOrder.createdAt.toISOString())}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {selectedOrder.total.toFixed(2)} {currency}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total comandă
                  </p>
                </div>
              </div>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informații Client
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nume complet</p>
                      <p className="font-medium">{selectedOrder.customerInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {selectedOrder.customerInfo.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefon</p>
                      <p className="font-medium flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {selectedOrder.customerInfo.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Adresa de livrare</p>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedOrder.customerInfo.address}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Produse Comandate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Cantitate: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {(item.price * item.quantity).toFixed(2)} {currency}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.price.toFixed(2)} {currency} / buc
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment and Delivery Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Plată</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">
                      {selectedOrder.paymentMethod === 'card' ? 'Card bancar' : 'Plată la livrare'}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Livrare</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">
                      {selectedOrder.shippingMethod === 'standard' && 'Livrare standard'}
                      {selectedOrder.shippingMethod === 'express' && 'Livrare express'}
                      {selectedOrder.shippingMethod === 'pickup' && 'Ridicare din magazin'}
                      {selectedOrder.shippingMethod === 'digital' && 'Produs digital'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Observații</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{selectedOrder.notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2 pt-4">
                {selectedOrder.status === 'pending' && (
                  <Button onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}>
                    Marchează în procesare
                  </Button>
                )}
                {selectedOrder.status === 'processing' && (
                  <Button onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}>
                    Marchează expediat
                  </Button>
                )}
                {selectedOrder.status === 'shipped' && (
                  <Button onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}>
                    Marchează livrat
                  </Button>
                )}
                <Button variant="outline" onClick={() => setShowOrderDialog(false)}>
                  Închide
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;
