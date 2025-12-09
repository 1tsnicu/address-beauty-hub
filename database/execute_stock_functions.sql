-- Script pentru executarea funcțiilor de gestionare stoc
-- Execută acest script în Supabase SQL Editor

-- =====================================================
-- PASUL 1: Verifică dacă tabelele există
-- =====================================================

-- Verifică dacă tabela orders există
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'orders'
) as orders_table_exists;

-- Verifică dacă există tabelele de produse
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'gene', 'adezive', 'preparate', 'ingrijire-personala',
    'accesorii', 'consumabile', 'ustensile', 'tehnologie_led',
    'hena_sprancene', 'vopsele_profesionale', 'pensule_instrumente_speciale',
    'solutii_laminare', 'adezive_laminare', 'accesorii_specifice'
)
ORDER BY table_name;

-- =====================================================
-- PASUL 2: Creează funcțiile de gestionare stoc
-- =====================================================

-- Funcție pentru actualizarea stocului unui produs dintr-o tabelă specifică
CREATE OR REPLACE FUNCTION update_product_stock(
    table_name TEXT,
    product_id INTEGER,
    quantity_to_subtract INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    current_store_stock INTEGER;
    current_total_stock INTEGER;
    new_store_stock INTEGER;
    new_total_stock INTEGER;
    update_query TEXT;
BEGIN
    -- Construim query-ul pentru a obține stocul curent
    update_query := format('SELECT store_stock, total_stock FROM %I WHERE id = %s', table_name, product_id);
    
    -- Executăm query-ul pentru a obține stocul curent
    EXECUTE update_query INTO current_store_stock, current_total_stock;
    
    -- Verificăm dacă produsul există
    IF current_store_stock IS NULL THEN
        RAISE NOTICE 'Produsul cu ID % nu a fost găsit în tabela %', product_id, table_name;
        RETURN FALSE;
    END IF;
    
    -- Calculăm noul stoc (nu permitem stoc negativ)
    new_store_stock := GREATEST(0, current_store_stock - quantity_to_subtract);
    new_total_stock := GREATEST(0, current_total_stock - quantity_to_subtract);
    
    -- Construim și executăm query-ul de actualizare
    update_query := format(
        'UPDATE %I SET store_stock = %s, total_stock = %s WHERE id = %s',
        table_name, new_store_stock, new_total_stock, product_id
    );
    
    EXECUTE update_query;
    
    RAISE NOTICE 'Stoc actualizat pentru produsul % din tabela %: store_stock % -> %, total_stock % -> %',
        product_id, table_name, current_store_stock, new_store_stock, current_total_stock, new_total_stock;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Eroare la actualizarea stocului pentru produsul % din tabela %: %', product_id, table_name, SQLERRM;
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Funcție pentru actualizarea stocului bazată pe items dintr-o comandă
CREATE OR REPLACE FUNCTION update_stock_from_order_items(order_items JSONB)
RETURNS TEXT AS $$
DECLARE
    item JSONB;
    product_id INTEGER;
    quantity INTEGER;
    table_name TEXT;
    success_count INTEGER := 0;
    total_items INTEGER := 0;
    result_message TEXT := '';
    product_tables TEXT[] := ARRAY[
        'gene', 'adezive', 'preparate', 'ingrijire-personala',
        'accesorii', 'consumabile', 'ustensile', 'tehnologie_led',
        'hena_sprancene', 'vopsele_profesionale', 'pensule_instrumente_speciale',
        'solutii_laminare', 'adezive_laminare', 'accesorii_specifice'
    ];
BEGIN
    -- Iterăm prin fiecare item din comandă
    FOR item IN SELECT * FROM jsonb_array_elements(order_items)
    LOOP
        total_items := total_items + 1;
        
        -- Extragem productId și quantity din JSON
        product_id := (item->>'productId')::INTEGER;
        quantity := (item->>'quantity')::INTEGER;
        
        -- Căutăm produsul în toate tabelele
        FOREACH table_name IN ARRAY product_tables
        LOOP
            -- Încercăm să actualizăm stocul în această tabelă
            IF update_product_stock(table_name, product_id, quantity) THEN
                success_count := success_count + 1;
                EXIT; -- Produsul a fost găsit și actualizat, ieșim din bucla tabelelor
            END IF;
        END LOOP;
    END LOOP;
    
    -- Construim mesajul de rezultat
    result_message := format('Actualizat stocul pentru %s din %s produse', success_count, total_items);
    
    RETURN result_message;
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Eroare la actualizarea stocului: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Funcție trigger pentru actualizarea automată a stocului când se inserează o comandă
CREATE OR REPLACE FUNCTION trigger_update_stock_on_order_insert()
RETURNS TRIGGER AS $$
DECLARE
    stock_update_result TEXT;
BEGIN
    -- Actualizăm stocul pentru toate produsele din comandă
    stock_update_result := update_stock_from_order_items(NEW.items);
    
    -- Logăm rezultatul
    RAISE NOTICE 'Stoc actualizat pentru comanda %: %', NEW.id, stock_update_result;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Nu vrem să blocăm inserarea comenzii dacă actualizarea stocului eșuează
        RAISE NOTICE 'Eroare la actualizarea stocului pentru comanda %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PASUL 3: Creează trigger-ul pentru actualizarea automată
-- =====================================================

-- Șterge trigger-ul existent dacă există
DROP TRIGGER IF EXISTS update_stock_on_order_insert ON orders;

-- Creează trigger-ul pentru actualizarea automată a stocului
CREATE TRIGGER update_stock_on_order_insert
    AFTER INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_stock_on_order_insert();

-- =====================================================
-- PASUL 4: Testează funcțiile
-- =====================================================

-- Testează funcția de actualizare stoc (înlocuiește cu ID-uri reale)
-- SELECT update_product_stock('gene', 1, 2);

-- Testează funcția pentru items (înlocuiește cu date reale)
-- SELECT update_stock_from_order_items('[
--     {"productId": 1, "quantity": 2},
--     {"productId": 2, "quantity": 1}
-- ]'::jsonb);

-- =====================================================
-- PASUL 5: Verifică rezultatul
-- =====================================================

-- Verifică dacă trigger-ul a fost creat
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'update_stock_on_order_insert';

-- Verifică dacă funcțiile au fost create
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_name IN (
    'update_product_stock',
    'update_stock_from_order_items', 
    'trigger_update_stock_on_order_insert'
)
ORDER BY routine_name;

-- Mesaj de confirmare
SELECT 'Funcțiile de gestionare stoc au fost create cu succes!' as status;
