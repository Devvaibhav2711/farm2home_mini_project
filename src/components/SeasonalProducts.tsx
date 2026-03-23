import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import { NavLink } from './NavLink';
import { Button } from './ui/button';
import { Flame, Sun, ArrowRight, Leaf } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  unit: string;
  is_trending?: boolean;
  is_seasonal?: boolean;
  is_organic?: boolean;
}

const SeasonalProducts = () => {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [seasonalProducts, setSeasonalProducts] = useState<Product[]>([]);
  const [organicProducts, setOrganicProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('seasonal-products-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Product change:', payload.eventType);
          
          if (payload.eventType === 'INSERT') {
            const newProduct = payload.new as Product;
            if (newProduct.is_trending) {
              setTrendingProducts(prev => [newProduct, ...prev].slice(0, 4));
            }
            if (newProduct.is_seasonal) {
              setSeasonalProducts(prev => [newProduct, ...prev].slice(0, 4));
            }
            if (newProduct.is_organic) {
              setOrganicProducts(prev => [newProduct, ...prev].slice(0, 4));
            }
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Product;
            // Update trending
            setTrendingProducts(prev => {
              if (updated.is_trending) {
                const exists = prev.find(p => p.id === updated.id);
                if (exists) {
                  return prev.map(p => p.id === updated.id ? updated : p);
                }
                return [updated, ...prev].slice(0, 4);
              }
              return prev.filter(p => p.id !== updated.id);
            });
            // Update seasonal
            setSeasonalProducts(prev => {
              if (updated.is_seasonal) {
                const exists = prev.find(p => p.id === updated.id);
                if (exists) {
                  return prev.map(p => p.id === updated.id ? updated : p);
                }
                return [updated, ...prev].slice(0, 4);
              }
              return prev.filter(p => p.id !== updated.id);
            });
            // Update organic
            setOrganicProducts(prev => {
              if (updated.is_organic) {
                const exists = prev.find(p => p.id === updated.id);
                if (exists) {
                  return prev.map(p => p.id === updated.id ? updated : p);
                }
                return [updated, ...prev].slice(0, 4);
              }
              return prev.filter(p => p.id !== updated.id);
            });
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as Product;
            setTrendingProducts(prev => prev.filter(p => p.id !== deleted.id));
            setSeasonalProducts(prev => prev.filter(p => p.id !== deleted.id));
            setOrganicProducts(prev => prev.filter(p => p.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProducts = async () => {
    const [trendingRes, seasonalRes, organicRes] = await Promise.all([
      supabase.from('products').select('*').eq('is_trending', true).order('created_at', { ascending: false }).limit(4),
      supabase.from('products').select('*').eq('is_seasonal', true).order('created_at', { ascending: false }).limit(4),
      supabase.from('products').select('*').eq('is_organic', true).order('created_at', { ascending: false }).limit(4)
    ]);
    
    if (trendingRes.data) setTrendingProducts(trendingRes.data);
    if (seasonalRes.data) setSeasonalProducts(seasonalRes.data);
    if (organicRes.data) setOrganicProducts(organicRes.data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="animate-pulse text-muted-foreground">Loading products...</div>
      </div>
    );
  }

  return (
    <>
      {/* Trending Section */}
      {trendingProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Flame className="h-8 w-8 text-accent" />
                <h2 className="text-3xl font-bold">Trending Now</h2>
              </div>
              <NavLink to="/products">
                <Button variant="outline" className="gap-2">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </NavLink>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Seasonal Section */}
      {seasonalProducts.length > 0 && (
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Sun className="h-8 w-8 text-accent" />
                <h2 className="text-3xl font-bold">Seasonal Specials</h2>
              </div>
              <NavLink to="/products">
                <Button variant="outline" className="gap-2">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </NavLink>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {seasonalProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Organic Section */}
      {organicProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Leaf className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold">Organic Products</h2>
              </div>
              <NavLink to="/products">
                <Button variant="outline" className="gap-2">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </NavLink>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {organicProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default SeasonalProducts;
