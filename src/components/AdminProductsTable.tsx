import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { RefreshCw, Pencil, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { toast } from 'sonner';

// Harta tabelelor din Supabase pe care vrem să le listăm în admin
const TABLES: string[] = [
  'gene',
  'adezive',
  'preparate',
  'ingrijire-personala',
  'accesorii',
  'consumabile',
  'ustensile',
  'laminare',
];

export type AdminProductRow = {
  table: string;
  id: string | number;
  name: string;
  sku?: string | null;
  sale_price?: number | null;
  discount?: number | null;
  store_stock?: number | null;
  total_stock?: number | null;
  image_url?: string | null;
  _raw?: Record<string, unknown>;
  [key: string]: unknown;
};

interface AdminProductsTableProps {
  onEdit?: (row: AdminProductRow) => void;
  reloadKey?: number | string;
}

// Safe getters
const getString = (obj: Record<string, unknown>, key: string): string | undefined => {
  const v = obj[key];
  return typeof v === 'string' ? v : undefined;
};
const getNumber = (obj: Record<string, unknown>, key: string): number | undefined => {
  const v = obj[key];
  return typeof v === 'number' ? v : (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v)) ? Number(v) : undefined);
};
const getId = (row: Record<string, unknown>): string | number => {
  const id = row['id'];
  if (typeof id === 'number' || typeof id === 'string') return id;
  const code = row['code'] ?? row['Код'];
  if (typeof code === 'number' || typeof code === 'string') return code;
  return Math.random().toString(36).slice(2);
};

const AdminProductsTable: React.FC<AdminProductsTableProps> = ({ onEdit, reloadKey }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataByTable, setDataByTable] = useState<Record<string, AdminProductRow[]>>({});
  const [openTables, setOpenTables] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const results: Record<string, AdminProductRow[]> = {};
      for (const table of TABLES) {
        const { data, error } = await supabase.from(table).select('*');
        if (error) throw new Error(`${table}: ${error.message}`);
        const mapped: AdminProductRow[] = (data as unknown as Record<string, unknown>[] | null || []).map((row: Record<string, unknown>) => ({
          table,
          id: getId(row),
          name: getString(row, 'name') ?? getString(row, 'Наименование') ?? '',
          sku: getString(row, 'sku') ?? getString(row, 'code') ?? null,
          sale_price: getNumber(row, 'sale_price') ?? getNumber(row, 'Цена продажи') ?? null,
          discount: getNumber(row, 'discount') ?? getNumber(row, 'Скидка') ?? null,
          store_stock: getNumber(row, 'store_stock') ?? getNumber(row, 'Магазин (Остаток)') ?? null,
          total_stock: getNumber(row, 'total_stock') ?? getNumber(row, 'Общий остаток') ?? null,
          image_url: getString(row, 'image_url') ?? null,
          _raw: row,
        }));
        results[table] = mapped;
      }
      setDataByTable(results);
      // Deschide implicit toate secțiunile
      setOpenTables(Object.fromEntries(TABLES.map(t => [t, true])));
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Eroare la încărcarea produselor';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [reloadKey]);

  const filteredDataByTable = useMemo(() => {
    if (!query.trim()) return dataByTable;
    const q = query.toLowerCase();
    const out: Record<string, AdminProductRow[]> = {};
    for (const [table, rows] of Object.entries(dataByTable)) {
      out[table] = rows.filter((r) => {
        return (
          (r.name || '').toLowerCase().includes(q) ||
          (r.sku || '').toString().toLowerCase().includes(q)
        );
      });
    }
    return out;
  }, [dataByTable, query]);

  const handleRefresh = async () => {
    await fetchAll();
    toast.success('Produsele au fost reîncărcate');
  };

  const toggleTable = (t: string) =>
    setOpenTables((prev) => ({ ...prev, [t]: !prev[t] }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 w-full max-w-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Caută după nume sau SKU..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Eroare</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      )}

      {TABLES.map((t) => {
        const rows = filteredDataByTable[t] || [];
        const isOpen = openTables[t];
        return (
          <Card key={t}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 capitalize">
                  {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  {t}
                  <Badge variant="secondary">{rows.length}</Badge>
                </CardTitle>
                <CardDescription>Lista produselor din tabela „{t}”.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => toggleTable(t)}>
                  {isOpen ? 'Ascunde' : 'Afișează'}
                </Button>
              </div>
            </CardHeader>
            {isOpen && (
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Nume</TableHead>
                        <TableHead className="w-[140px]">SKU</TableHead>
                        <TableHead className="w-[120px]">Preț</TableHead>
                        <TableHead className="w-[120px]">Stoc</TableHead>
                        <TableHead className="w-[120px]">Discount</TableHead>
                        <TableHead className="w-[120px]">Acțiuni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((r) => (
                        <TableRow key={`${t}-${r.id}`}>
                          <TableCell className="font-mono text-xs">{r.id}</TableCell>
                          <TableCell className="max-w-[520px] truncate">{r.name}</TableCell>
                          <TableCell className="font-mono text-xs">{r.sku || '-'}</TableCell>
                          <TableCell>{r.sale_price != null ? `${r.sale_price} MDL` : '-'}</TableCell>
                          <TableCell>
                            {(r.store_stock ?? r.total_stock ?? 0) as number}
                          </TableCell>
                          <TableCell>{r.discount != null ? `${r.discount}%` : '-'}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onEdit?.(r)}
                            >
                              <Pencil className="h-4 w-4 mr-2" /> Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    {rows.length === 0 && (
                      <TableCaption>Nu există produse în această tabelă.</TableCaption>
                    )}
                  </Table>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      {!loading && !error && TABLES.every((t) => (filteredDataByTable[t] || []).length === 0) && (
        <div className="text-center text-muted-foreground py-12">
          Nu s-au găsit produse pentru criteriile curente.
        </div>
      )}
    </div>
  );
};

export default AdminProductsTable;
