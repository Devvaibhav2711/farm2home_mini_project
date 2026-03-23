import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import NutritionProductCard, { NutritionProduct } from '@/components/NutritionProductCard';
import { ProductFilterSidebar, ProductFilterSheet, FilterState } from '@/components/ProductFilter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal, Grid3X3, LayoutList } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  tags: [],
  maxCalories: 500,
  minProtein: 0,
  organicOnly: false,
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [products, setProducts] = useState<NutritionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Update search query from URL params
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Fetch products with filters from Supabase
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      // Start building the query
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      // Apply category filter
      if (filters.categories.length > 0) {
        query = query.in('category', filters.categories);
      }

      // Apply organic filter
      if (filters.organicOnly) {
        query = query.eq('is_organic', true);
      }

      // Apply search
      if (searchQuery.trim()) {
        query = query.or(`name.ilike.%${searchQuery.trim()}%,description.ilike.%${searchQuery.trim()}%`);
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'name':
          query = query.order('name', { ascending: true });
          break;
        case 'calories':
          // Sort by calories in nutrition JSON - we'll do this client-side
          query = query.order('created_at', { ascending: false });
          break;
        case 'protein':
          // Sort by protein in nutrition JSON - we'll do this client-side
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      // Transform data to match NutritionProduct interface
      let transformedProducts: NutritionProduct[] = (data || []).map((product) => {
        const nutrition = product.nutrition as any || {};
        return {
          _id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          category: product.category,
          season: product.season || 'All Season',
          image: product.image || 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=400&q=80',
          stock: product.stock,
          unit: product.unit,
          rating: product.rating || 0,
          reviews: product.reviews_count || 0,
          freshness: product.freshness || 'Fresh',
          isOrganic: product.is_organic,
          isSeasonal: product.is_seasonal,
          isTrending: product.is_trending,
          nutrition: {
            calories: nutrition.calories || 0,
            protein: nutrition.protein || 0,
            carbohydrates: nutrition.carbohydrates || 0,
            fiber: nutrition.fiber || 0,
            fat: nutrition.fat || 0,
            vitamins: nutrition.vitamins || [],
            minerals: nutrition.minerals || [],
          },
          healthBenefits: product.health_benefits || [],
          tags: product.tags || [],
        };
      });

      // Apply client-side filtering for nutrition values
      if (filters.maxCalories < 500) {
        transformedProducts = transformedProducts.filter(
          p => p.nutrition.calories <= filters.maxCalories
        );
      }
      if (filters.minProtein > 0) {
        transformedProducts = transformedProducts.filter(
          p => p.nutrition.protein >= filters.minProtein
        );
      }

      // Apply tag filtering
      if (filters.tags.length > 0) {
        transformedProducts = transformedProducts.filter(p =>
          filters.tags.some(tag => p.tags?.includes(tag))
        );
      }

      // Client-side sorting for nutrition values
      if (sortBy === 'calories') {
        transformedProducts.sort((a, b) => a.nutrition.calories - b.nutrition.calories);
      } else if (sortBy === 'protein') {
        transformedProducts.sort((a, b) => b.nutrition.protein - a.nutrition.protein);
      }

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        setSearchParams({ search: searchQuery.trim() });
      } else {
        setSearchParams({});
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, setSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleFilterChange = (newFilters: FilterState) => {
    console.log('Filter changed:', newFilters);
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
    setSortBy('newest');
    setSearchParams({});
  };

  // Loading skeleton
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Fresh Products</h1>
            <p className="text-muted-foreground text-lg">Loading products...</p>
          </div>
          <div className="flex gap-8">
            <div className="hidden lg:block w-72">
              <div className="bg-card rounded-xl h-[600px] animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card rounded-xl h-[420px] animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Fresh Products</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Farm-fresh produce with complete nutrition information
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, vitamins, minerals, or health benefits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-base rounded-full"
                />
              </div>
            </form>
            {searchQuery && (
              <div className="mt-3 text-sm text-muted-foreground">
                Searching for: <span className="font-semibold text-foreground">"{searchQuery}"</span>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchParams({});
                  }}
                  className="ml-2 text-primary hover:underline"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Sidebar Filter (Desktop) */}
          <ProductFilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            productCount={products.length}
          />

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-card rounded-xl border">
              {/* Mobile Filter Button */}
              <ProductFilterSheet
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                productCount={products.length}
              />

              {/* Sort & View Options */}
              <div className="flex items-center gap-4 ml-auto">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden sm:block" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="calories">Lowest Calories</SelectItem>
                      <SelectItem value="protein">Highest Protein</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    className="h-9 w-9 rounded-r-none"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    className="h-9 w-9 rounded-l-none"
                    onClick={() => setViewMode('list')}
                  >
                    <LayoutList className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Results Count (Desktop) */}
              <div className="hidden lg:block w-full text-sm text-muted-foreground border-t pt-3 mt-2">
                Showing <span className="font-semibold text-foreground">{products.length}</span> products
                {(filters.categories.length > 0 || filters.tags.length > 0 || filters.organicOnly || searchQuery) && (
                  <span> with active filters</span>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'flex flex-col gap-4'
              }>
                {products.map((product) => (
                  <NutritionProductCard
                    key={product._id}
                    product={product}
                    showNutrition={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card rounded-xl border">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={handleResetFilters} variant="outline">
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
