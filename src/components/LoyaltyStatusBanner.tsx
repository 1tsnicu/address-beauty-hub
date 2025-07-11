import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronUp, Award, TrendingUp } from 'lucide-react';

export function LoyaltyStatusBanner() {
  const { user, isAuthenticated } = useAuth();
  const { formatPrice } = useCurrency();
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  // Calculate next loyalty level
  const getNextLoyaltyLevelInfo = () => {
    if (!user) return null;
    
    const currentTotal = user.totalSpent;
    
    if (currentTotal < 5001) {
      return {
        nextLevel: 1,
        nextDiscount: 5,
        amountNeeded: 5001 - currentTotal,
        threshold: 5001,
        progress: (currentTotal / 5001) * 100
      };
    } else if (currentTotal < 10001) {
      return {
        nextLevel: 2,
        nextDiscount: 6,
        amountNeeded: 10001 - currentTotal,
        threshold: 10001,
        progress: ((currentTotal - 5001) / (10001 - 5001)) * 100
      };
    } else if (currentTotal < 20001) {
      return {
        nextLevel: 3,
        nextDiscount: 7,
        amountNeeded: 20001 - currentTotal,
        threshold: 20001,
        progress: ((currentTotal - 10001) / (20001 - 10001)) * 100
      };
    } else if (currentTotal < 30001) {
      return {
        nextLevel: 4,
        nextDiscount: 8,
        amountNeeded: 30001 - currentTotal,
        threshold: 30001,
        progress: ((currentTotal - 20001) / (30001 - 20001)) * 100
      };
    } else if (currentTotal < 50001) {
      return {
        nextLevel: 5,
        nextDiscount: 10,
        amountNeeded: 50001 - currentTotal,
        threshold: 50001,
        progress: ((currentTotal - 30001) / (50001 - 30001)) * 100
      };
    }
    
    return null; // User has reached the highest loyalty level
  };
  
  const nextLevel = getNextLoyaltyLevelInfo();
  
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-background to-accent/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-4 w-4 text-primary" />
              Programul tău de fidelitate
            </CardTitle>
            <CardDescription>Beneficiezi automat de reduceri în funcție de suma totală a achizițiilor tale</CardDescription>
          </div>
          <Badge variant="outline" className="flex gap-1 items-center">
            <Award className="h-3 w-3" />
            Nivel {user.loyaltyLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Reducerea ta curentă:</span>
              <Badge variant="secondary" className="text-primary font-bold">
                {user.discountPercentage}%
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Total achiziții: {formatPrice(user.totalSpent)}
            </div>
            
            {nextLevel ? (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs">Până la nivelul următor:</span>
                  <span className="text-xs font-medium">{formatPrice(nextLevel.amountNeeded)}</span>
                </div>
                <Progress value={nextLevel.progress} className="h-2" />
                <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  La nivel {nextLevel.nextLevel} vei beneficia de {nextLevel.nextDiscount}% reducere!
                </div>
              </div>
            ) : (
              <div className="mt-3 text-center bg-green-50 p-2 rounded-md text-green-800 text-sm">
                Felicitări! Ai atins nivelul maxim de fidelitate (10% reducere)
              </div>
            )}
          </div>
          
          <div className="bg-background/50 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Sistem de fidelizare:</h4>
            <ul className="text-xs space-y-1">
              <li className={`flex justify-between ${user.totalSpent >= 5001 ? 'text-primary font-medium' : ''}`}>
                <span>De la suma de 5,001:</span>
                <span>5% reducere</span>
              </li>
              <li className={`flex justify-between ${user.totalSpent >= 10001 ? 'text-primary font-medium' : ''}`}>
                <span>De la suma de 10,001:</span>
                <span>6% reducere</span>
              </li>
              <li className={`flex justify-between ${user.totalSpent >= 20001 ? 'text-primary font-medium' : ''}`}>
                <span>De la suma de 20,001:</span>
                <span>7% reducere</span>
              </li>
              <li className={`flex justify-between ${user.totalSpent >= 30001 ? 'text-primary font-medium' : ''}`}>
                <span>De la suma de 30,001:</span>
                <span>8% reducere</span>
              </li>
              <li className={`flex justify-between ${user.totalSpent >= 50001 ? 'text-primary font-medium' : ''}`}>
                <span>De la suma de 50,001:</span>
                <span>10% reducere</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoyaltyStatusBanner;
