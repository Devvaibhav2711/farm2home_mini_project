import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, Package, Shield, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from '@/components/ImageUpload';
import { supabase } from '@/integrations/supabase/client';
import type { ProductCategory, OrderStatus } from '@/integrations/supabase/types';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  stock: number;
  season?: string;
  freshness?: string;
  isOrganic?: boolean;
  isSeasonal?: boolean;
  isTrending?: boolean;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  city?: string;
  state?: string;
  createdAt: string;
}

interface Order {
  _id: string;
  orderNumber?: string;
  userId: string;
  items: any[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

const defaultProductForm = {
  name: '',
  price: '',
  image: '',
  category: 'Vegetables',
  description: '',
  stock: '100',
  season: 'All Season',
  freshness: 'Fresh',
  isOrganic: false,
  isSeasonal: false,
  isTrending: false
};

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('products');

  // Product form state
  const [productForm, setProductForm] = useState(defaultProductForm);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast.error('Admin access required');
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
      // Real-time updates every 5 seconds
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      // Fetch products from Supabase
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsData) {
        setProducts(productsData.map(p => ({
          _id: p.id,
          name: p.name,
          price: p.price,
          image: p.image || '',
          category: p.category,
          description: p.description || '',
          stock: p.stock,
          season: p.season || undefined,
          freshness: p.freshness || undefined,
          isOrganic: p.is_organic,
          isSeasonal: p.is_seasonal,
          isTrending: p.is_trending,
          createdAt: p.created_at
        })));
      }

