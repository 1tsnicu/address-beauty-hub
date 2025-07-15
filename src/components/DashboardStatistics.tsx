import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  Star,
  Calendar,
  RefreshCw,
  Download
} from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { OrderService, CustomerService, ProductService } from '@/lib/firebaseService';
import { toast } from 'sonner';

interface DashboardStats {
  overview: {
    totalRevenue: number;
    revenueGrowth: number;
    totalOrders: number;
    ordersGrowth: number;
    totalCustomers: number;
    customersGrowth: number;
    totalProducts: number;
    productsGrowth: number;
    averageOrderValue: number;
    conversionRate: number;
  };
  monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>;
  topProducts: Array<{ id: number; name: string; sales: number; revenue: number }>;
}

const DashboardStatistics: React.FC = () => {
  const { currency } = useCurrency();
  const [timeRange, setTimeRange] = useState('7d');
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data from Firebase
  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get data from Firebase
      const [orders, customers, products] = await Promise.all([
        OrderService.getAllOrders(),
        CustomerService.getAllCustomers(),
        ProductService.getAllProducts()
      ]);

      // Calculate overview statistics
      const totalRevenue = orders
        .filter(order => order.status !== 'cancelled')
        .reduce((sum, order) => sum + order.total, 0);

      const totalOrders = orders.filter(order => order.status !== 'cancelled').length;
      const totalCustomers = customers.length;
      const totalProducts = products.length;
      
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate monthly revenue
      const monthNames = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentYear = new Date().getFullYear();
      
      const monthlyRevenue = monthNames.map((month, index) => {
        const monthOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getFullYear() === currentYear && 
                 orderDate.getMonth() === index &&
                 order.status !== 'cancelled';
        });
        
        const revenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
        return { month, revenue, orders: monthOrders.length };
      });

      // Calculate top products from orders
      const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};
      
      orders.forEach(order => {
        if (order.status !== 'cancelled') {
          order.items.forEach(item => {
            const productId = item.id.toString(); // Using item.id which exists in OrderItem
            if (!productSales[productId]) {
              productSales[productId] = {
                name: item.name,
                sales: 0,
                revenue: 0
              };
            }
            productSales[productId].sales += item.quantity;
            productSales[productId].revenue += item.price * item.quantity;
          });
        }
      });

      const topProducts = Object.entries(productSales)
        .map(([id, data]) => ({ id: parseInt(id), ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setDashboardData({
        overview: {
          totalRevenue,
          revenueGrowth: 25.4, // Placeholder - would need historical data
          totalOrders,
          ordersGrowth: 12.8, // Placeholder - would need historical data
          totalCustomers,
          customersGrowth: 8.3, // Placeholder - would need historical data
          totalProducts,
          productsGrowth: 5.2, // Placeholder - would need historical data
          averageOrderValue,
          conversionRate: 3.2 // Placeholder - would need visit data
        },
        monthlyRevenue,
        topProducts
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Eroare la încărcarea datelor dashboard-ului');
      toast.error('Eroare la încărcarea datelor dashboard-ului');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
    toast.success('Datele au fost actualizate');
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  const formatPercentage = (value: number, isPositive: boolean = true) => {
    const icon = isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />;
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
    
    return (
      <span className={`flex items-center gap-1 text-xs ${colorClass}`}>
        {icon}
        {Math.abs(value).toFixed(1)}%
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Statistici Dashboard</h2>
          <Button disabled>
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            Se încarcă...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Statistici Dashboard</h2>
          <Button onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reîncearcă
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Statistici Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 zile</SelectItem>
              <SelectItem value="30d">30 zile</SelectItem>
              <SelectItem value="90d">90 zile</SelectItem>
              <SelectItem value="1y">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizează
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Venituri Totale</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardData.overview.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center justify-between">
              <span>+{dashboardData.overview.revenueGrowth}% față de luna trecută</span>
              {formatPercentage(dashboardData.overview.revenueGrowth)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comenzi Totale</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.overview.totalOrders}</div>
            <p className="text-xs text-muted-foreground flex items-center justify-between">
              <span>+{dashboardData.overview.ordersGrowth}% față de luna trecută</span>
              {formatPercentage(dashboardData.overview.ordersGrowth)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clienți Totali</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.overview.totalCustomers}</div>
            <p className="text-xs text-muted-foreground flex items-center justify-between">
              <span>+{dashboardData.overview.customersGrowth}% față de luna trecută</span>
              {formatPercentage(dashboardData.overview.customersGrowth)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produse Totale</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.overview.totalProducts}</div>
            <p className="text-xs text-muted-foreground flex items-center justify-between">
              <span>+{dashboardData.overview.productsGrowth}% față de luna trecută</span>
              {formatPercentage(dashboardData.overview.productsGrowth)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Venituri Lunare
            </CardTitle>
            <CardDescription>
              Evoluția veniturilor pe ultimele 12 luni
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.monthlyRevenue.map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium w-12">{month.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ 
                          width: `${(month.revenue / Math.max(...dashboardData.monthlyRevenue.map(m => m.revenue))) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatCurrency(month.revenue)}</div>
                    <div className="text-xs text-gray-500">{month.orders} comenzi</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Produse Top
            </CardTitle>
            <CardDescription>
              Cele mai vândute produse din perioada selectată
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.topProducts.length > 0 ? (
                dashboardData.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        {index + 1}
                      </Badge>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(product.revenue)}</div>
                      <div className="text-xs text-gray-500">{product.sales} vânzări</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Nu există comenzi pentru a calcula produsele top
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Valoare Medie Comandă</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {formatCurrency(dashboardData.overview.averageOrderValue)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Valoarea medie per comandă
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Rata de Conversie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {dashboardData.overview.conversionRate}%
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Vizitatori care au plasat comenzi
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Actualizat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-600">
                <Calendar className="w-5 h-5 inline mr-2" />
                Acum
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Ultima actualizare a datelor
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStatistics;
