import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Banknote, CheckCircle, ArrowLeft, Smartphone, CreditCard } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';

const checkoutSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string()
    .trim()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  phone: z.string()
    .trim()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[+]?[\d\s()-]+$/, 'Please enter a valid phone number'),
  address: z.string()
    .trim()
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address must be less than 500 characters'),
  city: z.string()
    .trim()
    .min(2, 'City is required'),
  state: z.string()
    .trim()
    .min(2, 'State is required'),
  zipCode: z.string()
    .trim()
    .min(5, 'ZIP code is required'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name || user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      zipCode: user?.zip_code || '',
    },
  });

  const total = getTotalPrice();

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    navigate('/auth', { state: { from: '/checkout' } });
    return null;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: CheckoutFormData) => {
    setLoading(true);

    try {
      // Create order in Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          subtotal: total,
          total_amount: total,
          status: 'pending',
          payment_method: paymentMethod as any,
          payment_status: 'pending',
          shipping_name: data.name,
          shipping_phone: data.phone,
          shipping_email: data.email,
          shipping_address: data.address,
          shipping_city: data.city,
          shipping_state: data.state,
          shipping_zip_code: data.zipCode,
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order error:', orderError);
        throw new Error('Failed to create order');
      }

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        product_price: item.price,
        product_unit: item.unit || 'piece',
        quantity: item.quantity,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items error:', itemsError);
        // Order was created, but items failed - still proceed
      }

      // Show success message based on payment method
      if (paymentMethod === 'phonepe' || paymentMethod === 'googlepay') {
        toast.success(`Order placed! Check your SMS/Email for payment link.`);
      } else {
        toast.success('Order placed successfully!');
      }

      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 text-center max-w-md">
          <div className="bg-card rounded-2xl shadow-hover p-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your order. We'll deliver your fresh produce soon!
            </p>
            {paymentMethod === 'cod' && (
              <p className="text-sm text-muted-foreground mb-8">
                Please keep cash ready for payment on delivery.
              </p>
            )}
            {paymentMethod === 'phonepe' && (
              <div className="mb-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm font-semibold mb-2">PhonePe Payment</p>
                <p className="text-sm text-muted-foreground">
                  You will receive a payment link via SMS/Email. Please complete the payment to confirm your order.
                </p>
              </div>
            )}
            {paymentMethod === 'googlepay' && (
              <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-semibold mb-2">Google Pay Payment</p>
                <p className="text-sm text-muted-foreground">
                  You will receive a payment link via SMS/Email. Please complete the payment to confirm your order.
                </p>
              </div>
            )}
            <div className="space-y-3">
              <NavLink to="/orders" className="block">
                <Button className="w-full" variant="outline">View My Orders</Button>
              </NavLink>
              <NavLink to="/">
                <Button className="w-full btn-hero">Continue Shopping</Button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <NavLink to="/cart" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Cart
        </NavLink>

        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Delivery Details */}
              <div className="bg-card rounded-xl shadow-card p-6">
                <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 98765 43210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Address *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="123 Main St, Apartment 4B" rows={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City *</FormLabel>
                          <FormControl>
                            <Input placeholder="Mumbai" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State *</FormLabel>
                          <FormControl>
                            <Input placeholder="Maharashtra" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="400001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-xl shadow-card p-6">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  {/* Cash on Delivery */}
                  <div className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`} onClick={() => setPaymentMethod('cod')}>
                    <RadioGroupItem value="cod" id="cod" />
                    <Banknote className="h-6 w-6 text-primary" />
                    <div className="flex-1">
                      <Label htmlFor="cod" className="font-semibold cursor-pointer">Cash on Delivery</Label>
                      <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                    </div>
                  </div>

                  {/* PhonePe */}
                  <div className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'phonepe' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-border hover:border-purple-500/50'
                    }`} onClick={() => setPaymentMethod('phonepe')}>
                    <RadioGroupItem value="phonepe" id="phonepe" />
                    <div className="h-6 w-6 bg-purple-600 rounded flex items-center justify-center">
                      <Smartphone className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="phonepe" className="font-semibold cursor-pointer">PhonePe</Label>
                      <p className="text-sm text-muted-foreground">Pay securely via PhonePe UPI</p>
                    </div>
                  </div>

                  {/* Google Pay */}
                  <div className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'googlepay' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-border hover:border-blue-500/50'
                    }`} onClick={() => setPaymentMethod('googlepay')}>
                    <RadioGroupItem value="googlepay" id="googlepay" />
                    <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="googlepay" className="font-semibold cursor-pointer">Google Pay</Label>
                      <p className="text-sm text-muted-foreground">Pay securely via Google Pay UPI</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full btn-hero" size="lg" disabled={loading}>
                {loading ? 'Processing...' : `Place Order · ₹${total.toFixed(2)}`}
              </Button>
            </form>
          </Form>

          {/* Order Summary */}
          <div>
            <div className="bg-card rounded-xl shadow-card p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-primary font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
