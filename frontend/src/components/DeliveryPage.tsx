import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  CreditCard, 
  MapPin, 
  Clock, 
  Shield, 
  FileText,
  Truck,
  Store,
  Globe,
  Phone,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const DeliveryPage = () => {
  const { t, language } = useLanguage();

  const paymentMethods = [
    {
      id: 1,
      title: 'Achitare la ridicarea comenzii',
      description: 'Plata se poate efectua direct la vânzător, în momentul ridicării comenzii din salon sau de la magazin.',
      icon: Store
    },
    {
      id: 2,
      title: 'Achitare la livrare (ramburs)',
      description: 'Dacă optați pentru livrarea prin curier, comanda poate fi achitată în momentul livrării, direct la curier.',
      icon: Truck
    },
    {
      id: 3,
      title: 'Achitare online',
      description: 'Comenzile pot fi achitate direct pe site, în mod rapid și sigur, la finalizarea comenzii, prin intermediul sistemului nostru securizat de plată.',
      icon: CreditCard
    }
  ];

  const deliveryOptions = [
    {
      id: 1,
      title: 'Ridicare personală',
      description: 'Puteți ridica comanda direct de la adresa magazinului indicată pe site.',
      details: 'Veți fi contactat(ă) de către un manager imediat ce comanda este pregătită pentru ridicare.',
      cost: 'Gratuit',
      icon: Store
    },
    {
      id: 2,
      title: 'Livrare prin curier – în Chișinău',
      description: 'Livrare rapidă în capitală',
      details: [
        'Pentru comenzile plasate până la ora 15:00, livrarea se efectuează în ziua următoare.',
        'Pentru comenzile plasate după ora 15:00, livrarea se efectuează în decurs de două zile.'
      ],
      cost: '45 lei',
      icon: Truck
    },
    {
      id: 3,
      title: 'Livrare în afara orașului Chișinău',
      description: 'Livrare în toată țara',
      details: [
        'Pentru comenzile înregistrate până la ora 15:00, livrarea se efectuează în ziua următoare.',
        'Comenzile plasate după ora 15:00 vor fi livrate în termen de două zile lucrătoare.'
      ],
      cost: '60 lei',
      icon: MapPin
    },
    {
      id: 4,
      title: 'Livrare internațională',
      description: 'Livrări peste hotare disponibile',
      details: 'Livrările peste hotare sunt disponibile în funcție de țară și de metodele de expediere disponibile. Pentru detalii privind costurile și termenele de livrare internațională, vă rugăm să contactați managerul nostru.',
      cost: 'La cerere',
      icon: Globe
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-light-blue/20 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            {t('delivery.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('delivery.description')}
          </p>
        </div>
      </section>

      {/* Delivery Options */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-primary mb-4">
              {t('delivery.options.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('delivery.options.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {deliveryOptions.map((option) => (
              <Card key={option.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <option.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                      <Badge variant="outline">{option.cost}</Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{option.description}</p>
                </CardHeader>
                <CardContent>
                  {Array.isArray(option.details) ? (
                    <ul className="space-y-2">
                      {option.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">{option.details}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-12 bg-light-blue/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-primary mb-4">
              {t('delivery.payment.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('delivery.payment.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {paymentMethods.map((method) => (
              <Card key={method.id} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4">
                    <method.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{method.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Fiscal Invoice */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                {t('delivery.invoice.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('delivery.invoice.description')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Return Policy */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-primary mb-4">
              {t('delivery.return.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('delivery.return.description')}
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-orange-200 bg-orange-50 flex flex-col h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-orange-800">
                  <AlertCircle className="h-5 w-5" />
                  {t('delivery.return.restrictions')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-orange-700 text-sm">
                <p className="mb-2">
                  Din motive de igienă și siguranță, produsele cosmetice și de îngrijire personală <strong>nu pot fi returnate</strong> după ce au fost desfăcute sau testate.
                </p>
                <p>
                  Majoritatea produselor noastre sunt destinate aplicării directe pe piele, ochi sau mucoase, iar pentru a fi testate este necesară desigilarea ambalajului, ceea ce exclude posibilitatea reutilizării lor sau reintroducerii în vânzare.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50 flex flex-col h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  {t('delivery.return.accepted')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-green-700 text-sm">
                <p className="mb-2">
                  <strong>Returul este acceptat doar dacă:</strong>
                </p>
                <ul className="space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Produsul este în ambalajul original, sigilat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Produsul este nedeschis și neutilizat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Solicitarea este făcută în termen de maximum 14 zile calendaristice</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  {t('delivery.return.legal')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                <p className="mb-2">
                  Nu se acceptă returul produselor desfăcute, testate sau utilizate, în conformitate cu normele de igienă și protecția consumatorului din Republica Moldova.
                </p>
                <p>
                  Pentru orice întrebări sau situații speciale, vă încurajăm să ne contactați. Suntem deschiși să analizăm individual fiecare caz.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-gradient-to-r from-primary/10 via-light-blue/20 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            {t('delivery.contact.title')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t('delivery.contact.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Phone className="h-4 w-4 mr-2" />
              {t('delivery.contact.call')}
            </Button>
            <Button variant="outline" size="lg">
              {t('delivery.contact.email')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeliveryPage;