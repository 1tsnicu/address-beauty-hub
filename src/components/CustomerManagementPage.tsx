import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Filter,
  Download,
  TrendingUp,
  UserCheck,
  UserX,
  Loader2,
  Database,
  ArrowLeft
} from 'lucide-react';
import { useFirebaseCustomers } from '@/hooks/useFirebase';
import { CustomerService } from '@/lib/firebaseService';
import { NormalizedCustomer } from '@/types/Customer';
import { toast } from 'sonner';

const CustomerManagementPage = () => {
  const { language } = useLanguage();
  const { customers, loading, error, fetchCustomers, deleteCustomer } = useFirebaseCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<NormalizedCustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<NormalizedCustomer | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Filter customers based on search term and status
  useEffect(() => {
    let filtered = customers;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, statusFilter]);

  // Load customer statistics
  useEffect(() => {
    const loadStats = async () => {
      try {
        const customerStats = await CustomerService.getCustomerStats();
        setStats(customerStats);
      } catch (error) {
        console.error('Error loading customer stats:', error);
      }
    };

    if (customers.length > 0) {
      loadStats();
    }
  }, [customers]);

  const handleDeleteCustomer = async (customerId: string, customerName: string) => {
    if (window.confirm(
      language === 'RO' 
        ? `Ești sigur că vrei să ștergi clientul "${customerName}"?`
        : `Вы уверены, что хотите удалить клиента "${customerName}"?`
    )) {
      try {
        await deleteCustomer(customerId);
        toast.success(
          language === 'RO' 
            ? 'Clientul a fost șters cu succes!'
            : 'Клиент успешно удален!'
        );
      } catch (error) {
        toast.error(
          language === 'RO' 
            ? 'Eroare la ștergerea clientului'
            : 'Ошибка при удалении клиента'
        );
      }
    }
  };

  const handleViewCustomer = (customer: NormalizedCustomer) => {
    setSelectedCustomer(customer);
    setIsDetailDialogOpen(true);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'RO' ? 'ro-RO' : 'ru-RU').format(date);
  };

  const formatPhone = (phone: string) => {
    if (!phone || phone === '-') return '-';
    return phone.replace(/(\+?\d{1,3})(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">
              {language === 'RO' ? 'Se încarcă clienții...' : 'Загрузка клиентов...'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-8">
        <div className="container mx-auto px-4">
          <Alert className="max-w-2xl mx-auto border-destructive">
            <AlertDescription className="text-destructive">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-8">
      <div className="container mx-auto px-4">
        {/* Admin Navigation */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {language === 'RO' ? 'Înapoi la site' : 'Назад к сайту'}
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground">
              {language === 'RO' ? 'Panou Administrativ' : 'Панель администратора'}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link to="/admin/database">
              <Button variant="outline" size="sm" className="gap-2">
                <Database className="h-4 w-4" />
                {language === 'RO' ? 'Baza de Date' : 'База данных'}
              </Button>
            </Link>
            <Button variant="default" size="sm" className="gap-2">
              <Users className="h-4 w-4" />
              {language === 'RO' ? 'Gestionare Clienți' : 'Управление клиентами'}
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              {language === 'RO' ? 'Gestionare Clienți' : 'Управление клиентами'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {language === 'RO' 
                ? 'Gestionează baza de date cu clienții și vezi statisticile'
                : 'Управляйте базой данных клиентов и просматривайте статистику'
              }
            </p>
          </div>
          
          <Button onClick={() => window.open('/admin/database', '_blank')}>
            <Plus className="mr-2 h-4 w-4" />
            {language === 'RO' ? 'Importă Clienți' : 'Импорт клиентов'}
          </Button>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'RO' ? 'Total Clienți' : 'Всего клиентов'}
                    </p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <UserCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'RO' ? 'Activi' : 'Активные'}
                    </p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'RO' ? 'Cu Email' : 'С Email'}
                    </p>
                    <p className="text-2xl font-bold text-blue-600">{stats.withEmail}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Phone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'RO' ? 'Cu Telefon' : 'С телефоном'}
                    </p>
                    <p className="text-2xl font-bold text-purple-600">{stats.withPhone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={
                      language === 'RO' 
                        ? 'Caută după nume, telefon, email sau adresă...'
                        : 'Поиск по имени, телефону, email или адресу...'
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  {language === 'RO' ? 'Toți' : 'Все'}
                </Button>
                <Button
                  variant={statusFilter === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('active')}
                >
                  {language === 'RO' ? 'Activi' : 'Активные'}
                </Button>
                <Button
                  variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('inactive')}
                >
                  {language === 'RO' ? 'Inactivi' : 'Неактивные'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {language === 'RO' ? 'Lista Clienților' : 'Список клиентов'} 
                ({filteredCustomers.length})
              </CardTitle>
              
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                {language === 'RO' ? 'Export' : 'Экспорт'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'RO' ? 'Nume' : 'Имя'}</TableHead>
                    <TableHead>{language === 'RO' ? 'Telefon' : 'Телефон'}</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>{language === 'RO' ? 'Localitate' : 'Город'}</TableHead>
                    <TableHead>{language === 'RO' ? 'Adăugat la' : 'Добавлен'}</TableHead>
                    <TableHead>{language === 'RO' ? 'Status' : 'Статус'}</TableHead>
                    <TableHead>{language === 'RO' ? 'Acțiuni' : 'Действия'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        <Button
                          variant="link"
                          className="p-0 h-auto font-medium text-left"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          {customer.name}
                        </Button>
                      </TableCell>
                      <TableCell>{formatPhone(customer.phone)}</TableCell>
                      <TableCell>{customer.email || '-'}</TableCell>
                      <TableCell className="max-w-32 truncate">
                        {customer.address || '-'}
                      </TableCell>
                      <TableCell>{formatDate(customer.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                          {customer.status === 'active' 
                            ? (language === 'RO' ? 'Activ' : 'Активный')
                            : (language === 'RO' ? 'Inactiv' : 'Неактивный')
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewCustomer(customer)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCustomer(customer.id!, customer.name)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredCustomers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {language === 'RO' 
                    ? 'Nu au fost găsiți clienți'
                    : 'Клиенты не найдены'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {language === 'RO' ? 'Detalii Client' : 'Детали клиента'}
              </DialogTitle>
              <DialogDescription>
                {language === 'RO' 
                  ? 'Informații complete despre client'
                  : 'Полная информация о клиенте'
                }
              </DialogDescription>
            </DialogHeader>
            
            {selectedCustomer && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      {language === 'RO' ? 'Nume' : 'Имя'}
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedCustomer.name}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">
                      {language === 'RO' ? 'Telefon' : 'Телефон'}
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatPhone(selectedCustomer.phone)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedCustomer.email || '-'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">
                      {language === 'RO' ? 'Data nașterii' : 'Дата рождения'}
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedCustomer.birthday || '-'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">
                    {language === 'RO' ? 'Adresa' : 'Адрес'}
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedCustomer.address || '-'}
                  </p>
                </div>
                
                {selectedCustomer.description && selectedCustomer.description !== '-' && (
                  <div>
                    <label className="text-sm font-medium">
                      {language === 'RO' ? 'Descriere' : 'Описание'}
                    </label>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                      {selectedCustomer.description}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      {language === 'RO' ? 'Adăugat de' : 'Добавлен'}
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedCustomer.addedBy}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">
                      {language === 'RO' ? 'Data adăugării' : 'Дата добавления'}
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(selectedCustomer.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CustomerManagementPage;
