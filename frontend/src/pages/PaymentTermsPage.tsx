import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Shield, CreditCard, Lock, FileText } from 'lucide-react';

const PaymentTermsPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Înapoi
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Termeni și Condiții de Plată
            </h1>
            <p className="text-xl text-muted-foreground">
              Informații despre metodele de plată și securitatea tranzacțiilor
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Metode de Plată Acceptate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Card Payment */}
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Plată cu Card Bancar (MAIB eCommerce)
              </h3>
              <p className="text-muted-foreground mb-4">
                Acceptăm plăți online prin card bancar folosind platforma securizată MAIB eCommerce. 
                Toate tranzacțiile sunt procesate în siguranță și conform standardelor internaționale de securitate.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="font-medium">Carduri acceptate:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Visa</li>
                  <li>Mastercard</li>
                  <li>Maestro</li>
                </ul>
              </div>
            </div>

            <Separator />

            {/* Cash on Delivery */}
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Ramburs la Livrare
              </h3>
              <p className="text-muted-foreground">
                Poți plăti comanda la livrare, în numerar. Te rugăm să ai suma exactă sau să fii pregătit 
                pentru rest. Această metodă este disponibilă doar pentru livrări în Republica Moldova.
              </p>
            </div>

            <Separator />

            {/* Bank Transfer */}
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Transfer Bancar
              </h3>
              <p className="text-muted-foreground">
                Poți efectua un transfer bancar direct în contul nostru. După confirmarea plății, 
                comanda va fi procesată. Detaliile pentru transfer vor fi trimise pe email după plasarea comenzii.
              </p>
            </div>

            <Separator />

            {/* Security */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Securitatea Plăților</h3>
              <p className="text-muted-foreground mb-4">
                Toate plățile online sunt procesate prin platforma securizată MAIB eCommerce, care folosește:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Criptare SSL/TLS pentru toate tranzacțiile</li>
                <li>Conformitate cu standardul PCI DSS pentru securitatea datelor cardurilor</li>
                <li>Verificare 3D Secure pentru plăți suplimentare de securitate</li>
                <li>Nu stocăm datele cardului tău bancar pe serverele noastre</li>
              </ul>
            </div>

            <Separator />

            {/* Processing Time */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Timp de Procesare</h3>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Plăți cu card:</strong> Procesate imediat, comanda este confirmată automat</p>
                <p><strong>Ramburs:</strong> Plata se efectuează la livrare</p>
                <p><strong>Transfer bancar:</strong> Comanda este procesată după confirmarea plății (1-2 zile lucrătoare)</p>
              </div>
            </div>

            <Separator />

            {/* Refunds */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Returnări și Rambursări</h3>
              <p className="text-muted-foreground mb-4">
                În cazul returnării produselor, rambursarea se va face prin aceeași metodă folosită pentru plată:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Plăți cu card: rambursarea se face în contul cardului folosit (5-10 zile lucrătoare)</li>
                <li>Ramburs: returnarea se face în numerar sau prin transfer bancar</li>
                <li>Transfer bancar: rambursarea se face în același cont bancar</li>
              </ul>
            </div>

            <Separator />

            {/* Contact */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Întrebări despre Plăți?</h3>
              <p className="text-muted-foreground mb-4">
                Dacă ai întrebări sau probleme legate de plăți, te rugăm să ne contactezi:
              </p>
              <div className="flex gap-4">
                <Link to="/contact">
                  <Button variant="outline">Contactează-ne</Button>
                </Link>
                <Link to="/termeni">
                  <Button variant="outline">Termeni și Condiții Generale</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentTermsPage;

