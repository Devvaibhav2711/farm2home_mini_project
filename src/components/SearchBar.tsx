import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Flame, Sun, Leaf } from 'lucide-react';

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

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(6);

      if (!error && data) {
        setResults(data);
        setIsOpen(true);
      }
      setLoading(false);
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleProductClick = (product: Product) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/products?search=${encodeURIComponent(product.name)}`);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for vegetables, fruits, dairy..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-10 py-6 text-lg rounded-full border-2 border-primary/20 focus:border-primary bg-background/95 backdrop-blur-sm shadow-lg"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-border">
              {results.map((product) => (
                <li
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="flex items-center gap-4 p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-card-foreground truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">{product.category}</span>
                      <span className="text-sm font-bold text-primary">${product.price}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {product.is_trending && (
                      <Badge className="bg-orange-500 text-white text-xs py-0">
                        <Flame className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    {product.is_seasonal && (
                      <Badge className="bg-amber-500 text-white text-xs py-0">
                        <Sun className="h-3 w-3 mr-1" />
                        Seasonal
                      </Badge>
                    )}
                    {product.is_organic && (
                      <Badge className="bg-green-600 text-white text-xs py-0">
                        <Leaf className="h-3 w-3 mr-1" />
                        Organic
                      </Badge>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No products found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;