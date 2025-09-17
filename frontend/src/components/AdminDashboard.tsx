import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Package, LogOut } from 'lucide-react';
import AdminProductsTable, { AdminProductRow } from './AdminProductsTable';
import ProductEditDialog from './ProductEditDialog';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">Conectat ca: {user?.email}</p>
        </div>
        <Button variant="outline" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" /> Deconectare
        </Button>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList>
          <TabsTrigger value="products">Produse</TabsTrigger>
          <TabsTrigger value="orders" disabled>Comenzi</TabsTrigger>
          <TabsTrigger value="users" disabled>Utilizatori</TabsTrigger>
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
