-- Creează VIEW pentru gruparea produselor gene după nume
-- Acest VIEW grupează variantele după un slug derivat din name

CREATE OR REPLACE VIEW public.gene_groups AS
SELECT 
    -- Creează slug normalizat din name pentru routing stabil
    LOWER(
        TRIM(
            REGEXP_REPLACE(
                REGEXP_REPLACE(
                    REGEXP_REPLACE(
                        REGEXP_REPLACE(
                            REGEXP_REPLACE(
                                REGEXP_REPLACE(
                                    REGEXP_REPLACE(name, '[ăâ]', 'a', 'g'),
                                '[șş]', 's', 'g'),
                            '[țţ]', 't', 'g'),
                        '[îì]', 'i', 'g'),
                    '[^a-zA-Z0-9\s-]', '', 'g'),
                '\s+', '-', 'g'),
            '-+', '-', 'g')
        )
    ) AS slug,
    
    -- Nume reprezentativ (primul din grup alfabetic)
    MIN(name) AS name,
    
    -- Imagine reprezentativă (prima disponibilă)
    (ARRAY_AGG(image_url ORDER BY CASE WHEN image_url IS NOT NULL THEN 0 ELSE 1 END, id))[1] AS image_url,
    
    -- Preț minim din toate variantele
    MIN(sale_price) AS from_price,
    
    -- Stoc total din toate variantele
    COALESCE(SUM(store_stock), 0) AS total_stock,
    
    -- Numărul de variante pentru acest produs
    COUNT(*) AS variant_count
    
FROM public.gene
WHERE name IS NOT NULL AND TRIM(name) != ''
GROUP BY LOWER(
    TRIM(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                REGEXP_REPLACE(
                    REGEXP_REPLACE(
                        REGEXP_REPLACE(
                            REGEXP_REPLACE(
                                REGEXP_REPLACE(name, '[ăâ]', 'a', 'g'),
                            '[șş]', 's', 'g'),
                        '[țţ]', 't', 'g'),
                    '[îì]', 'i', 'g'),
                '[^a-zA-Z0-9\s-]', '', 'g'),
            '\s+', '-', 'g'),
        '-+', '-', 'g')
    )
);

-- Comentariu: Acest VIEW creează un slug prin:
-- 1. Înlocuirea diacriticelor românești cu echivalentele ASCII
-- 2. Eliminarea caracterelor speciale
-- 3. Înlocuirea spațiilor cu cratimă
-- 4. Normalizarea la lowercase
-- Apoi grupează variantele și calculează statistici agregrate
