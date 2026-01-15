import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PaymentFailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'Plata a fost anulată sau a eșuat.';

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white shadow-sm rounded-lg p-6 border border-border">
        <h1 className="text-2xl font-semibold mb-2 text-red-600">Plata nu a fost finalizată</h1>
        <p className="text-muted-foreground mb-6">{reason}</p>

        <div className="mt-6 flex gap-3">
          <Button asChild>
            <Link to="/checkout">Reîncearcă plata</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/magazin">Înapoi la magazin</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailPage;
