import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Gift, TrendingUp, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface NewsletterProps {
  variant?: 'compact' | 'full' | 'sidebar';
  className?: string;
}

const Newsletter: React.FC<NewsletterProps> = ({ variant = 'full', className = '' }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const interestOptions = [
    { id: 'courses', label: 'Cursuri și workshop-uri', icon: Calendar },
    { id: 'products', label: 'Produse noi și oferte', icon: Gift },
    { id: 'tips', label: 'Sfaturi și tehnici beauty', icon: TrendingUp },
    { id: 'events', label: 'Evenimente și demonstrații', icon: Calendar }
  ];

  const handleInterestToggle = (interestId: string) => {
    setInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Eroare",
        description: "Te rog să introduci adresa de email.",
        variant: "destructive",
      });
      return;
    }

    if (!agreeToTerms) {
      toast({
        title: "Eroare", 
        description: "Trebuie să accepți termenii și condițiile.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // În realitate, aici ar fi un apel către API pentru înregistrarea în newsletter
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulare API call
      
      toast({
        title: "Succes! 🎉",
        description: "Te-ai abonat cu succes la newsletter! Verifică-ți emailul pentru confirmarea abonamentului.",
      });

      // Reset form
      setEmail('');
      setName('');
      setInterests([]);
      setAgreeToTerms(false);
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la abonare. Te rog să încerci din nou.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-xl ${className}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-primary rounded-full p-3">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-primary">
              Rămâi conectată!
            </h3>
            <p className="text-sm text-muted-foreground">
              Primește oferte exclusive și sfaturi beauty
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="adresa@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background"
          />
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="compact-terms" 
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
            />
            <Label htmlFor="compact-terms" className="text-xs">
              Accept <span className="text-primary cursor-pointer">termenii și condițiile</span>
            </Label>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Se abonează..." : "Abonează-te"}
          </Button>
        </form>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5 text-primary" />
            Newsletter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sidebar-terms" 
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
              />
              <Label htmlFor="sidebar-terms" className="text-xs">
                Accept termenii
              </Label>
            </div>
            
            <Button type="submit" size="sm" className="w-full" disabled={isLoading}>
              {isLoading ? "..." : "Abonează-te"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Full variant
  return (
    <Card className={`${className}`}>
      <CardHeader className="text-center">
        <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="font-heading text-2xl text-primary">
          Abonează-te la Newsletter
        </CardTitle>
        <p className="text-muted-foreground">
          Fii primul care află despre cursurile noi, ofertele speciale și sfaturile de la experți
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newsletter-email">Email *</Label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="adresa@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newsletter-name">Nume (opțional)</Label>
              <Input
                id="newsletter-name"
                placeholder="Maria Popescu"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <Label>Ce te interesează? (opțional)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {interestOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={option.id}
                    checked={interests.includes(option.id)}
                    onCheckedChange={() => handleInterestToggle(option.id)}
                  />
                  <div className="flex items-center gap-2">
                    <option.icon className="h-4 w-4 text-primary" />
                    <Label htmlFor={option.id} className="text-sm cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-accent/50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-primary mb-3">Ce vei primi:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" />
                <span>Oferte exclusive pentru abonați</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Anunțuri despre cursuri noi</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>Sfaturi și tehnici de la experți</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>Acces la resurse exclusive</span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="newsletter-terms" 
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
            />
            <Label htmlFor="newsletter-terms" className="text-sm leading-relaxed">
              Accept <Button variant="link" className="p-0 h-auto text-sm text-primary">
                termenii și condițiile
              </Button> și <Button variant="link" className="p-0 h-auto text-sm text-primary">
                politica de confidențialitate
              </Button>. Pot să mă dezabonez oricând. *
            </Label>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? "Se abonează..." : "Abonează-te la Newsletter"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Newsletter;