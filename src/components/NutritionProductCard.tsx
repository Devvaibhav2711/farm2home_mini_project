import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ShoppingCart,
  Flame,
  Sun,
  Leaf,
  Info,
  Sparkles,
  Heart,
  Zap,
  Apple,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Nutrition {
  calories: number;
  protein: number;
  carbohydrates: number;
  fiber: number;
  fat: number;
  vitamins: string[];
  minerals: string[];
}

export interface NutritionProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  unit: string;
  stock: number;
  isOrganic?: boolean;
  isSeasonal?: boolean;
  isTrending?: boolean;
  nutrition?: Nutrition;
  healthBenefits?: string[];
  tags?: string[];
}

interface NutritionProductCardProps {
  product: NutritionProduct;
  showNutrition?: boolean;
}

const TAG_ICONS: Record<string, typeof Zap> = {
  'high-vitamin-c': Sparkles,
  'rich-in-iron': Zap,
  'high-protein': Apple,
  'low-calorie': Flame,
  'high-fiber': Leaf,
  'heart-healthy': Heart,
  'immunity-boost': Sparkles,
};

const TAG_COLORS: Record<string, string> = {
  'high-vitamin-c': 'bg-orange-500',
  'rich-in-iron': 'bg-red-600',
  'high-protein': 'bg-blue-600',
  'low-calorie': 'bg-green-500',
  'high-fiber': 'bg-amber-600',
  'heart-healthy': 'bg-pink-500',
  'immunity-boost': 'bg-purple-500',
};

const TAG_LABELS: Record<string, string> = {
  'high-vitamin-c': 'Vitamin C',
  'rich-in-iron': 'Iron Rich',
  'high-protein': 'High Protein',
  'low-calorie': 'Low Cal',
  'high-fiber': 'High Fiber',
  'heart-healthy': 'Heart Healthy',
  'immunity-boost': 'Immunity',
};

const NutritionProductCard = ({ product, showNutrition = true }: NutritionProductCardProps) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const nutrition = product.nutrition;
  const healthBenefits = product.healthBenefits || [];
  const tags = product.tags || [];

  return (
    <Card 
      className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Category Badge */}
        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm text-foreground px-2 py-1 rounded-full text-xs font-semibold">
          {product.category}
        </div>

        {/* Status Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isTrending && (
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white gap-1 text-xs">
              <Flame className="h-3 w-3" />
              Trending
            </Badge>
          )}
          {product.isSeasonal && (
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white gap-1 text-xs">
              <Sun className="h-3 w-3" />
              Seasonal
            </Badge>
          )}
          {product.isOrganic && (
            <Badge className="bg-green-600 hover:bg-green-700 text-white gap-1 text-xs">
              <Leaf className="h-3 w-3" />
              Organic
            </Badge>
          )}
        </div>

        {/* Quick Nutrition Tags */}
        {showNutrition && tags.length > 0 && (
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
            {tags.slice(0, 3).map(tag => {
              const Icon = TAG_ICONS[tag] || Sparkles;
              return (
                <TooltipProvider key={tag}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        className={`${TAG_COLORS[tag] || 'bg-gray-500'} text-white text-[10px] px-1.5 py-0.5`}
                      >
                        <Icon className="h-2.5 w-2.5 mr-0.5" />
                        {TAG_LABELS[tag] || tag}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{TAG_LABELS[tag] || tag}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Product Name & Category */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-card-foreground line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">{product.unit}</p>
        </div>

        {/* Compact Nutrition Info */}
        {showNutrition && nutrition && (
          <div className="grid grid-cols-4 gap-1 mb-3 p-2 bg-muted/50 rounded-lg text-center">
            <div>
              <p className="text-xs text-muted-foreground">Cal</p>
              <p className="text-sm font-semibold">{nutrition.calories}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Protein</p>
              <p className="text-sm font-semibold">{nutrition.protein}g</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Carbs</p>
              <p className="text-sm font-semibold">{nutrition.carbohydrates}g</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fiber</p>
              <p className="text-sm font-semibold">{nutrition.fiber}g</p>
            </div>
          </div>
        )}

        {/* Price & Actions */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">₹{product.price}</span>
          <div className="flex gap-2">
            {/* Nutrition Details Dialog */}
            {showNutrition && nutrition && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Info className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      {product.name}
                    </DialogTitle>
                    <DialogDescription>
                      Nutritional information per 100g
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    {/* Nutrition Facts */}
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Nutrition Facts</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Calories</span>
                          <span className="font-medium">{nutrition.calories} kcal</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Protein</span>
                          <span className="font-medium">{nutrition.protein}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Carbohydrates</span>
                          <span className="font-medium">{nutrition.carbohydrates}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fiber</span>
                          <span className="font-medium">{nutrition.fiber}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fat</span>
                          <span className="font-medium">{nutrition.fat}g</span>
                        </div>
                      </div>
                    </div>

                    {/* Vitamins */}
                    {nutrition.vitamins && nutrition.vitamins.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Vitamins</h4>
                        <div className="flex flex-wrap gap-1">
                          {nutrition.vitamins.map(vitamin => (
                            <Badge key={vitamin} variant="secondary">
                              {vitamin}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Minerals */}
                    {nutrition.minerals && nutrition.minerals.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Minerals</h4>
                        <div className="flex flex-wrap gap-1">
                          {nutrition.minerals.map(mineral => (
                            <Badge key={mineral} variant="outline">
                              {mineral}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Health Benefits */}
                    {healthBenefits.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Health Benefits</h4>
                        <ul className="space-y-1">
                          {healthBenefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className="text-green-500 mt-1">•</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
            
            <Button
              onClick={() => addToCart({
                id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                unit: product.unit,
                is_organic: product.isOrganic,
                is_seasonal: product.isSeasonal,
                is_trending: product.isTrending,
              })}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionProductCard;
