import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Star, ShoppingCart, Zap, Camera } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { addToCart } from "@/lib/cart";
import { trackProductClick } from "@/lib/preferences";
import ARPreviewModal from "@/components/ARPreviewModal";
import { products } from "@/data/products";

interface ProductCardProps {
  product: ListProductsResponseItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [, navigate] = useLocation();
  const [arOpen, setArOpen] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    navigate("/checkout");
  }

  function handleARClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setArOpen(true);
  }

  function handleCardClick() {
    trackProductClick(product.id);
  }

  return (
    <>
      <Link href={`/product/${product.id}`} onClick={handleCardClick}>
        <div className="group bg-white border border-violet-100 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 shadow-sm">
          <div className="relative overflow-hidden aspect-[4/5]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            {/* AR button - top right */}
            <button
              onClick={handleARClick}
              title="View in AR"
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-violet-100"
            >
              <Camera className="w-3.5 h-3.5 text-violet-600" />
            </button>
          </div>

          <div className="p-3">
            <p className="text-xs text-gray-400 capitalize mb-0.5 truncate">
              {product.category.split(",")[0].trim()}
            </p>
            <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 leading-snug mb-2">
              {product.name}
            </h3>
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-bold text-violet-700 text-sm">
                {formatPrice(product.price)}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-400">
                  {Number(product.rating || 4).toFixed(1)}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-1.5">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${added
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100"
                  }`}
              >
                <ShoppingCart className="w-3 h-3" />
                {added ? "Added!" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#7c3aed,#c026d3)" }}
              >
                <Zap className="w-3 h-3" />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </Link>

      <ARPreviewModal
        product={arOpen ? { id: product.id, name: product.name, image: product.image, price: product.price } : null}
        onClose={() => setArOpen(false)}
      />
    </>
  );
}
