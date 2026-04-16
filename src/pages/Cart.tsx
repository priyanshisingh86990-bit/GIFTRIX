import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getCart, removeFromCart, updateQuantity, clearCart, getCartTotal, type CartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";

export default function Cart() {
  const [, navigate] = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [allProducts, setAllProducts]= useState<any[]>([]);
  
  useEffect(() => { setCartItems(getCart()); 
    fetch(`${import.meta.env.VITE_API_URL || ""}/api/products`)
          .then((res)=> res.json())
          .then((data)=>{
            setAllProducts(Array.isArray(data)?data:[]);
          })
          .catch(()=>{});
  }, []);

  function refresh() { setCartItems(getCart());}

  function handleRemove(id: number) { removeFromCart(id); refresh(); }
  function handleQty(id: number, qty: number) { updateQuantity(id, qty); refresh(); }
  function handleEmpty() { clearCart(); refresh(); }

  const total = getCartTotal(cartItems);
  const suggestions = allProducts
    .filter((p) => !cartItems.some((c) => c.productId === p.id))
    .slice(0, 4);

  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ background: "linear-gradient(180deg, #faf5ff 0%, #f5f3ff 50%, #fdf4ff 100%)" }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
          <Link href="/"><span className="hover:text-violet-600 cursor-pointer">Home</span></Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 font-medium">Shopping Cart</span>
        </div>

        <div className="flex items-start gap-2 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-500 mt-0.5">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart</p>
          </div>
          {/* Robot mascot */}
          <div className="ml-auto hidden sm:block">
            <div className="w-20 h-20">
              <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect x="45" y="40" width="110" height="70" rx="22" fill="white" fillOpacity="0.9"/>
                <circle cx="78" cy="70" r="12" fill="white"/><circle cx="122" cy="70" r="12" fill="white"/>
                <circle cx="78" cy="70" r="7" fill="#2563eb"/><circle cx="122" cy="70" r="7" fill="#2563eb"/>
                <circle cx="80" cy="68" r="2.5" fill="white"/><circle cx="124" cy="68" r="2.5" fill="white"/>
                <path d="M82 86 Q100 96 118 86" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <rect x="50" y="100" width="100" height="78" rx="18" fill="url(#cg)"/>
                <line x1="100" y1="40" x2="100" y2="22" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="100" cy="18" r="5" fill="#c026d3"/>
                <rect x="18" y="108" width="30" height="15" rx="7.5" fill="#a78bfa" fillOpacity="0.5"/>
                <rect x="152" y="108" width="30" height="15" rx="7.5" fill="#a78bfa" fillOpacity="0.5"/>
                <defs><linearGradient id="cg" x1="50" y1="100" x2="150" y2="178" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
              </svg>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-violet-100 overflow-hidden">
              <div className="p-4 border-b border-violet-50">
                <h2 className="font-bold text-gray-800">Shopping Cart</h2>
              </div>

              {cartItems.length === 0 ? (
                <div className="py-16 text-center">
                  <ShoppingBag className="w-12 h-12 text-violet-200 mx-auto mb-3" />
                  <p className="font-semibold text-gray-700">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mt-1">Add gifts to get started</p>
                  <Link href="/explore">
                    <button className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-white"
                      style={{ background: "linear-gradient(135deg,#7c3aed,#c026d3)" }}>
                      Browse Gifts
                    </button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-violet-50">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="flex items-center gap-4 p-4 hover:bg-violet-50/30 transition-colors">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-violet-100" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm leading-snug truncate">{item.name}</p>
                          <span className="inline-flex items-center mt-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded-full">
                            Perfect for gifting
                          </span>
                          <p className="font-bold text-violet-700 mt-1">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleQty(item.productId, item.quantity - 1)}
                            className="w-7 h-7 rounded-full border border-violet-200 flex items-center justify-center hover:bg-violet-100 text-gray-600 transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => handleQty(item.productId, item.quantity + 1)}
                            className="w-7 h-7 rounded-full border border-violet-200 flex items-center justify-center hover:bg-violet-100 text-gray-600 transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button onClick={() => handleRemove(item.productId)}
                          className="ml-2 w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 flex gap-3 border-t border-violet-50">
                    <button onClick={handleEmpty}
                      className="px-4 py-2 border border-violet-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-violet-50 transition-colors">
                      Empty Cart
                    </button>
                    <Link href="/explore">
                      <button className="px-4 py-2 border border-violet-300 text-violet-600 text-sm font-semibold rounded-xl hover:bg-violet-50 transition-colors flex items-center gap-1.5">
                        Continue Shopping <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-violet-100 p-5">
              <h2 className="font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold text-gray-800">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-400 text-xs">Based on location</span>
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="Enter discount code"
                    className="flex-1 px-3 py-2 text-xs border border-violet-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-300" />
                  <button className="px-3 py-2 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors">Apply</button>
                </div>
                <div className="border-t border-violet-100 pt-3 flex justify-between">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="font-bold text-violet-700 text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                disabled={cartItems.length === 0}
                onClick={() => navigate("/checkout")}
                className="w-full mt-4 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg,#7c3aed,#c026d3)" }}
              >
                Proceed to Checkout
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">100% Secure Payments</p>
                <div className="flex items-center justify-center gap-2 mt-1 text-xs text-gray-400 font-bold">
                  <span>VISA</span><span>•</span><span>Mastercard</span><span>•</span><span>UPI</span><span>•</span><span>SBI</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Free Delivery. Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* You may also like */}
        {suggestions.length > 0 && (
          <section className="mt-10">
            <h2 className="font-bold text-gray-900 text-lg mb-4">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {suggestions.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
