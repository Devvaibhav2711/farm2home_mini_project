import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/hooks/useAuth';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const total = getTotalPrice();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Start adding fresh products to your cart!
          </p>
          <NavLink to="/products">
            <Button size="lg" className="btn-hero">
              Browse Products
            </Button>
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-card rounded-xl shadow-card p-6">
                <div className="flex gap-6">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                        <p className="text-muted-foreground text-sm">{item.unit}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                        <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">${item.price} each</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl shadow-card p-6 sticky top-20">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span className="text-primary font-semibold">FREE</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <NavLink to={user ? '/checkout' : '/auth'}>
                <Button className="w-full btn-hero mb-4" size="lg">
                  {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                </Button>
              </NavLink>

              <Button onClick={clearCart} variant="outline" className="w-full">
                Clear Cart
              </Button>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  🚚 Free delivery on all orders
                  <br />
                  ✓ 100% Fresh guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
