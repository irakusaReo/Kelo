'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PaymentWidget } from '@/components/payment/payment-widget';
import { 
  X, 
  Star, 
  Heart, 
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  merchant: string;
  rating: number;
  reviews: number;
  category: string;
  isPopular: boolean;
  discount?: number;
  description?: string;
  features?: string[];
  specifications?: Record<string, string>;
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

export function QuickViewModal({ product, isOpen, onClose, onAddToCart }: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) return null;

  // Mock additional images for demo
  const productImages = [
    product.image,
    product.image, // In real app, these would be different angles
    product.image,
  ];

  const productDescription = product.description || `Experience premium quality with the ${product.name}. This exceptional product from ${product.merchant} combines cutting-edge technology with elegant design. Perfect for those who demand the best in both performance and style. Features include advanced functionality, durable construction, and user-friendly operation that makes it ideal for daily use.`;

  const productFeatures = product.features || [
    'Premium quality materials',
    'Advanced technology integration',
    'User-friendly design',
    'Durable construction',
    'Excellent customer support',
    'Warranty included'
  ];

  const productSpecs = product.specifications || {
    'Brand': product.merchant,
    'Category': product.category,
    'Availability': 'In Stock',
    'Shipping': 'Free shipping available',
    'Return Policy': '30-day returns',
    'Warranty': '1 year manufacturer warranty'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white shadow-md rounded-full w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Images Section */}
            <div className="relative bg-gray-50 dark:bg-gray-900 p-6 lg:p-8">
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.discount && product.discount > 0 && (
                  <Badge className="bg-red-500 text-white">
                    -{product.discount}%
                  </Badge>
                )}
                {product.isPopular && (
                  <Badge className="bg-yellow-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>

              {/* Main Image */}
              <div className="aspect-square mb-4 bg-white rounded-lg overflow-hidden shadow-sm">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image Thumbnails */}
              <div className="flex gap-2 justify-center">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index 
                        ? 'border-blue-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="p-6 lg:p-8 flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="rounded-full w-10 h-10 p-0"
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full w-10 h-10 p-0"
                    >
                      <Share2 className="w-5 h-5 text-gray-400" />
                    </Button>
                  </div>
                </div>

                <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">{product.merchant}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      KES {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-lg text-gray-500 line-through">
                        KES {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-green-600 font-medium">
                    Or pay KES {Math.round(product.price / 4).toLocaleString()} × 4 payments with Kelo
                  </p>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto space-y-6 mb-6">
                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Description</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {productDescription}
                  </p>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {productFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specifications */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Specifications</h3>
                  <div className="space-y-2">
                    {Object.entries(productSpecs).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{key}:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="text-center">
                    <Truck className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Free Shipping</p>
                  </div>
                  <div className="text-center">
                    <RotateCcw className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">30-Day Returns</p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Warranty</p>
                  </div>
                </div>
              </div>

              {/* Sticky Action Buttons */}
              <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                <PaymentWidget
                  amount={product.price}
                  merchantName={product.merchant}
                  productName={product.name}
                  onPaymentComplete={(data) => {
                    console.log('Payment completed for product:', product.id, data);
                    onClose();
                  }}
                />
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    onAddToCart?.(product);
                    onClose();
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}