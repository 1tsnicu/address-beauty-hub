import React, { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { ProductCategory } from '@/types/Category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

const CategoryManager: React.FC = () => {
  const { t } = useLanguage();
  const { categories, isLoading, error, refreshCategories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<ProductCategory | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    active: true,
  });
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshCategories();
      toast.success('Categoriile au fost actualizate');
    } catch (error) {
      toast.error('Nu s-au putut actualiza categoriile');
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const handleAddSubmit = async () => {
    if (!newCategory.name || !newCategory.slug) {
      toast.error('Numele și slug-ul sunt obligatorii');
      return;
    }
    
    try {
      await addCategory(newCategory);
      setNewCategory({
        name: '',
        slug: '',
        description: '',
        active: true,
      });
      setIsAddDialogOpen(false);
      toast.success('Categoria a fost adăugată cu succes');
      await refreshCategories();
    } catch (error) {
      toast.error('Nu s-a putut adăuga categoria');
    }
  };
  
  const handleEditSubmit = async () => {
    if (!currentCategory) return;
    
    try {
      await updateCategory(currentCategory.id, currentCategory);
      setIsEditDialogOpen(false);
      toast.success('Categoria a fost actualizată cu succes');
      await refreshCategories();
    } catch (error) {
      toast.error('Nu s-a putut actualiza categoria');
    }
  };
  
  const handleDeleteSubmit = async () => {
    if (!currentCategory) return;
    
    try {
      await deleteCategory(currentCategory.id);
      setIsDeleteDialogOpen(false);
      toast.success('Categoria a fost ștearsă cu succes');
      await refreshCategories();
    } catch (error) {
      toast.error('Nu s-a putut șterge categoria');
    }
  };
  
  const handleAddNewClick = () => {
    setNewCategory({
      name: '',
      slug: '',
      description: '',
      active: true,
    });
    setIsAddDialogOpen(true);
  };
  
  const handleEditClick = (category: ProductCategory) => {
    setCurrentCategory({...category});
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (category: ProductCategory) => {
    setCurrentCategory(category);
    setIsDeleteDialogOpen(true);
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Încearcă din nou
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestionare categorii</h2>
        <div className="space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading || isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${(isLoading || isRefreshing) ? 'animate-spin' : ''}`} />
            Reîmprospătează
          </Button>
          <Button onClick={handleAddNewClick} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Categorie nouă
          </Button>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nume</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Descriere</TableHead>
            <TableHead className="w-24">Activă</TableHead>
            <TableHead className="w-28 text-right">Acțiuni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={5}>
                  <div className="h-8 bg-muted rounded animate-pulse"></div>
                </TableCell>
              </TableRow>
            ))
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                {t('category.manager.no.categories')}
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id} className={!category.active ? 'opacity-60' : ''}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell className="max-w-xs truncate">{category.description || '-'}</TableCell>
                <TableCell>
                  <Switch 
                    checked={category.active} 
                    onCheckedChange={(checked) => updateCategory(category.id, { active: checked })}
                    disabled={category.id === 'all'}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEditClick(category)}
                    disabled={category.id === 'all'}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteClick(category)}
                    disabled={category.id === 'all'}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adaugă categorie nouă</DialogTitle>
            <DialogDescription>
              Completează informațiile pentru categoria nouă
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nume categorie</Label>
              <Input 
                id="name" 
                value={newCategory.name} 
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (ID unic)</Label>
              <Input 
                id="slug" 
                value={newCategory.slug} 
                onChange={(e) => setNewCategory({...newCategory, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
              />
              <p className="text-xs text-muted-foreground">
                Slug-ul trebuie să fie unic și conține doar litere mici, cifre și cratime.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descriere (opțional)</Label>
              <Textarea 
                id="description" 
                value={newCategory.description} 
                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                id="active" 
                checked={newCategory.active} 
                onCheckedChange={(checked) => setNewCategory({...newCategory, active: checked})}
              />
              <Label htmlFor="active">Categorie activă</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Anulează</Button>
            <Button onClick={handleAddSubmit}>Adaugă categorie</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editează categoria</DialogTitle>
            <DialogDescription>
              Modifică informațiile categoriei
            </DialogDescription>
          </DialogHeader>
          {currentCategory && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nume categorie</Label>
                <Input 
                  id="edit-name" 
                  value={currentCategory.name} 
                  onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug (ID unic)</Label>
                <Input 
                  id="edit-slug" 
                  value={currentCategory.slug} 
                  onChange={(e) => setCurrentCategory({...currentCategory, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  disabled={currentCategory.id === 'all'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Descriere (opțional)</Label>
                <Textarea 
                  id="edit-description" 
                  value={currentCategory.description || ''} 
                  onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  id="edit-active" 
                  checked={currentCategory.active} 
                  onCheckedChange={(checked) => setCurrentCategory({...currentCategory, active: checked})}
                  disabled={currentCategory.id === 'all'}
                />
                <Label htmlFor="edit-active">Categorie activă</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Anulează</Button>
            <Button onClick={handleEditSubmit}>Salvează modificările</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Category Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmare ștergere</DialogTitle>
            <DialogDescription>
              Ești sigur că vrei să ștergi această categorie? Această acțiune nu poate fi anulată.
            </DialogDescription>
          </DialogHeader>
          {currentCategory && (
            <div className="py-4">
              <p>Ești sigur că vrei să ștergi categoria <strong>{currentCategory.name}</strong>?</p>
              <p className="text-sm text-muted-foreground mt-2">
                Această acțiune nu poate fi anulată. Toate produsele din această categorie vor trebui reatribuite.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Anulează</Button>
            <Button variant="destructive" onClick={handleDeleteSubmit}>Șterge categoria</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManager;
