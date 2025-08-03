import React, { useState } from 'react';
import { Button } from './ui/button';

interface CartItem {
  product_id: string;
  name: string;
  qty: number;
  price: number;
}

interface CheckoutFormProps {
  cart: CartItem[];
  total: number;
  currency: string;
  onOrderPlaced?: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cart, total, currency, onOrderPlaced }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // Salvează comanda în Supabase
      // @ts-ignore
      const { data, error } = await window.supabase.from('orders').insert([
        {
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          order_items: cart,
          order_total: total,
          currency,
          order_status: 'pending',
        }
      ]);
      if (error) throw new Error(error.message);
      setSuccess(true);
      if (onOrderPlaced) onOrderPlaced();
    } catch (err: any) {
      setError(err.message || 'Eroare la plasarea comenzii');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Finalizează comanda</h2>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Nume complet</label>
        <input type="text" className="w-full border rounded px-3 py-2" value={customerName} onChange={e => setCustomerName(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Email</label>
        <input type="email" className="w-full border rounded px-3 py-2" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Telefon</label>
        <input type="text" className="w-full border rounded px-3 py-2" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Adresă livrare</label>
        <input type="text" className="w-full border rounded px-3 py-2" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Produse comandate</label>
        <ul className="list-disc pl-5 text-sm">
          {cart.map(item => (
            <li key={item.product_id}>{item.name} x {item.qty} ({item.price} {currency})</li>
          ))}
        </ul>
        <div className="mt-2 font-bold">Total: {total} {currency}</div>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">Comanda a fost plasată cu succes!</div>}
      <Button type="submit" disabled={loading} className="w-full">{loading ? 'Se procesează...' : 'Plasează comanda'}</Button>
    </form>
  );
};

export default CheckoutForm;