      // Fetch users/profiles from Supabase
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersData) {
        setUsers(usersData.map(u => ({
          _id: u.id,
          name: u.full_name,
          email: u.email,
          phone: u.phone || undefined,
          role: u.role,
          city: u.city || undefined,
          state: u.state || undefined,
          createdAt: u.created_at
        })));
      }

      // Fetch orders from Supabase
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (ordersData) {
        setOrders(ordersData.map(o => ({
          _id: o.id,
          orderNumber: o.order_number,
          userId: o.user_id,
          items: (o.order_items || []).map((item: any) => ({
            productId: item.product_id,
            productName: item.product_name,
            quantity: item.quantity,
            price: item.product_price
          })),
          totalAmount: o.total_amount,
          status: o.status,
          createdAt: o.created_at
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productForm.name || !productForm.price) {
      toast.error('Please fill in Product Name and Price');
      return;
    }

    try {
      const slug = productForm.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();

      const { error } = await supabase
        .from('products')
        .insert({
          name: productForm.name,
          slug: slug,
          price: parseFloat(productForm.price),
          image: productForm.image || 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=400&q=80',
          category: productForm.category as ProductCategory,
          description: productForm.description,
          stock: parseInt(productForm.stock) || 100,
          unit: 'kg',
          season: productForm.season,
          freshness: productForm.freshness,
          is_organic: productForm.isOrganic,
          is_seasonal: productForm.isSeasonal,
          is_trending: productForm.isTrending,
          is_active: true
        });

      if (error) throw error;

      toast.success('Product added successfully!');
      setProductForm(defaultProductForm);
      fetchData();
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast.error(error.message || 'Error adding product');
    }
  };

  const handleEditProduct = (product: Product) => {
    setIsEditMode(true);
    setEditingProductId(product._id);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      description: product.description,
      stock: product.stock.toString(),
      season: product.season || 'All Season',
      freshness: product.freshness || 'Fresh',
      isOrganic: product.isOrganic || false,
      isSeasonal: product.isSeasonal || false,
      isTrending: product.isTrending || false
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingProductId) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: productForm.name,
          price: parseFloat(productForm.price),
          image: productForm.image,
          category: productForm.category as ProductCategory,
          description: productForm.description,
          stock: parseInt(productForm.stock) || 100,
          season: productForm.season,
          freshness: productForm.freshness,
          is_organic: productForm.isOrganic,
          is_seasonal: productForm.isSeasonal,
          is_trending: productForm.isTrending
        })
        .eq('id', editingProductId);

      if (error) throw error;

      toast.success('Product updated successfully!');
      setIsEditDialogOpen(false);
      setIsEditMode(false);
      setEditingProductId(null);
      setProductForm(defaultProductForm);
      fetchData();
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Error updating product');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success(`"${name}" deleted successfully`);
      fetchData();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Error deleting product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus as OrderStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast.success(`Order status updated to ${newStatus}`);
      fetchData();
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast.error(error.message || 'Error updating order');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Vegetables', 'Fruits', 'Dairy', 'Grains', 'Organic'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-3">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>Manage Farm2Home - Powered by Supabase</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Logged in as</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardDescription>Total Products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{products.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardDescription>Total Users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardDescription>Total Orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardDescription>Total Revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{orders.reduce((sum, o) => sum + o.totalAmount, 0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-card">
            <TabsTrigger value="products" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Package className="h-4 w-4 mr-2" /> Products ({products.length})
            </TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6 mt-6">
            {/* Add Product Form */}
            <Card className="border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Plus className="h-5 w-5" /> Add New Product
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>Product Name *</Label>
                      <Input
                        placeholder="e.g., Fresh Tomatoes"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Price (₹) *</Label>
                      <Input
                        placeholder="e.g., 50"
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Stock</Label>
                      <Input
                        placeholder="100"
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Category</Label>
                      <Select value={productForm.category} onValueChange={(v) => setProductForm({ ...productForm, category: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Product Image *</Label>
                    <ImageUpload
                      value={productForm.image}
                      onChange={(url) => setProductForm({ ...productForm, image: url })}
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe the product..."
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="organic"
                        checked={productForm.isOrganic}
                        onCheckedChange={(checked) => setProductForm({ ...productForm, isOrganic: checked as boolean })}
                      />
                      <label htmlFor="organic" className="text-sm font-medium cursor-pointer">
                        Organic
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="seasonal"
                        checked={productForm.isSeasonal}
                        onCheckedChange={(checked) => setProductForm({ ...productForm, isSeasonal: checked as boolean })}
                      />
                      <label htmlFor="seasonal" className="text-sm font-medium cursor-pointer">
                        Seasonal
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="trending"
                        checked={productForm.isTrending}
                        onCheckedChange={(checked) => setProductForm({ ...productForm, isTrending: checked as boolean })}
                      />
                      <label htmlFor="trending" className="text-sm font-medium cursor-pointer">
                        Trending
                      </label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" /> Add Product
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Products List */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle>All Products ({filteredProducts.length})</CardTitle>
                  <div className="flex gap-3">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No products found</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <div key={product._id} className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover"
                          onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{product.name}</p>
                            {product.isOrganic && <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Organic</span>}
                            {product.isTrending && <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full">Trending</span>}
                            {product.isSeasonal && <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">Seasonal</span>}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {product.category} | Rs.{product.price} | Stock: {product.stock}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteProduct(product._id, product.name)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No orders found</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {orders.map((order) => (
                      <div key={order._id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-sm">
                              {order.orderNumber || `Order #${order._id.slice(0, 8)}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()} | Rs.{order.totalAmount}
                            </p>
                          </div>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleUpdateOrderStatus(order._id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Users & Roles</CardTitle>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No users found</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {users.map((u) => (
                      <div key={u._id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-semibold text-sm">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                          {u.city && <p className="text-xs text-muted-foreground">{u.city}, {u.state}</p>}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900' :
                          u.role === 'farmer' ? 'bg-green-100 text-green-800 dark:bg-green-900' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900'
                          }`}>
                          {u.role}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Update product details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Product Name *</Label>
                  <Input
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Price (₹) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={productForm.category} onValueChange={(v) => setProductForm({ ...productForm, category: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Product Image *</Label>
                <ImageUpload
                  value={productForm.image}
                  onChange={(url) => setProductForm({ ...productForm, image: url })}
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-organic"
                    checked={productForm.isOrganic}
                    onCheckedChange={(checked) => setProductForm({ ...productForm, isOrganic: checked as boolean })}
                  />
                  <label htmlFor="edit-organic" className="text-sm font-medium cursor-pointer">
                    Organic
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-seasonal"
                    checked={productForm.isSeasonal}
                    onCheckedChange={(checked) => setProductForm({ ...productForm, isSeasonal: checked as boolean })}
                  />
                  <label htmlFor="edit-seasonal" className="text-sm font-medium cursor-pointer">
                    Seasonal
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-trending"
                    checked={productForm.isTrending}
                    onCheckedChange={(checked) => setProductForm({ ...productForm, isTrending: checked as boolean })}
                  />
                  <label htmlFor="edit-trending" className="text-sm font-medium cursor-pointer">
                    Trending
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setIsEditMode(false);
                    setEditingProductId(null);
                    setProductForm(defaultProductForm);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  Update Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;
