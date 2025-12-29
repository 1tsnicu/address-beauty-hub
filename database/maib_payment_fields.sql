-- Adăugare câmpuri pentru integrarea MAIB eCommerce în tabela orders

-- Adăugăm coloane pentru informații despre plată MAIB
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS maib_pay_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS maib_transaction_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS maib_payment_status VARCHAR(50) CHECK (maib_payment_status IN ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED')),
ADD COLUMN IF NOT EXISTS maib_callback_data JSONB;

-- Index pentru căutări rapide după payId
CREATE INDEX IF NOT EXISTS idx_orders_maib_pay_id ON orders(maib_pay_id);

-- Index pentru statusul plății
CREATE INDEX IF NOT EXISTS idx_orders_maib_payment_status ON orders(maib_payment_status);

-- Comentarii pentru documentare
COMMENT ON COLUMN orders.maib_pay_id IS 'ID-ul sesiunii de plată MAIB (payId)';
COMMENT ON COLUMN orders.maib_transaction_id IS 'ID-ul tranzacției MAIB după procesarea plății';
COMMENT ON COLUMN orders.maib_payment_status IS 'Statusul plății MAIB: PENDING, SUCCESS, FAILED, CANCELLED';
COMMENT ON COLUMN orders.maib_callback_data IS 'Datele complete primite în callback-ul MAIB (JSON)';

