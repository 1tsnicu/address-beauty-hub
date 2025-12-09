-- Funcții pentru gestionarea stocului produselor
-- Acest fișier conține funcții SQL pentru actualizarea automată a stocului

-- =====================================================
-- FUNCȚII PENTRU ACTUALIZAREA STOCULUI
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

-- =====================================================
-- FUNCȚIE PENTRU ACTUALIZAREA STOCULUI DIN COMENZI
-- =====================================================

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

-- =====================================================
-- TRIGGER PENTRU ACTUALIZAREA AUTOMATĂ A STOCULUI
-- =====================================================

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

-- Creăm trigger-ul pentru actualizarea automată a stocului
DROP TRIGGER IF EXISTS update_stock_on_order_insert ON orders;
CREATE TRIGGER update_stock_on_order_insert
    AFTER INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_stock_on_order_insert();

-- =====================================================
-- FUNCȚII PENTRU RESTAURAREA STOCULUI (ANULARE COMENZI)
-- =====================================================

-- Funcție pentru restaurarea stocului când o comandă este anulată
CREATE OR REPLACE FUNCTION restore_stock_from_order_items(order_items JSONB)
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
    current_store_stock INTEGER;
    current_total_stock INTEGER;
    new_store_stock INTEGER;
    new_total_stock INTEGER;
    update_query TEXT;
BEGIN
    -- Iterăm prin fiecare item din comandă
    FOR item IN SELECT * FROM jsonb_array_elements(order_items)
    LOOP
        total_items := total_items + 1;
        
        -- Extragem productId și quantity din JSON
        product_id := (item->>'productId')::INTEGER;
        quantity := (item->>'quantity')::INTEGER;
        
        -- Căutăm produsul în toate tabelele și restauram stocul
        FOREACH table_name IN ARRAY product_tables
        LOOP
            BEGIN
                -- Obținem stocul curent
                update_query := format('SELECT store_stock, total_stock FROM %I WHERE id = %s', table_name, product_id);
                EXECUTE update_query INTO current_store_stock, current_total_stock;
                
                -- Dacă produsul există, restauram stocul
                IF current_store_stock IS NOT NULL THEN
                    new_store_stock := current_store_stock + quantity;
                    new_total_stock := current_total_stock + quantity;
                    
                    -- Actualizăm stocul
                    update_query := format(
                        'UPDATE %I SET store_stock = %s, total_stock = %s WHERE id = %s',
                        table_name, new_store_stock, new_total_stock, product_id
                    );
                    
                    EXECUTE update_query;
                    
                    RAISE NOTICE 'Stoc restaurat pentru produsul % din tabela %: store_stock % -> %, total_stock % -> %',
                        product_id, table_name, current_store_stock, new_store_stock, current_total_stock, new_total_stock;
                    
                    success_count := success_count + 1;
                    EXIT; -- Produsul a fost găsit și actualizat
                END IF;
            EXCEPTION
                WHEN OTHERS THEN
                    -- Continuăm cu următoarea tabelă
                    CONTINUE;
            END;
        END LOOP;
    END LOOP;
    
    -- Construim mesajul de rezultat
    result_message := format('Restaurat stocul pentru %s din %s produse', success_count, total_items);
    
    RETURN result_message;
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Eroare la restaurarea stocului: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCȚII PENTRU MONITORIZAREA STOCULUI
-- =====================================================

-- Funcție pentru verificarea stocului unui produs
CREATE OR REPLACE FUNCTION check_product_stock(product_id INTEGER)
RETURNS TABLE(
    table_name TEXT,
    store_stock INTEGER,
    total_stock INTEGER,
    product_name TEXT
) AS $$
DECLARE
    table_name TEXT;
    product_tables TEXT[] := ARRAY[
        'gene', 'adezive', 'preparate', 'ingrijire-personala',
        'accesorii', 'consumabile', 'ustensile', 'tehnologie_led',
        'hena_sprancene', 'vopsele_profesionale', 'pensule_instrumente_speciale',
        'solutii_laminare', 'adezive_laminare', 'accesorii_specifice'
    ];
    query_text TEXT;
BEGIN
    FOREACH table_name IN ARRAY product_tables
    LOOP
        query_text := format(
            'SELECT %L, store_stock, total_stock, name FROM %I WHERE id = %s',
            table_name, table_name, product_id
        );
        
        BEGIN
            RETURN QUERY EXECUTE query_text;
        EXCEPTION
            WHEN OTHERS THEN
                -- Continuăm cu următoarea tabelă
                CONTINUE;
        END;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Funcție pentru obținerea produselor cu stoc redus
CREATE OR REPLACE FUNCTION get_low_stock_products(minimum_stock INTEGER DEFAULT 5)
RETURNS TABLE(
    table_name TEXT,
    product_id INTEGER,
    product_name TEXT,
    store_stock INTEGER,
    total_stock INTEGER
) AS $$
DECLARE
    table_name TEXT;
    product_tables TEXT[] := ARRAY[
        'gene', 'adezive', 'preparate', 'ingrijire-personala',
        'accesorii', 'consumabile', 'ustensile', 'tehnologie_led',
        'hena_sprancene', 'vopsele_profesionale', 'pensule_instrumente_speciale',
        'solutii_laminare', 'adezive_laminare', 'accesorii_specifice'
    ];
    query_text TEXT;
BEGIN
    FOREACH table_name IN ARRAY product_tables
    LOOP
        query_text := format(
            'SELECT %L, id, name, store_stock, total_stock FROM %I WHERE store_stock <= %s OR total_stock <= %s',
            table_name, table_name, minimum_stock, minimum_stock
        );
        
        BEGIN
            RETURN QUERY EXECUTE query_text;
        EXCEPTION
            WHEN OTHERS THEN
                -- Continuăm cu următoarea tabelă
                CONTINUE;
        END;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMENTARII ȘI DOCUMENTAȚIE
-- =====================================================

COMMENT ON FUNCTION update_product_stock(TEXT, INTEGER, INTEGER) IS 'Actualizează stocul unui produs dintr-o tabelă specifică';
COMMENT ON FUNCTION update_stock_from_order_items(JSONB) IS 'Actualizează stocul pentru toate produsele dintr-o comandă';
COMMENT ON FUNCTION trigger_update_stock_on_order_insert() IS 'Trigger pentru actualizarea automată a stocului la inserarea unei comenzi';
COMMENT ON FUNCTION restore_stock_from_order_items(JSONB) IS 'Restaurează stocul când o comandă este anulată';
COMMENT ON FUNCTION check_product_stock(INTEGER) IS 'Verifică stocul unui produs în toate tabelele';
COMMENT ON FUNCTION get_low_stock_products(INTEGER) IS 'Obține produsele cu stoc redus';

-- =====================================================
-- EXEMPLE DE UTILIZARE
-- =====================================================

/*
-- Exemplu 1: Actualizarea manuală a stocului pentru un produs
SELECT update_product_stock('gene', 123, 2);

-- Exemplu 2: Actualizarea stocului pentru o comandă
SELECT update_stock_from_order_items('[
    {"productId": 1, "quantity": 2},
    {"productId": 2, "quantity": 1}
]'::jsonb);

-- Exemplu 3: Verificarea stocului unui produs
SELECT * FROM check_product_stock(123);

-- Exemplu 4: Obținerea produselor cu stoc redus
SELECT * FROM get_low_stock_products(5);

-- Exemplu 5: Restaurarea stocului pentru o comandă anulată
SELECT restore_stock_from_order_items('[
    {"productId": 1, "quantity": 2},
    {"productId": 2, "quantity": 1}
]'::jsonb);
*/

