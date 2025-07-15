import { RealProduct, NormalizedRealProduct, PRODUCT_CATEGORIES } from '@/types/RealProduct';

export class RealProductService {
  
  // Helper function to remove undefined values from objects
  private static cleanObjectForFirebase(obj: any): any {
    const cleaned: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
          // Recursively clean nested objects
          const cleanedNested = this.cleanObjectForFirebase(value);
          if (Object.keys(cleanedNested).length > 0) {
            cleaned[key] = cleanedNested;
          }
        } else {
          cleaned[key] = value;
        }
      }
    }
    
    return cleaned;
  }

  // Normalize a raw product from gene.json to our application format
  static normalizeProduct(rawProduct: RealProduct): NormalizedRealProduct {
    const name = rawProduct["Наименование"];
    const code = rawProduct["Код"];
    const originalPrice = rawProduct["Цена продажи"];
    const discount = rawProduct["Скидка"];
    const stockQuantity = rawProduct["Общий остаток"];
    
    // Convert price from MDL to EUR (approximate rate: 1 EUR = 20 MDL)
    const priceEur = Math.round((originalPrice / 20) * 100) / 100;
    
    // Extract product specifications from name
    const specs = this.extractSpecifications(name);
    
    // Determine category based on product name
    const category = this.determineCategory(name);
    
    // Generate Romanian name
    const romanianName = this.translateToRomanian(name, specs);
    
    // Generate descriptions
    const descriptions = this.generateDescriptions(name, romanianName, specs, category);
    
    const subcategory = this.determineSubcategory(name, specs);
    
    const product: any = {
      name: romanianName,
      nameRu: name,
      code: code,
      price: {
        eur: priceEur,
        mdl: originalPrice
      },
      originalPrice: originalPrice,
      discount: discount,
      inStock: stockQuantity > 0,
      stockQuantity: Math.max(0, stockQuantity), // Ensure non-negative
      category: category,
      image: '/placeholder.svg', // Default image
      description: descriptions.ro,
      descriptionRu: descriptions.ru,
      specifications: specs,
      dimensions: {
        height: rawProduct["Высота"] || 0,
        width: rawProduct["Ширина"] || 0,
        depth: rawProduct["Глубина"] || 0,
        weight: rawProduct["Фактический вес"] || 0
      },
      featured: this.isFeaturedProduct(name, originalPrice),
      tags: this.generateTags(name, specs, category),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Only add subcategory if it exists
    if (subcategory) {
      product.subcategory = subcategory;
    }

    return this.cleanObjectForFirebase(product);
  }

  // Extract specifications like thickness, curl, color from product name
  private static extractSpecifications(name: string): any {
    const specs: any = {};
    
    // Extract thickness (0.05, 0.07, 0.10, etc.)
    const thicknessMatch = name.match(/0\.\d{2}/);
    if (thicknessMatch) {
      specs.thickness = thicknessMatch[0];
    }
    
    // Extract curl type (C, D, CC, etc.)
    const curlMatch = name.match(/\s([CD]{1,2})\s/);
    if (curlMatch) {
      specs.curl = curlMatch[1];
    }
    
    // Extract color information
    if (name.toLowerCase().includes('green')) specs.color = 'Verde';
    if (name.toLowerCase().includes('blue')) specs.color = 'Albastru';
    if (name.toLowerCase().includes('purple')) specs.color = 'Violet';
    if (name.toLowerCase().includes('red')) specs.color = 'Roșu';
    if (name.toLowerCase().includes('pink')) specs.color = 'Roz';
    if (name.toLowerCase().includes('brown')) specs.color = 'Maro';
    if (name.toLowerCase().includes('black')) specs.color = 'Negru';
    if (name.toLowerCase().includes('white')) specs.color = 'Alb';
    if (name.toLowerCase().includes('gold')) specs.color = 'Auriu';
    if (name.toLowerCase().includes('silver')) specs.color = 'Argintiu';
    
    // Extract special types
    if (name.toLowerCase().includes('ombre')) specs.type = 'Ombre';
    if (name.toLowerCase().includes('rainbow')) specs.type = 'Rainbow';
    if (name.toLowerCase().includes('volume')) specs.type = 'Volume';
    if (name.toLowerCase().includes('classic')) specs.type = 'Classic';
    if (name.toLowerCase().includes('mega')) specs.type = 'Mega Volume';
    if (name.toLowerCase().includes('easy')) specs.type = 'Easy Fan';
    if (name.toLowerCase().includes('mini')) specs.type = 'Mini';
    
    return specs;
  }

  // Determine product category
  private static determineCategory(name: string): string {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('lash') || lowerName.includes('gene') || 
        lowerName.includes('ombre') || lowerName.includes('rainbow') ||
        lowerName.includes('volume') || /0\.\d{2}/.test(name)) {
      return PRODUCT_CATEGORIES.LASHES;
    }
    
    if (lowerName.includes('brow') || lowerName.includes('sprânc')) {
      return PRODUCT_CATEGORIES.BROW_PRODUCTS;
    }
    
    if (lowerName.includes('adhesive') || lowerName.includes('adeziv') || 
        lowerName.includes('glue') || lowerName.includes('lipici')) {
      return PRODUCT_CATEGORIES.ADHESIVES;
    }
    
    if (lowerName.includes('remover') || lowerName.includes('remove')) {
      return PRODUCT_CATEGORIES.REMOVERS;
    }
    
    if (lowerName.includes('tool') || lowerName.includes('instrument') ||
        lowerName.includes('tweezer') || lowerName.includes('penseta')) {
      return PRODUCT_CATEGORIES.TOOLS;
    }
    
    return PRODUCT_CATEGORIES.LASHES; // Default to lashes for most products
  }

  // Determine subcategory
  private static determineSubcategory(name: string, specs: any): string | undefined {
    if (specs.type) return specs.type;
    
    const lowerName = name.toLowerCase();
    if (lowerName.includes('classic')) return 'Classic';
    if (lowerName.includes('volume')) return 'Volume';
    if (lowerName.includes('mega')) return 'Mega Volume';
    if (lowerName.includes('easy')) return 'Easy Fan';
    
    return undefined;
  }

  // Translate product name to Romanian
  private static translateToRomanian(name: string, specs: any): string {
    let romanianName = name;
    
    // Basic translations
    romanianName = romanianName.replace(/Ombre/gi, 'Ombre');
    romanianName = romanianName.replace(/Rainbow/gi, 'Rainbow');
    romanianName = romanianName.replace(/Volume/gi, 'Volum');
    romanianName = romanianName.replace(/Classic/gi, 'Classic');
    romanianName = romanianName.replace(/Mega/gi, 'Mega');
    romanianName = romanianName.replace(/Easy/gi, 'Easy');
    romanianName = romanianName.replace(/Fan/gi, 'Fan');
    romanianName = romanianName.replace(/mini/gi, 'Mini');
    
    // Color translations
    romanianName = romanianName.replace(/green/gi, 'Verde');
    romanianName = romanianName.replace(/blue/gi, 'Albastru');
    romanianName = romanianName.replace(/purple/gi, 'Violet');
    romanianName = romanianName.replace(/red/gi, 'Roșu');
    romanianName = romanianName.replace(/pink/gi, 'Roz');
    romanianName = romanianName.replace(/brown/gi, 'Maro');
    romanianName = romanianName.replace(/black/gi, 'Negru');
    romanianName = romanianName.replace(/white/gi, 'Alb');
    romanianName = romanianName.replace(/gold/gi, 'Auriu');
    romanianName = romanianName.replace(/silver/gi, 'Argintiu');
    
    // Add specifications to name if needed
    if (specs.thickness && specs.curl) {
      romanianName = `Gene ${specs.type || ''} ${specs.color || ''} ${specs.curl} ${specs.thickness}`.trim();
    }
    
    return romanianName.trim();
  }

  // Generate descriptions
  private static generateDescriptions(originalName: string, romanianName: string, specs: any, category: string) {
    const ro = this.generateRomanianDescription(romanianName, specs, category);
    const ru = this.generateRussianDescription(originalName, specs, category);
    
    return { ro, ru };
  }

  private static generateRomanianDescription(name: string, specs: any, category: string): string {
    let description = `${name} - `;
    
    if (category === PRODUCT_CATEGORIES.LASHES) {
      description += 'Gene premium pentru extensii profesionale. ';
      
      if (specs.thickness) {
        description += `Grosime: ${specs.thickness}mm. `;
      }
      if (specs.curl) {
        description += `Curbură: ${specs.curl}. `;
      }
      if (specs.color) {
        description += `Culoare: ${specs.color}. `;
      }
      if (specs.type) {
        description += `Tip: ${specs.type}. `;
      }
      
      description += 'Ideale pentru crearea unor look-uri spectaculoase și naturale. ';
      description += 'Calitate superioară, rezistență îndelungată, aplicare ușoară.';
    } else {
      description += `Produs profesional pentru industria beauty. Calitate premium garantată.`;
    }
    
    return description;
  }

  private static generateRussianDescription(name: string, specs: any, category: string): string {
    let description = `${name} - `;
    
    if (category === PRODUCT_CATEGORIES.LASHES) {
      description += 'Премиальные ресницы для профессионального наращивания. ';
      
      if (specs.thickness) {
        description += `Толщина: ${specs.thickness}мм. `;
      }
      if (specs.curl) {
        description += `Изгиб: ${specs.curl}. `;
      }
      if (specs.color && specs.color !== 'Negru') {
        description += `Цвет: ${specs.color}. `;
      }
      if (specs.type) {
        description += `Тип: ${specs.type}. `;
      }
      
      description += 'Идеальны для создания эффектных и естественных образов. ';
      description += 'Высочайшее качество, долговременная стойкость, легкое нанесение.';
    } else {
      description += `Профессиональный продукт для индустрии красоты. Гарантированное премиальное качество.`;
    }
    
    return description;
  }

  // Determine if product should be featured
  private static isFeaturedProduct(name: string, price: number): boolean {
    const lowerName = name.toLowerCase();
    
    // Feature expensive products
    if (price >= 300) return true;
    
    // Feature special types
    if (lowerName.includes('ombre') || lowerName.includes('rainbow') || 
        lowerName.includes('mega') || lowerName.includes('volume')) {
      return true;
    }
    
    // Randomly feature some products
    return Math.random() < 0.1; // 10% chance
  }

  // Generate product tags
  private static generateTags(name: string, specs: any, category: string): string[] {
    const tags: string[] = [];
    
    tags.push(category);
    
    if (specs.thickness) tags.push(`${specs.thickness}mm`);
    if (specs.curl) tags.push(`Curbură ${specs.curl}`);
    if (specs.color) tags.push(specs.color);
    if (specs.type) tags.push(specs.type);
    
    const lowerName = name.toLowerCase();
    if (lowerName.includes('professional') || lowerName.includes('pro')) tags.push('Professional');
    if (lowerName.includes('premium')) tags.push('Premium');
    if (lowerName.includes('natural')) tags.push('Natural');
    if (lowerName.includes('dramatic')) tags.push('Dramatic');
    
    return tags;
  }

  // Bulk normalize products
  static normalizeProducts(rawProducts: RealProduct[]): NormalizedRealProduct[] {
    return rawProducts
      .filter(product => product["Наименование"] && product["Код"]) // Filter valid products
      .map(product => this.normalizeProduct(product));
  }
}
