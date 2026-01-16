import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Package, LogOut, GraduationCap } from 'lucide-react';
import AdminProductsTable, { AdminProductRow } from './AdminProductsTable';
import ProductEditDialog from './ProductEditDialog';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<AdminProductRow | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const handleEdit = (row: AdminProductRow) => {
    setSelectedRow(row);
    setEditOpen(true);
  };

  const handleSaved = () => {
    setReloadKey((k) => k + 1);
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-heading text-primary truncate">Admin Dashboard</h1>
          <p className="text-muted-foreground text-xs sm:text-sm truncate">Conectat ca: {user?.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/cursuri')} className="w-full sm:w-auto">
            <GraduationCap className="h-4 w-4 mr-2" /> Cursuri
          </Button>
          <Button variant="outline" onClick={logout} className="w-full sm:w-auto">
            <LogOut className="h-4 w-4 mr-2" /> Deconectare
          </Button>
        </div>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products" className="text-xs sm:text-sm">Produse</TabsTrigger>
          <TabsTrigger value="orders" disabled className="text-xs sm:text-sm">Comenzi</TabsTrigger>
          <TabsTrigger value="users" disabled className="text-xs sm:text-sm">Utilizatori</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Gestionare Produse</CardTitle>
                <CardDescription>Adaugă, editează sau șterge produse.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <AdminProductsTable onEdit={handleEdit} reloadKey={reloadKey} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Comenzi</CardTitle>
              <CardDescription>Secțiune în lucru</CardDescription>
            </CardHeader>
            <CardContent>—</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Utilizatori</CardTitle>
              <CardDescription>Secțiune în lucru</CardDescription>
            </CardHeader>
            <CardContent>—</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ProductEditDialog open={editOpen} onOpenChange={setEditOpen} row={selectedRow} onSaved={handleSaved} />
    </div>
  );
};

export default AdminDashboard;
