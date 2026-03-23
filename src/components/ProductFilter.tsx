import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Filter, X, Leaf, Zap, Heart, Apple, Wheat } from 'lucide-react';

export interface FilterState {
  categories: string[];
  tags: string[];
  maxCalories: number;
  minProtein: number;
  organicOnly: boolean;
}

interface ProductFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  productCount: number;
}

const CATEGORIES = [
  { id: 'Vegetables', label: 'Vegetables', icon: Leaf, color: 'text-green-600' },
  { id: 'Fruits', label: 'Fruits', icon: Apple, color: 'text-red-500' },
  { id: 'Dairy', label: 'Dairy Products', icon: Heart, color: 'text-blue-500' },
  { id: 'Grains', label: 'Grains & Pulses', icon: Wheat, color: 'text-amber-600' },
  { id: 'Organic', label: 'Organic Items', icon: Zap, color: 'text-emerald-600' },
];

const SMART_FILTERS = [
  { id: 'high-vitamin-c', label: 'High in Vitamin C', description: 'Boost immunity' },
  { id: 'rich-in-iron', label: 'Rich in Iron', description: 'Energy & blood health' },
  { id: 'high-protein', label: 'High Protein', description: 'Muscle building' },
  { id: 'low-calorie', label: 'Low Calories', description: 'Weight management' },
  { id: 'high-fiber', label: 'High Fiber', description: 'Digestive health' },
  { id: 'heart-healthy', label: 'Heart Healthy', description: 'Cardiovascular support' },
  { id: 'immunity-boost', label: 'Immunity Boost', description: 'Natural defense' },
];

const FilterContent = ({ filters, onFilterChange, onReset, productCount }: ProductFilterProps) => {
  const handleCategoryToggle = (categoryId: string) => {
    console.log('Category toggle:', categoryId, 'Current:', filters.categories); // Debug
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(c => c !== categoryId)
      : [...filters.categories, categoryId];
    console.log('New categories:', newCategories); // Debug
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleTagToggle = (tagId: string) => {
    console.log('Tag toggle:', tagId, 'Current:', filters.tags); // Debug
    const newTags = filters.tags.includes(tagId)
      ? filters.tags.filter(t => t !== tagId)
      : [...filters.tags, tagId];
    console.log('New tags:', newTags); // Debug
    onFilterChange({ ...filters, tags: newTags });
  };

  const activeFiltersCount = 
    filters.categories.length + 
    filters.tags.length + 
    (filters.organicOnly ? 1 : 0) +
    (filters.maxCalories < 500 ? 1 : 0) +
    (filters.minProtein > 0 ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b">
          <span className="text-sm text-muted-foreground">Active:</span>
          {filters.categories.map(cat => (
            <Badge 
              key={cat} 
              variant="secondary" 
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => handleCategoryToggle(cat)}
            >
              {cat} <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          {filters.tags.map(tag => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => handleTagToggle(tag)}
            >
              {SMART_FILTERS.find(f => f.id === tag)?.label} <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          {filters.organicOnly && (
            <Badge 
              variant="secondary" 
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => onFilterChange({ ...filters, organicOnly: false })}
            >
              Organic Only <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={onReset} className="text-xs">
            Clear All
          </Button>
        </div>
      )}

      <Accordion type="multiple" defaultValue={['categories', 'smartFilters']} className="w-full">
        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger className="text-base font-semibold">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {CATEGORIES.map(category => {
                const Icon = category.icon;
                return (
                  <div key={category.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={category.id}
                      checked={filters.categories.includes(category.id)}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                    />
                    <Label
                      htmlFor={category.id}
                      className="flex items-center gap-2 cursor-pointer text-sm font-normal"
                    >
                      <Icon className={`h-4 w-4 ${category.color}`} />
                      {category.label}
                    </Label>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Smart Filters */}
        <AccordionItem value="smartFilters">
          <AccordionTrigger className="text-base font-semibold">
            Health Benefits
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {SMART_FILTERS.map(filter => (
                <div key={filter.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={filter.id}
                    checked={filters.tags.includes(filter.id)}
                    onCheckedChange={() => handleTagToggle(filter.id)}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor={filter.id}
                    className="cursor-pointer"
                  >
                    <span className="text-sm font-medium">{filter.label}</span>
                    <p className="text-xs text-muted-foreground">{filter.description}</p>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Nutrition Filters */}
        <AccordionItem value="nutrition">
          <AccordionTrigger className="text-base font-semibold">
            Nutrition
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 pt-2">
              {/* Max Calories Slider */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-sm font-medium">Max Calories (per 100g)</Label>
                  <span className="text-sm text-muted-foreground">
                    {filters.maxCalories === 500 ? 'Any' : `≤${filters.maxCalories}`}
                  </span>
                </div>
                <Slider
                  value={[filters.maxCalories]}
                  onValueChange={([value]) => onFilterChange({ ...filters, maxCalories: value })}
                  max={500}
                  min={20}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Min Protein Slider */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-sm font-medium">Min Protein (g per 100g)</Label>
                  <span className="text-sm text-muted-foreground">
                    {filters.minProtein === 0 ? 'Any' : `≥${filters.minProtein}g`}
                  </span>
                </div>
                <Slider
                  value={[filters.minProtein]}
                  onValueChange={([value]) => onFilterChange({ ...filters, minProtein: value })}
                  max={30}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Organic Only Toggle */}
              <div className="flex items-center space-x-3 pt-2">
                <Checkbox
                  id="organicOnly"
                  checked={filters.organicOnly}
                  onCheckedChange={(checked) => 
                    onFilterChange({ ...filters, organicOnly: checked as boolean })
                  }
                />
                <Label htmlFor="organicOnly" className="flex items-center gap-2 cursor-pointer">
                  <Leaf className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Organic Products Only</span>
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Results Count */}
      <div className="pt-4 border-t">
        <p className="text-sm text-center text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{productCount}</span> products
        </p>
      </div>
    </div>
  );
};

// Desktop Sidebar Filter
export const ProductFilterSidebar = (props: ProductFilterProps) => {
  return (
    <div className="hidden lg:block w-72 flex-shrink-0">
      <div className="sticky top-24 bg-card rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </h2>
          {(props.filters.categories.length > 0 || props.filters.tags.length > 0 || props.filters.organicOnly) && (
            <Button variant="ghost" size="sm" onClick={props.onReset}>
              Reset
            </Button>
          )}
        </div>
        <FilterContent {...props} />
      </div>
    </div>
  );
};

// Mobile Sheet Filter
export const ProductFilterSheet = (props: ProductFilterProps) => {
  const [open, setOpen] = useState(false);
  
  const activeFiltersCount = 
    props.filters.categories.length + 
    props.filters.tags.length + 
    (props.filters.organicOnly ? 1 : 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden relative">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Products
          </SheetTitle>
          <SheetDescription>
            Find products that match your preferences
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <FilterContent {...props} />
        </div>
        <div className="mt-6">
          <Button className="w-full" onClick={() => setOpen(false)}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProductFilterSidebar;
