import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Flame, Sun, Leaf } from 'lucide-react';
import { useCart, Product } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  return (
    <div className="card-product group">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-semibold">
          {product.category}
        </div>
        {/* Product Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_trending && (
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white gap-1 text-xs">
              <Flame className="h-3 w-3" />
              Trending
            </Badge>
          )}
          {product.is_seasonal && (
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white gap-1 text-xs">
              <Sun className="h-3 w-3" />
              Seasonal
            </Badge>
          )}
          {product.is_organic && (
            <Badge className="bg-green-600 hover:bg-green-700 text-white gap-1 text-xs">
              <Leaf className="h-3 w-3" />
              Organic
            </Badge>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-card-foreground mb-1">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-3">{product.unit}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">₹{product.price}</span>
          <Button
            onClick={() => addToCart(product)}
            className="btn-hero"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
