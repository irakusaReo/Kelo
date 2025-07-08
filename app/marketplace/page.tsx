'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentWidget } from '@/components/payment/payment-widget';
import { QuickViewModal } from '@/components/marketplace/quick-view-modal';
import { useCart } from '@/lib/hooks/use-cart';
import { 
  Search, 
  Filter, 
  Star, 
  Heart, 
  ShoppingCart,
  Zap,
  TrendingUp,
  Smartphone,
  Laptop,
  Home,
  Car,
  Shirt,
  Eye
} from 'lucide-react';

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addItem } = useCart();

  const categories = [
    { id: 'all', name: 'All Categories', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'electronics', name: 'Electronics', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'computers', name: 'Computers', icon: <Laptop className="w-4 h-4" /> },
    { id: 'home', name: 'Home & Garden', icon: <Home className="w-4 h-4" /> },
    { id: 'automotive', name: 'Automotive', icon: <Car className="w-4 h-4" /> },
    { id: 'fashion', name: 'Fashion', icon: <Shirt className="w-4 h-4" /> },
  ];

  const products = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      price: 180000,
      originalPrice: 200000,
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
      merchant: 'TechHub Kenya',
      rating: 4.8,
      reviews: 124,
      category: 'electronics',
      isPopular: true,
      discount: 10,
      description: 'Experience premium audio quality with the latest iPhone 15 Pro Max. Featuring advanced camera systems, powerful A17 Pro chip, and all-day battery life.',
      features: ['A17 Pro chip', '48MP camera system', 'Titanium design', 'USB-C connectivity', 'Action Button'],
    },
    {
      id: '2',
      name: 'MacBook Air M2',
      price: 150000,
      originalPrice: 165000,
      image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
      merchant: 'Apple Store Kenya',
      rating: 4.9,
      reviews: 89,
      category: 'computers',
      isPopular: true,
      discount: 9,
      description: 'The incredibly thin and light MacBook Air now features the powerful M2 chip, delivering exceptional performance and up to 18 hours of battery life.',
      features: ['M2 chip', '13.6-inch Liquid Retina display', 'Up to 18 hours battery', '1080p FaceTime HD camera', 'MagSafe charging'],
    },
    {
      id: '3',
      name: 'Samsung 65" QLED TV',
      price: 120000,
      originalPrice: 140000,
      image: 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=400',
      merchant: 'Electronics Plus',
      rating: 4.7,
      reviews: 67,
      category: 'electronics',
      isPopular: false,
      discount: 14,
      description: 'Immerse yourself in stunning 4K QLED picture quality with vibrant colors and deep contrast. Smart TV features with built-in streaming apps.',
      features: ['4K QLED display', 'Quantum HDR', 'Smart TV platform', 'Voice control', 'Multiple HDMI ports'],
    },
    {
      id: '4',
      name: 'Nike Air Max 270',
      price: 15000,
      originalPrice: 18000,
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
      merchant: 'SportZone',
      rating: 4.6,
      reviews: 203,
      category: 'fashion',
      isPopular: true,
      discount: 17,
      description: 'Step into comfort and style with the iconic Nike Air Max 270. Features visible Air cushioning and breathable mesh upper.',
      features: ['Air Max cushioning', 'Breathable mesh upper', 'Durable rubber outsole', 'Iconic design', 'All-day comfort'],
    },
    {
      id: '5',
      name: 'Sony WH-1000XM5',
      price: 35000,
      originalPrice: 40000,
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      merchant: 'Audio World',
      rating: 4.8,
      reviews: 156,
      category: 'electronics',
      isPopular: false,
      discount: 13,
      description: 'Industry-leading noise cancellation meets exceptional sound quality. Perfect for travel, work, and everyday listening.',
      features: ['Industry-leading noise cancellation', '30-hour battery life', 'Quick charge', 'Touch controls', 'Voice assistant'],
    },
    {
      id: '6',
      name: 'Gaming Chair Pro',
      price: 25000,
      originalPrice: 30000,
      image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=400',
      merchant: 'Office Furniture Co',
      rating: 4.5,
      reviews: 78,
      category: 'home',
      isPopular: false,
      discount: 17,
      description: 'Ergonomic gaming chair designed for long gaming sessions. Features adjustable height, lumbar support, and premium materials.',
      features: ['Ergonomic design', 'Adjustable height', 'Lumbar support', 'Premium materials', '360-degree swivel'],
    },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
      default:
        return b.isPopular ? 1 : -1;
    }
  });

  const handleQuickView = (product: any) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleAddToCart = (product: any) => {
    addItem(product);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kelo Marketplace</h1>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Zap className="w-3 h-3 mr-1" />
              Instant Approval
            </Badge>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products, brands, or merchants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center space-x-2">
                      {category.icon}
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {sortedProducts.length} Products Found
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span>Trending in Kenya</span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Quick View Button */}
                <Button
                  onClick={() => handleQuickView(product)}
                  className="absolute inset-0 w-full h-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 rounded-none"
                  variant="ghost"
                >
                  <Eye className="w-5 h-5" />
                  Quick View
                </Button>
                
                {/* Badges */}
                {product.discount > 0 && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                    -{product.discount}%
                  </Badge>
                )}
                {product.isPopular && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
                
                {/* Favorite Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute bottom-2 right-2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full w-8 h-8 p-0"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{product.merchant}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews})</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Pricing */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        KES {product.price.toLocaleString()}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          KES {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-green-600 font-medium">
                      Or pay KES {Math.round(product.price / 4).toLocaleString()} × 4 payments
                    </p>
                  </div>

                  {/* Payment Widget */}
                  <PaymentWidget
                    amount={product.price}
                    merchantName={product.merchant}
                    productName={product.name}
                    onPaymentComplete={(data) => {
                      console.log('Payment completed for product:', product.id, data);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setQuickViewProduct(null);
        }}
        onAddToCart={handleAddToCart}
      />
      </div>
    </MainLayout>
  );
}