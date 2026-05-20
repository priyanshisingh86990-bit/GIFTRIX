import { showAR } from "../ai/ar"
import {useEffect} from "react";
import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { products } from "@/data/products.ts";
import { ArrowLeft, Star, Tag, Calendar, Heart, ShoppingCart, Zap, Camera, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import ARPreviewModal from "@/components/ARPreviewModal";
import { formatPrice } from "@/lib/utils";
import { addToCart } from "@/lib/cart";
import { trackProductClick, trackCategory } from "@/lib/preferences";
import { Link } from "wouter";
import ProductChatbot from "@/components/ProductChatbot";


export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const id = params.id; // string hi use kar
  const [arOpen, setArOpen] = useState(false);
  const [added, setAdded] = useState(false);

  // ✅ FIX 1 (correct useState)
  const [product, setProduct] = useState(
  products.find(p => String(p.id) === String(id)) || null
);

  const [allProducts, setAllProducts] = useState<any[]>(products);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

useEffect(() => {
  setIsLoading(true);

  console.log("URL ID:", id);
  console.log("LOCAL PRODUCTS:", products);

  fetch(`${import.meta.env.VITE_API_URL || ""}/api/products`)
    .then((r) => r.json())
    .then((data) => {
      const apiProducts = Array.isArray(data) ? data : [];

      const finalProducts = apiProducts.length ? apiProducts : products;
      setAllProducts(finalProducts);

      let found = finalProducts.find(
        (p) => String(p.id) === String(id)
      );

      setProduct(found || null);
      setIsError(!found);
    })
    .catch(() => {
      const found = products.find(
        (p) => String(p.id) === String(id)
      );

      setProduct(found || null);
      setIsError(!found);
    })
    .finally(() => setIsLoading(false));
}, [id]);

  const similar = product
    ? allProducts
        .filter((p) => p.id !== product.id && p.category.split(",")[0].trim() === product.category.split(",")[0].trim())
        .slice(0, 4)
    : [];

  function handleAddToCart() {
    if (!product) return;
    addToCart({ productId: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    if (!product) return;
    addToCart({ productId: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
    navigate("/checkout");
  }

  if (isLoading) {
    // ✅ FIX 3 (null safe)
    const arMessage = product ? showAR(product.name) : null;
    console.log(arMessage)

    return (
      <div className="min-h-screen" style={{ background: "linear-gradient(180deg,#faf5ff 0%,#f5f3ff 50%,#fdf4ff 100%)" }}>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="aspect-[4/3] bg-violet-100 rounded-2xl" />
            <div className="h-8 bg-violet-100 rounded w-2/3" />
            <div className="h-6 bg-violet-100 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen" style={{ background: "linear-gradient(180deg,#faf5ff 0%,#f5f3ff 50%,#fdf4ff 100%)" }}>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-4xl mb-3">😕</p>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Product not found</h2>
          <button onClick={() => navigate("/explore")} className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pb-20 md" style={{ background: "linear-gradient(180deg,#faf5ff 0%,#f5f3ff 50%,#fdf4ff 100%)" }}>

    <div className="max-w-4xl mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-4">
        <Link href="/"><span className="hover:text-violet-600 cursor-pointer">Home</span></Link>
        <span>/</span>
        <Link href="/explore"><span className="hover:text-violet-600 cursor-pointer">Explore</span></Link>
        <span>/</span>
        <span className="text-gray-700 font-medium truncate">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Image */}
        <div className="relative">
          <div className="aspect-[4/5] bg-white border border-violet-100 rounded-2xl overflow-hidden shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* AR button overlay */}
          <button
            onClick={() => setArOpen(true)}
            className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur border border-violet-200 rounded-xl shadow-md text-sm font-semibold text-violet-700 hover:bg-violet-50 transition-colors"
          >
            <Camera className="w-4 h-4" />
            View in AR
          </button>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-violet-600 font-semibold capitalize mb-1">
              {product.category.split(",")[0].trim()}
            </p>
            <h1 className="text-2xl font-bold text-gray-900 leading-snug">{product.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-violet-700">{formatPrice(product.price)}</span>
            <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 px-2 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-700">{Number(product.rating || 0).toFixed(1)}</span>
            </div>
          </div>

          {product.occasions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                <Calendar className="w-4 h-4" /> Perfect for
              </div>
              <div className="flex flex-wrap gap-2">
                {product.occasions.map((occ) => (
                  <span key={occ} className="px-3 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-full capitalize">{occ}</span>
                ))}
              </div>
            </div>
          )}

          {product.relations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                <Heart className="w-4 h-4" /> Great gift for
              </div>
              <div className="flex flex-wrap gap-2">
                {product.relations.map((rel) => (
                  <span key={rel} className="px-3 py-1 bg-pink-50 text-pink-700 text-xs font-medium rounded-full capitalize border border-pink-200">{rel}</span>
                ))}
              </div>
            </div>
          )}

          {product.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                <Tag className="w-4 h-4" /> Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* CTA buttons */}
          <div className="pt-2 space-y-3">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                  added
                    ? "bg-green-100 text-green-700 border-2 border-green-300"
                    : "bg-violet-50 text-violet-700 border-2 border-violet-200 hover:bg-violet-100"
                }`}
              >
                {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                {added ? "Added to Cart!" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg,#7c3aed,#c026d3)" }}
              >
                <Zap className="w-4 h-4" />
                Buy Now
              </button>
            </div>
            <button
              onClick={() => setArOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-violet-700 border border-violet-200 hover:bg-violet-50 transition-colors bg-white"
            >
              <Camera className="w-4 h-4" />
              View in AR (Preview)
            </button>
          </div>
        </div>
      </div>

      {/* Similar products */}
      {similar.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Similar Gifts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {similar.map((p) => (
  <ProductCard key={String(p.id)} product={p} />
))}
          </div>
        </div>
      )}
    </div>
  </div>

  <ARPreviewModal
    product={arOpen ? { id: product.id, name: product.name, image: product.image, price: product.price } : null}
    onClose={() => setArOpen(false)}
  />
<div className = "mt-6"><ProductChatbot product={product} /></div>
</>
  );
}