import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Smartphone, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Order {
    id: string;
    total_amount: number;
    payment_method: string;
    payment_status: string;
    status: string;
    shipping_name: string;
    shipping_email: string;
    shipping_phone: string;
}

const Payment = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paymentCompleted, setPaymentCompleted] = useState(false);

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (orderError || !orderData) {
                toast.error('Order not found');
                navigate('/');
                return;
            }

            setOrder(orderData);

            // Fetch order items
            const { data: itemsData } = await supabase
                .from('order_items')
                .select('*')
                .eq('order_id', orderId);

            setOrderItems(itemsData || []);

            // Check if payment already completed
            if (orderData.payment_status === 'completed') {
                setPaymentCompleted(true);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            toast.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        setProcessing(true);

        // Simulate payment processing
        setTimeout(async () => {
            try {
                // In production, integrate with actual payment gateway
                const transactionId = `TXN${Date.now()}`;

                const { error } = await supabase
                    .from('orders')
                    .update({
                        payment_status: 'completed',
                        payment_id: transactionId,
                        status: 'confirmed'
                    })
                    .eq('id', order?.id);

                if (error) {
                    toast.error('Payment failed. Please try again.');
                    return;
                }

                setPaymentCompleted(true);
                toast.success('Payment successful!');
            } catch (error) {
                console.error('Payment error:', error);
                toast.error('Payment failed. Please try again.');
            } finally {
                setProcessing(false);
            }
        }, 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading payment details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                        <CardTitle className="text-center">Order Not Found</CardTitle>
                        <CardDescription className="text-center">
                            The order you're looking for doesn't exist or has been removed.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate('/')} className="w-full">
                            Go to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (paymentCompleted) {
        return (
            <div className="min-h-screen py-20">
                <div className="container mx-auto px-4 text-center max-w-md">
                    <Card>
                        <CardHeader>
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                            <CardTitle>Payment Successful!</CardTitle>
                            <CardDescription>
                                Your payment of ₹{order.total_amount.toFixed(2)} has been processed successfully.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg text-left">
                                <p className="text-sm text-muted-foreground mb-2">Order Details</p>
                                <p className="font-semibold">Order ID: #{order.id.slice(0, 8).toUpperCase()}</p>
                                <p className="text-sm">Status: {order.status}</p>
                                <p className="text-sm">Payment: {order.payment_status}</p>
                            </div>
                            <div className="space-y-2">
                                <Button onClick={() => navigate('/orders')} className="w-full">
                                    View My Orders
                                </Button>
                                <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                                    Continue Shopping
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const isPhonePe = order.payment_method === 'phonepe';
    const isGooglePay = order.payment_method === 'googlepay';

    return (
        <div className="min-h-screen py-20 bg-muted/30">
            <div className="container mx-auto px-4 max-w-md">
                <Card>
                    <CardHeader className="text-center">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isPhonePe ? 'bg-purple-100 dark:bg-purple-900/20' : 'bg-blue-100 dark:bg-blue-900/20'
                            }`}>
                            {isPhonePe ? (
                                <Smartphone className="h-10 w-10 text-purple-600" />
                            ) : (
                                <CreditCard className="h-10 w-10 text-blue-600" />
                            )}
                        </div>
                        <CardTitle>
                            {isPhonePe ? 'PhonePe Payment' : 'Google Pay Payment'}
                        </CardTitle>
                        <CardDescription>
                            Complete your payment to confirm the order
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-muted p-4 rounded-lg space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Order ID</span>
                                <span className="font-mono">#{order.id.slice(0, 8).toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Items</span>
                                <span>{orderItems.length} item(s)</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Customer</span>
                                <span>{order.shipping_name}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                <span>Total Amount</span>
                                <span className="text-primary">₹{order.total_amount.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Payment Instructions */}
                        <div className={`p-4 rounded-lg border-2 ${isPhonePe
                                ? 'border-purple-200 bg-purple-50 dark:bg-purple-900/10'
                                : 'border-blue-200 bg-blue-50 dark:bg-blue-900/10'
                            }`}>
                            <p className="text-sm font-semibold mb-2">
                                {isPhonePe ? 'PhonePe Payment' : 'Google Pay Payment'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Click the button below to complete your payment securely via {isPhonePe ? 'PhonePe' : 'Google Pay'} UPI.
                            </p>
                        </div>

                        {/* Payment Button */}
                        <Button
                            onClick={handlePayment}
                            disabled={processing}
                            className={`w-full ${isPhonePe
                                    ? 'bg-purple-600 hover:bg-purple-700'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            size="lg"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing Payment...
                                </>
                            ) : (
                                <>
                                    Pay ₹{order.total_amount.toFixed(2)} via {isPhonePe ? 'PhonePe' : 'Google Pay'}
                                </>
                            )}
                        </Button>

                        {/* Cancel Button */}
                        <Button
                            onClick={() => navigate('/')}
                            variant="outline"
                            className="w-full"
                            disabled={processing}
                        >
                            Cancel
                        </Button>

                        {/* Security Note */}
                        <p className="text-xs text-center text-muted-foreground">
                            Your payment is secured with end-to-end encryption
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Payment;
