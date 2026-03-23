import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NavLink } from '@/components/NavLink';
import { Truck, Leaf, Heart, ShieldCheck, Search } from 'lucide-react';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const features = [
    { icon: <Leaf className="h-8 w-8" />, title: 'Farm Fresh', description: 'Sourced directly from local farmers daily' },
    { icon: <Truck className="h-8 w-8" />, title: 'Fast Delivery', description: 'Same-day delivery to your doorstep' },
    { icon: <ShieldCheck className="h-8 w-8" />, title: 'Quality Checked', description: 'Every product inspected for freshness' },
    { icon: <Heart className="h-8 w-8" />, title: 'Support Farmers', description: 'Fair prices that help local communities' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          🌾 Fresh From Farms to Your Home
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Quality vegetables, fruits, and dairy delivered daily. Supporting local farmers, serving fresh to you.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for fresh vegetables, fruits, dairy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-32 py-6 text-lg rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/70 focus:bg-white/20 focus:border-white/40"
              />
              <Button
                type="submit"
                size="lg"
                variant="secondary"
                className="absolute right-2 rounded-full px-8"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <NavLink to="/products">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Shop Now
            </Button>
          </NavLink>
          <NavLink to="/about">
            <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white/30">
              Learn More
            </Button>
          </NavLink>
        </div>
      </section>
      {/* Categories Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Shop by Category</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <NavLink to="/products/vegetables">
              <div className="bg-white p-8 rounded-lg text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-5xl mb-4">🥬</div>
                <h3 className="text-2xl font-bold mb-2">Fresh Vegetables</h3>
                <p className="text-gray-600">Organic vegetables straight from local farms</p>
              </div>
            </NavLink>

            <NavLink to="/products/fruits">
              <div className="bg-white p-8 rounded-lg text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-5xl mb-4">🍎</div>
                <h3 className="text-2xl font-bold mb-2">Juicy Fruits</h3>
                <p className="text-gray-600">Seasonal fruits picked at peak ripeness</p>
              </div>
            </NavLink>

            <NavLink to="/products/dairy">
              <div className="bg-white p-8 rounded-lg text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-5xl mb-4">🥛</div>
                <h3 className="text-2xl font-bold mb-2">Dairy & Grains</h3>
                <p className="text-gray-600">Fresh milk, eggs, and organic grains</p>
              </div>
            </NavLink>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose FreshFarm?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-green-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to Experience Farm-Fresh Goodness?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of happy customers enjoying fresh produce daily
          </p>
          <NavLink to="/products">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Shopping
            </Button>
          </NavLink>
        </div>
      </section>
    </div>
  );
};

export default Home;
