import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Package, Clock, CheckCircle, Truck, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/NavLink';
import { supabase } from '@/integrations/supabase/client';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip_code: string;
  created_at: string;
  items: OrderItem[];
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  pending: {
    icon: <Clock className="h-5 w-5" />,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    label: 'Pending'
  },
  confirmed: {
    icon: <CheckCircle className="h-5 w-5" />,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    label: 'Confirmed'
  },
  processing: {
    icon: <Package className="h-5 w-5" />,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    label: 'Processing'
  },
  shipped: {
    icon: <Truck className="h-5 w-5" />,
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
    label: 'Shipped'
  },
  delivered: {
    icon: <CheckCircle className="h-5 w-5" />,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    label: 'Delivered'
  },
  cancelled: {
    icon: <XCircle className="h-5 w-5" />,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    label: 'Cancelled'
  }
};

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
      // Set up real-time subscription
      const subscription = supabase
        .channel('orders_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        }, () => {
          fetchOrders();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        return;
      }

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: itemsData } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);

          return {
            ...order,
            items: (itemsData || []).map(item => ({
              productId: item.product_id || '',
              productName: item.product_name,
              quantity: item.quantity,
              price: item.product_price
            }))
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status: string) => {
    return statusConfig[status] || statusConfig.pending;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <Package className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">Track and view your order history</p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-card rounded-xl shadow-card p-12 text-center">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't placed any orders. Start shopping to see your orders here!
              </p>
              <NavLink to="/products">
                <Button className="btn-hero">Browse Products</Button>
              </NavLink>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const isExpanded = expandedOrder === order.id;

                return (
                  <div key={order.id} className="bg-card rounded-xl shadow-card overflow-hidden">
                    {/* Order Header */}
                    <div
                      className="p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm text-muted-foreground">
                              #{order.order_number || order.id.slice(0, 8).toUpperCase()}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                              {statusInfo.icon}
                              {statusInfo.label}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">₹{order.total_amount.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Details (Expanded) */}
                    {isExpanded && (
                      <div className="border-t border-border px-6 py-4 bg-muted/20">
                        {/* Items */}
                        <div className="mb-6">
                          <h3 className="font-semibold mb-3">Items</h3>
                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center gap-4 p-3 bg-background rounded-lg">
                                <div className="flex-1">
                                  <p className="font-medium">{item.productName}</p>
                                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delivery Info */}
                        {order.shipping_address && (
                          <div className="mb-4">
                            <h3 className="font-semibold mb-2">Delivery Address</h3>
                            <p className="text-muted-foreground">
                              {order.shipping_address}, {order.shipping_city}, {order.shipping_state} {order.shipping_zip_code}
                            </p>
                          </div>
                        )}

                        {/* Payment Info */}
                        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                          <div>
                            <span className="text-sm text-muted-foreground">Payment: </span>
                            <span className="font-medium capitalize">{order.payment_method || 'Not specified'}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.payment_status === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                            }`}>
                            {order.payment_status === 'completed' ? 'Paid' : 'Pending Payment'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
