import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, User, MapPin, Phone, Mail, CreditCard, 
  Calendar, Clock, CheckCircle, ArrowLeft, Truck, Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { orderService } from '@/services/orderService';

interface OrderFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryMethod: 'standard' | 'express' | 'pickup';
  paymentMethod: 'card' | 'cash' | 'transfer';
  notes: string;
  agreeToTerms: boolean;
}

const CheckoutPage = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { items: cartItems, clearCart, getTotalPrice, getTotalItems } = useCart();
  const { currency, getCurrencySymbol } = useCurrency();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<OrderFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    postalCode: '',
    deliveryMethod: 'standard',
    paymentMethod: 'card',
    notes: '',
    agreeToTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Redirect if cart is empty or user is not authenticated
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.info('Coșul tău este gol. Te rugăm să adaugi produse pentru a continua.');
      navigate('/magazin');
    } else if (!isAuthenticated) {
      toast.error('Trebuie să te conectezi pentru a face o comandă.');
      navigate('/');
    }
  }, [cartItems, navigate, isAuthenticated]);

  const handleInputChange = (field: keyof OrderFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const deliveryOptions = [
    { value: 'standard', label: 'Livrare standard (2-3 zile lucrătoare)', price: 15 },
    { value: 'express', label: 'Livrare express (1 zi lucrătoare)', price: 25 },
    { value: 'pickup', label: 'Ridicare din magazin (gratuit)', price: 0 }
  ];

  const paymentOptions = [
    { value: 'card', label: 'Card bancar', icon: CreditCard },
    { value: 'cash', label: 'Ramburs la livrare', icon: Truck },
    { value: 'transfer', label: 'Transfer bancar', icon: Shield }
  ];


  const getDeliveryPrice = () => {
    const option = deliveryOptions.find(opt => opt.value === formData.deliveryMethod);
    return option?.price || 0;
  };

  const getSubtotal = () => {
    return getTotalPrice();
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryPrice();
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof OrderFormData]) {
        toast.error(`Câmpul ${field} este obligatoriu`);
        return false;
      }
    }

    if (!formData.agreeToTerms) {
      toast.error('Trebuie să accepți termenii și condițiile');
      return false;
    }

    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Create order object for database
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.address,
            city: formData.city,
            postalCode: formData.postalCode
          }
        },
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          variants: item.variants
        })),
        delivery: {
          method: formData.deliveryMethod,
          price: getDeliveryPrice()
        },
        payment: {
          method: formData.paymentMethod
        },
        totals: {
          subtotal: getSubtotal(),
          delivery: getDeliveryPrice(),
          total: getTotal()
        },
        notes: formData.notes,
        status: 'pending' as const
      };

      // Save order to database
      const result = await orderService.createOrder(orderData);

      if (!result.success) {
        toast.error(result.error || 'A apărut o eroare la salvarea comenzii');
        return;
      }

      // Success - clear cart and redirect to confirmation page
      clearCart();
      toast.success('Comanda a fost plasată cu succes!');
      navigate('/comanda-confirmata', { state: { order: result.order } });

    } catch (error) {
      toast.error('A apărut o eroare la plasarea comenzii. Te rugăm să încerci din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/magazin">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Înapoi la magazin
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Finalizează Comanda
            </h1>
            <p className="text-xl text-muted-foreground">
              Completează datele pentru a finaliza comanda ta
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Rezumatul Comenzii
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                        ) : (
                          <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Cantitate: {item.quantity}
                        </p>
                        {item.variants && Object.keys(item.variants).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(item.variants).map(([key, value]) => (
                              <Badge key={key} variant="outline" className="text-xs">
                                {key}: {value}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {getCurrencySymbol()}{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({getTotalItems()} produse)</span>
                    <span>{getCurrencySymbol()}{getSubtotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livrare</span>
                    <span>
                      {getDeliveryPrice() === 0 ? 'Gratuit' : `${getCurrencySymbol()}${getDeliveryPrice()}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{getCurrencySymbol()}{getTotal()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Step 1: Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informații Personale
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prenume *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Introdu prenumele"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nume *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Introdu numele"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="email@exemplu.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="07xx xxx xxx"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Delivery Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Informații de Livrare
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Adresa completă *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Strada, numărul, blocul, scara, etajul, apartamentul"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Orașul *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Orașul"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Cod poștal *</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        placeholder="123456"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Metoda de livrare *</Label>
                    <div className="space-y-2 mt-2">
                      {deliveryOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            formData.deliveryMethod === option.value
                              ? 'border-primary bg-primary/5'
                              : 'border-muted hover:border-primary/50'
                          }`}
                          onClick={() => handleInputChange('deliveryMethod', option.value)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                checked={formData.deliveryMethod === option.value}
                                onChange={() => handleInputChange('deliveryMethod', option.value)}
                                className="text-primary"
                              />
                              <span className="font-medium">{option.label}</span>
                            </div>
                            <span className="font-bold">
                              {option.price === 0 ? 'Gratuit' : `${getCurrencySymbol()}${option.price}`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 3: Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Metoda de Plată
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {paymentOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <div
                          key={option.value}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            formData.paymentMethod === option.value
                              ? 'border-primary bg-primary/5'
                              : 'border-muted hover:border-primary/50'
                          }`}
                          onClick={() => handleInputChange('paymentMethod', option.value)}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              checked={formData.paymentMethod === option.value}
                              onChange={() => handleInputChange('paymentMethod', option.value)}
                              className="text-primary"
                            />
                            <IconComponent className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">{option.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Step 4: Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Informații Adiționale
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="notes">Observații (opțional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Instrucțiuni speciale pentru livrare sau alte observații..."
                      rows={3}
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                      className="mt-1 text-primary"
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm">
                      Accept{' '}
                      <Link to="/termeni" className="text-primary hover:underline">
                        termenii și condițiile
                      </Link>{' '}
                      și{' '}
                      <Link to="/confidentialitate" className="text-primary hover:underline">
                        politica de confidențialitate
                      </Link>
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting || !formData.agreeToTerms}
                  size="lg"
                  className="min-w-[200px]"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Se procesează...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Finalizează Comanda
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
