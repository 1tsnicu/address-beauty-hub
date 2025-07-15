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

const tierConfig: Record<LoyaltyTier, { label: string; color: string; icon: string }> = {
  bronze: { label: 'Bronze', color: 'bg-orange-100 text-orange-800', icon: '🥉' },
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
    const loadCustomers = async () => {
      try {
        setIsLoading(true);
        const customerData = await CustomerService.getAllCustomers();
        setCustomers(customerData);
        setError(null);
      } catch (err) {
        console.error('Error loading customers:', err);
        setError('Eroare la încărcarea clienților');
        toast.error('Nu s-au putut încărca clienții');
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomers();
  }, []);

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'all' || customer.loyaltyTier === tierFilter;
    const matchesActive = activeFilter === 'all' || 
                         (activeFilter === 'active' && customer.isActive) ||
                         (activeFilter === 'inactive' && !customer.isActive);
    
    return matchesSearch && matchesTier && matchesActive;
  });

  // Statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.isActive).length;
  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageSpent = totalCustomers > 0 ? totalSpent / totalCustomers : 0;

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
          <Button onClick={() => window.location.reload()} variant="outline">
            Încearcă din nou
          </Button>
        </div>
      ) : (
        <>
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
                  {totalCustomers > 0 ? ((activeCustomers / totalCustomers) * 100).toFixed(1) : 0}% din total
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Venituri Totale</CardTitle>
                <ShoppingBag className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {totalSpent.toFixed(2)} {currency}
                </div>
                <p className="text-xs text-muted-foreground">
                  de la toți clienții
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Medie per Client</CardTitle>
                <Award className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {averageSpent.toFixed(2)} {currency}
                </div>
                <p className="text-xs text-muted-foreground">
                  cheltuială medie
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Caută clienți..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Toate nivelurile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toate nivelurile</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Toți clienții" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toți clienții</SelectItem>
                <SelectItem value="active">Activi</SelectItem>
                <SelectItem value="inactive">Inactivi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customers Table */}
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">Nu au fost găsiți clienți</p>
              <p className="text-sm text-muted-foreground mt-2">
                Încearcă să modifici criteriile de căutare
              </p>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Lista Clienților</CardTitle>
                <CardDescription>
                  Gestionează informațiile clienților și monitorizează activitatea acestora
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Contact</TableHead>
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
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={customer.avatar} />
                              <AvatarFallback>
                                {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Client din {new Date(customer.registrationDate).toLocaleDateString('ro-RO')}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{customer.email}</div>
                            <div className="text-sm text-muted-foreground">{customer.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={tierConfig[customer.loyaltyTier].color}>
                            {tierConfig[customer.loyaltyTier].icon} {tierConfig[customer.loyaltyTier].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {customer.orderCount}
                        </TableCell>
                        <TableCell className="font-medium">
                          {customer.totalSpent.toFixed(2)} {currency}
                        </TableCell>
                        <TableCell>
                          <Badge variant={customer.isActive ? "default" : "secondary"}>
                            {customer.isActive ? 'Activ' : 'Inactiv'}
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
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Customer Details Dialog */}
      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalii Client</DialogTitle>
            <DialogDescription>
              Informații complete despre client și istoricul comenzilor
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedCustomer.avatar} />
                  <AvatarFallback className="text-lg">
                    {selectedCustomer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={tierConfig[selectedCustomer.loyaltyTier].color}>
                      {tierConfig[selectedCustomer.loyaltyTier].icon} {tierConfig[selectedCustomer.loyaltyTier].label}
                    </Badge>
                    <Badge variant={selectedCustomer.isActive ? "default" : "secondary"}>
                      {selectedCustomer.isActive ? 'Activ' : 'Inactiv'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Client din {new Date(selectedCustomer.registrationDate).toLocaleDateString('ro-RO')}
                  </p>
                </div>
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
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedCustomer.address}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Order Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Total Comenzi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedCustomer.orderCount}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Total Cheltuit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedCustomer.totalSpent.toFixed(2)} {currency}
                    </div>
                  </CardContent>
                </Card>
              </div>

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
