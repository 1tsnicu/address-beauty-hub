import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Users, 
  UserPlus, 
  Eye, 
  Star,
  ShoppingBag,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Award,
  TrendingUp
} from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { CustomerService } from '@/lib/firebaseService';
import { NormalizedCustomer } from '@/types/Customer';
import { toast } from 'sonner';

type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

const loyaltyConfig = {
  bronze: { label: 'Bronze', color: 'bg-amber-100 text-amber-800', icon: '🥉' },
  silver: { label: 'Silver', color: 'bg-gray-100 text-gray-800', icon: '🥈' },
  gold: { label: 'Gold', color: 'bg-yellow-100 text-yellow-800', icon: '🥇' },
  platinum: { label: 'Platinum', color: 'bg-purple-100 text-purple-800', icon: '💎' }
};

const CustomerManagement: React.FC = () => {
  const { currency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<NormalizedCustomer | null>(null);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [customers, setCustomers] = useState<NormalizedCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load customers from Firebase
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const customerData = await CustomerService.getAllCustomers();
      setCustomers(customerData);
    } catch (error) {
      console.error('Error loading customers:', error);
      setError('Eroare la încărcarea clienților');
      toast.error('Nu s-au putut încărca clienții');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate loyalty tier based on total spent
  const getLoyaltyTier = (totalSpent: number): LoyaltyTier => {
    if (totalSpent >= 2000) return 'platinum';
    if (totalSpent >= 1000) return 'gold';
    if (totalSpent >= 500) return 'silver';
    return 'bronze';
  };

  // Filter customers based on search, tier, and activity
  const filteredCustomers = customers.filter(customer => {
    const customerTier = getLoyaltyTier(customer.totalSpent);
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.id && customer.id.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTier = tierFilter === 'all' || customerTier === tierFilter;
    const matchesActive = activeFilter === 'all' || 
                         (activeFilter === 'active' && customer.status === 'active') ||
                         (activeFilter === 'inactive' && customer.status === 'inactive');
    return matchesSearch && matchesTier && matchesActive;
  });

  // Calculate statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const newCustomers = customers.filter(c => {
    const regDate = new Date(c.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return regDate >= thirtyDaysAgo;
  }).length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const openCustomerDetails = (customer: NormalizedCustomer) => {
    setSelectedCustomer(customer);
    setShowCustomerDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestionare Clienți</h2>
        <Button className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Adaugă Client
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-24"></div>
            ))}
          </div>
          <div className="animate-pulse bg-muted rounded-lg h-96"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <p className="text-destructive text-lg mb-4">{error}</p>
          <Button onClick={loadCustomers} variant="outline">
            Încearcă din nou
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clienți</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              clienți înregistrați
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clienți Activi</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {((activeCustomers / totalCustomers) * 100).toFixed(1)}% din total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clienți Noi</CardTitle>
            <UserPlus className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{newCustomers}</div>
            <p className="text-xs text-muted-foreground">
              în ultimele 30 zile
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Venituri Totale</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {totalRevenue.toFixed(2)} {currency}
            </div>
            <p className="text-xs text-muted-foreground">
              de la toți clienții
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Caută clienți (nume, email, ID)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Toate nivelurile" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate nivelurile</SelectItem>
            {Object.entries(loyaltyConfig).map(([tier, config]) => (
              <SelectItem key={tier} value={tier}>
                {config.icon} {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={activeFilter} onValueChange={setActiveFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Toți clienții" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toți clienții</SelectItem>
            <SelectItem value="active">Clienți activi</SelectItem>
            <SelectItem value="inactive">Clienți inactivi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista Clienților</CardTitle>
          <CardDescription>
            Toți clienții înregistrați cu informații despre activitate și loialitate
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">Nu au fost găsiți clienți</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Înregistrare</TableHead>
                    <TableHead>Nivel Loialitate</TableHead>
                    <TableHead>Comenzi</TableHead>
                    <TableHead>Total Cheltuit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground font-mono">
                              {customer.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {customer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(customer.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge className={loyaltyConfig[getLoyaltyTier(customer.totalSpent)].color}>
                          {loyaltyConfig[getLoyaltyTier(customer.totalSpent)].icon}{' '}
                          {loyaltyConfig[getLoyaltyTier(customer.totalSpent)].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{customer.totalOrders}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {customer.totalSpent.toFixed(2)} {currency}
                      </TableCell>
                      <TableCell>
                        <Badge variant={customer.status === 'active' ? "default" : "secondary"}>
                          {customer.status === 'active' ? "Activ" : "Inactiv"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openCustomerDetails(customer)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Detalii
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
        </div>
      )}

      {/* Customer Details Dialog */}
      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Profilul Clientului</DialogTitle>
            <DialogDescription>
              Informații complete despre client și istoricul comenzilor
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Header */}
              <div className="flex items-start gap-4 p-6 bg-muted/50 rounded-lg">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-lg">
                    {getInitials(selectedCustomer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                    <Badge className={loyaltyConfig[getLoyaltyTier(selectedCustomer.totalSpent)].color}>
                      {loyaltyConfig[getLoyaltyTier(selectedCustomer.totalSpent)].icon}{' '}
                      {loyaltyConfig[getLoyaltyTier(selectedCustomer.totalSpent)].label}
                    </Badge>
                    <Badge variant={selectedCustomer.status === 'active' ? "default" : "secondary"}>
                      {selectedCustomer.status === 'active' ? "Activ" : "Inactiv"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono mb-1">
                    ID: {selectedCustomer.id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Client din {formatDate(selectedCustomer.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {selectedCustomer.totalSpent.toFixed(2)} {currency}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total cheltuit
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedCustomer.totalOrders}
                    </div>
                    <p className="text-sm text-muted-foreground">Total comenzi</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Star className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                    <div className="text-2xl font-bold text-yellow-600">
                      {(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(0)}
                    </div>
                    <p className="text-sm text-muted-foreground">Valoare medie comandă</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-sm font-bold text-green-600">
                      {selectedCustomer.lastVisit ? formatDate(selectedCustomer.lastVisit) : 'Nu a fost încă'}
                    </div>
                    <p className="text-sm text-muted-foreground">Ultima vizită</p>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informații de Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span>{selectedCustomer.address}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Order History - Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Istoricul Comenzilor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Istoricul comenzilor va fi disponibil când sistemul de comenzi va fi implementat complet.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Trimite Email
                </Button>
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Apelează
                </Button>
                <Button variant="outline" onClick={() => setShowCustomerDialog(false)}>
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

export default CustomerManagement;
