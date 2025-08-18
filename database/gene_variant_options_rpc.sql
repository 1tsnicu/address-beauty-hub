-- Funcție RPC pentru obținerea opțiunilor variantelor unui produs
-- Această funcție optimizează query-ul pentru chip-uri

CREATE OR REPLACE FUNCTION get_gene_variant_options(product_slug text)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
    result json;
BEGIN
    -- Denormalizează slug-ul pentru comparație cu name
    WITH product_variants AS (
        SELECT curbura, grosime, lungime, culoare
        FROM public.gene
        WHERE LOWER(
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
        ) = product_slug
    )
    SELECT json_build_object(
        'curburi', (
            SELECT array_agg(DISTINCT curbura ORDER BY curbura) 
            FROM product_variants 
            WHERE curbura IS NOT NULL
        ),
        'grosimi', (
            SELECT array_agg(DISTINCT grosime ORDER BY grosime) 
            FROM product_variants 
            WHERE grosime IS NOT NULL
        ),
        'lungimi', (
            SELECT array_agg(DISTINCT lungime ORDER BY lungime) 
            FROM product_variants 
            WHERE lungime IS NOT NULL
        ),
        'culori', (
            SELECT array_agg(DISTINCT culoare ORDER BY culoare) 
            FROM product_variants 
            WHERE culoare IS NOT NULL
        )
    ) INTO result;
    
    RETURN result;
END;
$$;

-- Acordă permisiuni pentru funcție
GRANT EXECUTE ON FUNCTION get_gene_variant_options(text) TO anon;
GRANT EXECUTE ON FUNCTION get_gene_variant_options(text) TO authenticated;
