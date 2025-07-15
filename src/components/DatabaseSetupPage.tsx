import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Database, 
  Upload, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Package,
  GraduationCap,
  Users,
  Settings,
  ArrowLeft
} from 'lucide-react';
import { seedDatabase, isDatabaseEmpty } from '@/lib/seedData';
import { seedGeneProducts, hasRealProducts, getDatabaseStats } from '@/lib/seedRealProducts';
import { seedAllProducts, getAllProductsStats, hasAllProductCategories } from '@/lib/seedAllProducts';
import { clearAllData } from '@/lib/firebaseService';
import { testFirebaseConnection, testDatabaseCollections } from '@/lib/testFirebase';
import { useFirebaseProductsOld, useFirebaseCourses, useFirebaseCustomers } from '@/hooks/useFirebase';

const DatabaseSetupPage = () => {
  const { language } = useLanguage();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSeedingReal, setIsSeedingReal] = useState(false);
  const [isSeedingAll, setIsSeedingAll] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isEmpty, setIsEmpty] = useState<boolean | null>(null);
  const [hasGeneProductsState, setHasGeneProductsState] = useState<boolean | null>(null);
  const [hasAllCategoriesState, setHasAllCategoriesState] = useState<boolean | null>(null);
  const [seedResult, setSeedResult] = useState<{ products: number; courses: number; customers: number } | null>(null);
  const [geneSeedResult, setGeneSeedResult] = useState<{ geneProducts: number; courses: number; customers: number } | null>(null);
  const [allProductsSeedResult, setAllProductsSeedResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [dbStats, setDbStats] = useState<any>(null);
  const [allProductsStats, setAllProductsStats] = useState<any>(null);

  const { products, loading: productsLoading, error: productsError } = useFirebaseProductsOld();
  const { courses, loading: coursesLoading, error: coursesError } = useFirebaseCourses();
  const { customers, loading: customersLoading, error: customersError } = useFirebaseCustomers();

  const checkDatabaseStatus = async () => {
    setIsChecking(true);
    setError(null);
    try {
      const empty = await isDatabaseEmpty();
      setIsEmpty(empty);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check database status');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkDatabaseStatus();
    loadDatabaseStats();
    loadAllProductsStats();
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setError(null);
    setTestResult(null);
    
    try {
      const result = await testFirebaseConnection();
      setTestResult(result);
      
      if (result.success) {
        const collectionsTest = await testDatabaseCollections();
        setTestResult(prev => ({ ...prev, collections: collectionsTest }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test failed');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setError(null);
    setSeedResult(null);
    
    try {
      const result = await seedDatabase();
      setSeedResult(result);
      setIsEmpty(false);
      await checkDatabaseStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to seed database');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSeedGeneProducts = async () => {
    setIsSeedingReal(true);
    setError(null);
    setGeneSeedResult(null);
    
    try {
      const result = await seedGeneProducts();
      setGeneSeedResult(result);
      setIsEmpty(false);
      setHasGeneProductsState(true);
      await loadDatabaseStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to seed gene products');
    } finally {
      setIsSeedingReal(false);
    }
  };

  const handleSeedAllProducts = async () => {
    setIsSeedingAll(true);
    setError(null);
    setAllProductsSeedResult(null);
    
    try {
      const result = await seedAllProducts();
      setAllProductsSeedResult(result);
      setIsEmpty(false);
      setHasGeneProductsState(true);
      setHasAllCategoriesState(true);
      await loadDatabaseStats();
      await loadAllProductsStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to seed all products');
    } finally {
      setIsSeedingAll(false);
    }
  };

  const loadAllProductsStats = async () => {
    try {
      const stats = await getAllProductsStats();
      const categoriesCheck = await hasAllProductCategories();
      setAllProductsStats(stats);
      setHasAllCategoriesState(categoriesCheck.hasAll);
    } catch (err) {
      console.error('Failed to load all products stats:', err);
    }
  };

  const loadDatabaseStats = async () => {
    try {
      const stats = await getDatabaseStats();
      setDbStats(stats);
      setIsEmpty(stats.isEmpty);
      setHasGeneProductsState(stats.realProducts.total > 0);
    } catch (err) {
      console.error('Failed to load database stats:', err);
    }
  };

  const handleClearDatabase = async () => {
    if (!window.confirm(language === 'RO' ? 
      'Ești sigur că vrei să ștergi toate datele? Această acțiune nu poate fi anulată. Procesul poate dura câteva minute.' :
      'Вы уверены, что хотите удалить все данные? Это действие нельзя отменить. Процесс может занять несколько минут.'
    )) {
      return;
    }

    setIsClearing(true);
    setError(null);
    setSeedResult(null);
    setGeneSeedResult(null);
    setAllProductsSeedResult(null);
    
    try {
      console.log('🗑️ Starting database cleanup...');
      const result = await clearAllData();
      console.log('✅ Database cleanup completed:', result);
      
      setIsEmpty(true);
      setHasGeneProductsState(false);
      setHasAllCategoriesState(false);
      
      // Refresh all statistics
      await checkDatabaseStatus();
      await loadDatabaseStats();
      await loadAllProductsStats();
      
    } catch (err) {
      console.error('❌ Error clearing database:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear database');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
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
            <Button variant="default" size="sm" className="gap-2">
              <Database className="h-4 w-4" />
              {language === 'RO' ? 'Baza de Date' : 'База данных'}
            </Button>
            <Link to="/admin/clienti">
              <Button variant="outline" size="sm" className="gap-2">
                <Users className="h-4 w-4" />
                {language === 'RO' ? 'Gestionare Clienți' : 'Управление клиентами'}
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Database className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">
              {language === 'RO' ? 'Configurare Bază de Date Firebase' : 'Настройка базы данных Firebase'}
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === 'RO' 
              ? 'Gestionează baza de date Firebase pentru aplicația ta. Poți popula baza de date cu date inițiale sau să o curăți complet.'
              : 'Управляйте базой данных Firebase для вашего приложения. Вы можете заполнить базу данных начальными данными или полностью очистить её.'
            }
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-destructive">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {seedResult && (
          <Alert className="mb-6 border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {language === 'RO' 
                ? `Baza de date a fost populată cu succes! Au fost adăugate ${seedResult.products} produse, ${seedResult.courses} cursuri și ${seedResult.customers} clienți.`
                : `База данных успешно заполнена! Добавлено ${seedResult.products} продуктов, ${seedResult.courses} курсов и ${seedResult.customers} клиентов.`
              }
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Database Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                {language === 'RO' ? 'Status Bază de Date' : 'Статус базы данных'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>{language === 'RO' ? 'Stare curentă:' : 'Текущее состояние:'}</span>
                <div className="flex items-center gap-2">
                  {isChecking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isEmpty === null ? (
                    <span className="text-muted-foreground">
                      {language === 'RO' ? 'Necunoscut' : 'Неизвестно'}
                    </span>
                  ) : isEmpty ? (
                    <span className="text-orange-600 font-medium">
                      {language === 'RO' ? 'Goală' : 'Пустая'}
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium">
                      {language === 'RO' ? 'Populată' : 'Заполненная'}
                    </span>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="text-sm">{language === 'RO' ? 'Produse' : 'Продукты'}</span>
                  </div>
                  <span className="font-semibold">
                    {productsLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : productsError ? (
                      '❌'
                    ) : (
                      products.length
                    )}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span className="text-sm">{language === 'RO' ? 'Cursuri' : 'Курсы'}</span>
                  </div>
                  <span className="font-semibold">
                    {coursesLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : coursesError ? (
                      '❌'
                    ) : (
                      courses.length
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm">{language === 'RO' ? 'Clienți' : 'Клиенты'}</span>
                  </div>
                  <span className="font-semibold">
                    {customersLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : customersError ? (
                      '❌'
                    ) : (
                      customers.length
                    )}
                  </span>
                </div>
              </div>

              <Button
                onClick={checkDatabaseStatus}
                disabled={isChecking}
                variant="outline"
                className="w-full"
              >
                {isChecking ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                {language === 'RO' ? 'Actualizează Status' : 'Обновить статус'}
              </Button>
            </CardContent>
          </Card>

          {/* Firebase Connection Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                {language === 'RO' ? 'Test Conexiune Firebase' : 'Тест соединения Firebase'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {language === 'RO' 
                  ? 'Testează conexiunea și permisiunile Firebase pentru a diagnostica problemele.'
                  : 'Протестируйте соединение и разрешения Firebase для диагностики проблем.'
                }
              </p>
              
              <Button
                onClick={handleTestConnection}
                disabled={isTesting}
                variant="outline"
                className="w-full"
              >
                {isTesting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Settings className="mr-2 h-4 w-4" />
                )}
                {language === 'RO' ? 'Testează Conexiunea' : 'Протестировать соединение'}
              </Button>

              {testResult && (
                <div className={`p-4 rounded-lg border ${testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  {testResult.success ? (
                    <div>
                      <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                        <CheckCircle className="h-4 w-4" />
                        {language === 'RO' ? 'Conexiune reușită!' : 'Соединение успешно!'}
                      </div>
                      {testResult.collections && (
                        <div className="space-y-1 text-sm">
                          {Object.entries(testResult.collections).map(([collection, result]: [string, any]) => (
                            <div key={collection} className="flex justify-between">
                              <span>{collection}:</span>
                              <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                                {result.success ? `${result.count} docs` : 'Error'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                        <AlertCircle className="h-4 w-4" />
                        {language === 'RO' ? 'Conexiune eșuată!' : 'Соединение не удалось!'}
                      </div>
                      <p className="text-sm text-red-600 mb-2">{testResult.error}</p>
                      {testResult.suggestions && (
                        <div className="text-sm space-y-1">
                          <p className="font-medium text-red-700">
                            {language === 'RO' ? 'Soluții:' : 'Решения:'}
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-red-600">
                            {testResult.suggestions.map((suggestion: string, index: number) => (
                              <li key={index}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                {language === 'RO' ? 'Acțiuni Bază de Date' : 'Действия с базой данных'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">
                    {language === 'RO' ? 'Populează Baza de Date' : 'Заполнить базу данных'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'RO' 
                      ? 'Adaugă toate produsele, cursurile și clienții în baza de date Firebase. Această operațiune va adăuga datele fără să șteargă cele existente.'
                      : 'Добавьте все продукты, курсы и клиентов в базу данных Firebase. Эта операция добавит данные, не удаляя существующие.'
                    }
                  </p>
                  <Button
                    onClick={handleSeedDatabase}
                    disabled={isSeeding}
                    className="w-full"
                  >
                    {isSeeding ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    {language === 'RO' ? 'Populează Baza de Date' : 'Заполнить базу данных'}
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">
                    {language === 'RO' ? '🚀 Produse Reale (gene.json)' : '🚀 Реальные продукты (gene.json)'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'RO' 
                      ? 'Adaugă 395 produse reale pentru extensii de gene din fișierul gene.json. Acestea vor înlocui produsele de test.'
                      : 'Добавьте 395 реальных продуктов для наращивания ресниц из файла gene.json. Они заменят тестовые продукты.'
                    }
                  </p>
                  <Button
                    onClick={handleSeedGeneProducts}
                    disabled={isSeedingReal}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {isSeedingReal ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Package className="mr-2 h-4 w-4" />
                    )}
                    {language === 'RO' ? 'Încarcă Produse Gene (395 produse)' : 'Загрузить продукты Gene (395 продуктов)'}
                  </Button>
                  {geneSeedResult && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        {language === 'RO' 
                          ? `✅ Succes! Adăugate: ${geneSeedResult.geneProducts} produse Gene, ${geneSeedResult.courses} cursuri, ${geneSeedResult.customers} clienți.`
                          : `✅ Успех! Добавлено: ${geneSeedResult.geneProducts} продуктов Gene, ${geneSeedResult.courses} курсов, ${geneSeedResult.customers} клиентов.`
                        }
                      </p>
                    </div>
                  )}
                </div>

                <Separator />
                
                {/* All Products Section */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">
                    🎯 {language === 'RO' ? 'Toate Produsele din Folderul Data' : 'Все продукты из папки Data'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'RO' 
                      ? 'Încarcă TOATE categoriile de produse din folderul data: Gene, Adezive, Accesorii, Consumabile, Laminare, etc. (total ~1000+ produse)'
                      : 'Загрузить ВСЕ категории продуктов из папки data: Gene, Клеи, Аксессуары, Расходники, Ламинирование и т.д. (всего ~1000+ продуктов)'
                    }
                  </p>
                  <Button
                    onClick={handleSeedAllProducts}
                    disabled={isSeedingAll}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
                    size="lg"
                  >
                    {isSeedingAll ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Package className="mr-2 h-4 w-4" />
                    )}
                    {language === 'RO' ? '🚀 Încarcă TOATE Produsele (~1000+ produse)' : '🚀 Загрузить ВСЕ продукты (~1000+ продуктов)'}
                  </Button>
                  {allProductsSeedResult && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 font-medium mb-2">
                        {language === 'RO' 
                          ? `🎉 Succes! Total: ${allProductsSeedResult.totalProducts} produse încărcate din ${Object.keys(allProductsSeedResult.categories).length} categorii, ${allProductsSeedResult.courses || 0} cursuri și ${allProductsSeedResult.customers || 0} clienți!`
                          : `🎉 Успех! Всего: ${allProductsSeedResult.totalProducts} продуктов загружено из ${Object.keys(allProductsSeedResult.categories).length} категорий, ${allProductsSeedResult.courses || 0} курсов и ${allProductsSeedResult.customers || 0} клиентов!`
                        }
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {allProductsSeedResult.details?.map((detail: any) => (
                          <div key={detail.category} className="flex justify-between">
                            <span>{detail.name}:</span>
                            <span className="font-medium">{detail.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-semibold text-destructive">
                    {language === 'RO' ? 'Curăță Baza de Date' : 'Очистить базу данных'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'RO' 
                      ? 'Șterge toate datele din baza de date Firebase. Această acțiune nu poate fi anulată!'
                      : 'Удалите все данные из базы данных Firebase. Это действие нельзя отменить!'
                    }
                  </p>
                  <Button
                    onClick={handleClearDatabase}
                    disabled={isClearing || isEmpty}
                    variant="destructive"
                    className="w-full"
                  >
                    {isClearing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    {language === 'RO' ? 'Curăță Baza de Date' : 'Очистить базу данных'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gene Products Statistics */}
          {dbStats && dbStats.realProducts.total > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  {language === 'RO' ? 'Statistici Produse Gene' : 'Статистика продуктов Gene'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>{language === 'RO' ? 'Total:' : 'Всего:'}</span>
                    <span className="font-medium">{dbStats.realProducts.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'RO' ? 'În stoc:' : 'В наличии:'}</span>
                    <span className="font-medium text-green-600">{dbStats.realProducts.inStock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'RO' ? 'Epuizate:' : 'Распроданы:'}</span>
                    <span className="font-medium text-red-600">{dbStats.realProducts.outOfStock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'RO' ? 'Preț mediu:' : 'Средняя цена:'}</span>
                    <span className="font-medium">{dbStats.realProducts.averagePrice.mdl} MDL</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Products Categories Statistics */}
          {allProductsStats && allProductsStats.total > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  {language === 'RO' ? 'Statistici Complete - Toate Categoriile' : 'Полная статистика - Все категории'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <p className="text-sm text-gray-600">{language === 'RO' ? 'Total Produse' : 'Всего продуктов'}</p>
                    <span className="font-bold text-blue-600 text-xl">{allProductsStats.total}</span>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="text-sm text-gray-600">{language === 'RO' ? 'În Stoc' : 'В наличии'}</p>
                    <span className="font-bold text-green-600 text-xl">{allProductsStats.inStock}</span>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <p className="text-sm text-gray-600">{language === 'RO' ? 'Epuizate' : 'Распроданы'}</p>
                    <span className="font-bold text-red-600 text-xl">{allProductsStats.outOfStock}</span>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded">
                    <p className="text-sm text-gray-600">{language === 'RO' ? 'Categorii' : 'Категории'}</p>
                    <span className="font-bold text-yellow-600 text-xl">{Object.keys(allProductsStats.categories).length}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <p className="text-sm text-gray-600">{language === 'RO' ? 'Cursuri' : 'Курсы'}</p>
                    <span className="font-bold text-purple-600 text-xl">{allProductsStats.courses || 0}</span>
                  </div>
                  <div className="text-center p-2 bg-indigo-50 rounded">
                    <p className="text-sm text-gray-600">{language === 'RO' ? 'Clienți' : 'Клиенты'}</p>
                    <span className="font-bold text-indigo-600 text-xl">{allProductsStats.customers || 0}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">{language === 'RO' ? 'Detalii pe Categorii:' : 'Детали по категориям:'}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    {Object.entries(allProductsStats.categories).map(([category, count]: [string, any]) => (
                      <div key={category} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="capitalize">{category.replace('-', ' ')}:</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span>{language === 'RO' ? 'Valoare totală:' : 'Общая стоимость:'}</span>
                    <span className="font-medium">{allProductsStats.totalValue.mdl.toLocaleString()} MDL</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'RO' ? 'Instrucțiuni' : 'Инструкции'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">
                  {language === 'RO' ? 'Configurare Firebase:' : 'Настройка Firebase:'}
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    {language === 'RO' 
                      ? 'Deschide fișierul src/lib/firebase.ts'
                      : 'Откройте файл src/lib/firebase.ts'
                    }
                  </li>
                  <li>
                    {language === 'RO' 
                      ? 'Înlocuiește configurația Firebase cu datele tale din proiectul Firebase'
                      : 'Замените конфигурацию Firebase на данные из вашего Firebase проекта'
                    }
                  </li>
                  <li>
                    {language === 'RO' 
                      ? 'Salvează fișierul și reîncarcă aplicația'
                      : 'Сохраните файл и перезагрузите приложение'
                    }
                  </li>
                  <li>
                    {language === 'RO' 
                      ? 'Folosește butonul "Populează Baza de Date" pentru a adăuga datele inițiale'
                      : 'Используйте кнопку "Заполнить базу данных" для добавления начальных данных'
                    }
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSetupPage;
