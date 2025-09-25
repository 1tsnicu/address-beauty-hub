-- Tabela pentru comenzile plasate
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Informații client
    customer_first_name VARCHAR(100) NOT NULL,
    customer_last_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    
    -- Adresa de livrare
    customer_address_street TEXT NOT NULL,
    customer_address_city VARCHAR(100) NOT NULL,
    customer_address_postal_code VARCHAR(10) NOT NULL,
    
    -- Informații livrare
    delivery_method VARCHAR(20) NOT NULL CHECK (delivery_method IN ('standard', 'express', 'pickup')),
    delivery_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    
    -- Informații plată
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('card', 'cash', 'transfer')),
    
    -- Totaluri
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Produsele comandate (JSON)
    items JSONB NOT NULL,
    
    -- Observații și status
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexuri pentru performanță
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_method ON orders(delivery_method);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);

-- Trigger pentru actualizarea updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarii pentru documentație
COMMENT ON TABLE orders IS 'Tabela pentru comenzile plasate de clienți';
COMMENT ON COLUMN orders.items IS 'Array JSON cu produsele comandate, fiecare cu productId, name, quantity, price, variants';
COMMENT ON COLUMN orders.delivery_method IS 'Metoda de livrare: standard, express, pickup';
COMMENT ON COLUMN orders.payment_method IS 'Metoda de plată: card, cash, transfer';
COMMENT ON COLUMN orders.status IS 'Statusul comenzii: pending, confirmed, processing, shipped, delivered, cancelled';

-- Exemplu de inserare (pentru testare)
/*
INSERT INTO orders (
    customer_first_name, customer_last_name, customer_email, customer_phone,
    customer_address_street, customer_address_city, customer_address_postal_code,
    delivery_method, delivery_price, payment_method,
    subtotal, delivery_cost, total_amount,
    items, notes, status
) VALUES (
    'Ion', 'Popescu', 'ion.popescu@email.com', '0712345678',
    'Strada Mihai Viteazu nr. 10', 'București', '010101',
    'standard', 15.00, 'card',
    150.00, 15.00, 165.00,
    '[
        {
            "productId": 1,
            "name": "Gene false premium",
            "quantity": 2,
            "price": 75.00,
            "variants": {
                "curvature": "C",
                "length": "12mm"
            }
        }
    ]',
    'Livrare la parter',
    'pending'
);
*/
