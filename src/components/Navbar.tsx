import { useState } from 'react';
import { NavLink } from '@/components/NavLink';
import { Menu, X, ShoppingCart, Leaf, User, Shield, LogOut, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getCartCount } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const cartCount = getCartCount();

  const navLinks = [
    { to: '/', label: 'Home' },
    // { to: '/products/vegetables', label: 'Vegetables' },
    // { to: '/products/fruits', label: 'Fruits' },
    // { to: '/products/dairy', label: 'Dairy' },
    // { to: '/products/grains', label: 'Grains' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary rounded-full p-2">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">FreshFarm</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="text-foreground hover:text-primary transition-colors font-medium text-sm"
                activeClassName="text-primary"
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <NavLink to="/cart">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </NavLink>

            {/* Auth / User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="font-medium">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <NavLink to="/profile" className="flex items-center gap-2 w-full">
                      <User className="h-4 w-4" /> My Profile
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/orders" className="flex items-center gap-2 w-full">
                      <Package className="h-4 w-4" /> My Orders
                    </NavLink>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <NavLink to="/admin" className="flex items-center gap-2 w-full">
                        <Shield className="h-4 w-4" /> Admin Panel
                      </NavLink>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <NavLink to="/auth">
                <Button variant="default" size="sm" className="btn-hero">
                  Sign In
                </Button>
              </NavLink>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
                  activeClassName="bg-primary/10 text-primary"
                >
                  {link.label}
                </NavLink>
              ))}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors font-medium flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" /> Admin Panel
                </NavLink>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
