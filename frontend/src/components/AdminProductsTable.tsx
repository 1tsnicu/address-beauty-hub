import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { RefreshCw, Pencil, ChevronDown, ChevronRight, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import AddProductButton from './AddProductButton';

// Harta tabelelor din Supabase pe care vrem să le listăm în admin
const TABLES: string[] = [
  'gene',
  'adezive',
  'preparate',
  'ingrijire-personala',
  'accesorii',
  'consumabile',
  'ustensile',
  'tehnologie_led',
  'hena_sprancene',
  'vopsele_profesionale',
  'pensule_instrumente_speciale',
  'solutii_laminare',
  'adezive_laminare',
  'accesorii_specifice',
];

export type AdminProductRow = {
  table: string;
  id: string | number;
  name: string;
  descriere?: string | null;
  sku?: string | null;
  sale_price?: number | null;
  discount?: number | null;
  store_stock?: number | null;
  total_stock?: number | null;
  image_url?: string | null;
  // Proprietăți specifice tabelului gene
  curbura?: string | null;
  grosime?: string | null;
  lungime?: string | null;
  culoare?: string | null;
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

// Helper: grupează rândurile după nume (ignorând case & spații în exces)
const groupByName = (rows: AdminProductRow[]): Array<[string, AdminProductRow[]]> => {
  const map = new Map<string, { display: string; items: AdminProductRow[] }>();
  for (const r of rows) {
    const display = (r.name || '').trim();
    const key = display.toLowerCase();
    if (!map.has(key)) map.set(key, { display, items: [] });
    map.get(key)!.items.push(r);
  }
  return Array.from(map.values())
    .sort((a, b) => a.display.localeCompare(b.display))
    .map((g) => [g.display, g.items]);
};

const AdminProductsTable: React.FC<AdminProductsTableProps> = ({ onEdit, reloadKey }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataByTable, setDataByTable] = useState<Record<string, AdminProductRow[]>>({});
  const [openTables, setOpenTables] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState('');
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  // Helper pentru determinarea coloanei cheie în Supabase
  const getPkAndValue = (row: AdminProductRow): { pk: string; value: string | number } => {
    const raw = (row._raw ?? {}) as Record<string, unknown>;
    const candidates: Array<{ pk: string; val: unknown }> = [
      { pk: 'id', val: raw['id'] },
      { pk: 'code', val: raw['code'] },
      { pk: 'Код', val: (raw as Record<string, unknown>)['Код'] },
    ];
    for (const { pk, val } of candidates) {
      if (typeof val === 'string' || typeof val === 'number') {
        return { pk, value: val };
      }
    }
    if (typeof row.id === 'string' || typeof row.id === 'number') {
      return { pk: 'id', value: row.id };
    }
    return { pk: 'id', value: String(row.id) };
  };

  const handleDelete = async (table: string, row: AdminProductRow) => {
    const key = `${table}-${row.id}`;
    const confirmMsg = `Ștergi produsul «${row.name}» din „${table}”? Această acțiune este ireversibilă.`;
    const ok = window.confirm(confirmMsg);
    if (!ok) return;
    setDeletingKey(key);
    try {
      const { pk, value } = getPkAndValue(row);
      const { error } = await supabase.from(table).delete().eq(pk, value);
      if (error) throw new Error(error.message || 'Ștergerea a eșuat');
      // Scoatem din UI
      setDataByTable((prev) => {
        const copy: Record<string, AdminProductRow[]> = { ...prev };
        const list = copy[table] || [];
        copy[table] = list.filter((r) => r.id !== row.id);
        return copy;
      });
      toast.success('Produsul a fost șters');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Eroare la ștergere';
      toast.error(msg);
    } finally {
      setDeletingKey(null);
    }
  };

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
          descriere: getString(row, 'descriere') ?? null,
          sku: getString(row, 'sku') ?? getString(row, 'code') ?? null,
          sale_price: getNumber(row, 'sale_price') ?? getNumber(row, 'Цена продажи') ?? null,
          discount: getNumber(row, 'discount') ?? getNumber(row, 'Скидка') ?? null,
          store_stock: getNumber(row, 'store_stock') ?? getNumber(row, 'Магазин (Остаток)') ?? null,
          total_stock: getNumber(row, 'total_stock') ?? getNumber(row, 'Общий остаток') ?? null,
          image_url: getString(row, 'image_url') ?? null,
          // Proprietăți specifice tabelului gene
          curbura: getString(row, 'curbura') ?? null,
          grosime: getString(row, 'grosime') ?? null,
          lungime: getString(row, 'lungime') ?? null,
          culoare: getString(row, 'culoare') ?? null,
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

  const filteredDataByTable = useMemo<Record<string, AdminProductRow[]>>(() => {
    if (!query.trim()) return dataByTable;
    const q = query.toLowerCase();
    const out: Record<string, AdminProductRow[]> = {};
    for (const [table, rows] of Object.entries(dataByTable)) {
      out[table] = (rows || []).filter((r) => {
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
        <div className="flex items-center gap-2 w-full sm:max-w-md">
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Input
            placeholder={t('admin.search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <AddProductButton onAdded={handleRefresh} />
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading} className="text-xs sm:text-sm">
            <RefreshCw className={`${loading ? 'animate-spin' : ''} h-4 w-4 mr-1 sm:mr-2`} /> 
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
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
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
              <div className="min-w-0">
                <CardTitle className="flex items-center gap-2 capitalize text-sm sm:text-base">
                  {isOpen ? <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" /> : <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />}
                  <span className="truncate">{t}</span>
                  <Badge variant="secondary" className="text-xs">{rows.length}</Badge>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Lista produselor din tabela „{t}".</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => toggleTable(t)} className="text-xs sm:text-sm">
                  {isOpen ? 'Ascunde' : 'Afișează'}
                </Button>
              </div>
            </CardHeader>
            {isOpen && (
              <CardContent>
                <div className="w-full overflow-x-auto">
                  {/* Grupare pe nume */}
                  {groupByName(rows).map(([groupName, items]) => (
                    <div key={`${t}-${groupName}`} className="mb-4 rounded-lg border bg-card">
                      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/40">
                        <div className="font-medium truncate pr-2" title={groupName}>{groupName}</div>
                        <Badge variant="secondary">{items.length}</Badge>
                      </div>

                      <div className="w-full overflow-x-auto">
                        <Table className="min-w-[800px]">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[60px] sm:w-[80px] text-xs sm:text-sm">ID</TableHead>
                              {t === 'gene' && <TableHead className="w-[80px] sm:w-[120px] text-xs sm:text-sm">Curbură</TableHead>}
                              {t === 'gene' && <TableHead className="w-[80px] sm:w-[120px] text-xs sm:text-sm">Grosime</TableHead>}
                              {t === 'gene' && <TableHead className="w-[80px] sm:w-[120px] text-xs sm:text-sm">Lungime</TableHead>}
                              {t === 'gene' && <TableHead className="w-[80px] sm:w-[120px] text-xs sm:text-sm">Culoare</TableHead>}
                              <TableHead className="w-[100px] sm:w-[140px] text-xs sm:text-sm">SKU</TableHead>
                              <TableHead className="w-[80px] sm:w-[100px] text-xs sm:text-sm">Preț</TableHead>
                              <TableHead className="w-[80px] sm:w-[100px] text-xs sm:text-sm">Stoc</TableHead>
                              <TableHead className="w-[120px] sm:w-[160px] text-xs sm:text-sm">Acțiuni</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {items.map((r) => (
                              <TableRow key={`${t}-${groupName}-${r.id}`}>
                                <TableCell className="font-mono text-xs">{r.id}</TableCell>
                                {t === 'gene' && <TableCell className="text-xs">{r.curbura || '-'}</TableCell>}
                                {t === 'gene' && <TableCell className="text-xs">{r.grosime || '-'}</TableCell>}
                                {t === 'gene' && <TableCell className="text-xs">{r.lungime || '-'}</TableCell>}
                                {t === 'gene' && <TableCell className="text-xs">{r.culoare || '-'}</TableCell>}
                                <TableCell className="font-mono text-xs">{r.sku || '-'}</TableCell>
                                <TableCell className="text-xs">{r.sale_price != null ? `${r.sale_price} MDL` : '-'}</TableCell>
                                <TableCell className="text-xs">{(r.store_stock ?? r.total_stock ?? 0) as number}</TableCell>
                                <TableCell>
                                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1 sm:gap-2">
                                    <Button size="sm" variant="outline" onClick={() => onEdit?.(r)} className="text-xs">
                                      <Pencil className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" /> 
                                      <span className="hidden sm:inline">Edit</span>
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleDelete(t, r)}
                                      disabled={deletingKey === `${t}-${r.id}`}
                                      title={t('admin.delete.product')}
                                      className="text-xs"
                                    >
                                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                                      <span className="hidden sm:inline">
                                        {deletingKey === `${t}-${r.id}` ? t('admin.deleting') : t('admin.delete')}
                                      </span>
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      {!loading && !error && TABLES.every((t) => (filteredDataByTable[t] || []).length === 0) && (
        <div className="text-center text-muted-foreground py-12">
          {t('admin.no.products')}
        </div>
      )}
    </div>
  );
};

export default AdminProductsTable;
