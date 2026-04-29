import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShieldCheck, ChevronRight, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getCart, getCartTotal, clearCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { getToken } from "@/lib/auth";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit Card / Debit Card" },
  { id: "upi", label: "UPI / PayTM" },
  { id: "cod", label: "Cash on Delivery" },
];

export default function Checkout() {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", address: "", city: "", state: "", pincode: "",
    cardNumber: "", cardName: "", expiry: "", cvv: "",
  });

  const cartItems = getCart();
  const subtotal = getCartTotal(cartItems);
  const discount = cartItems.length >= 3 ? 150 : 0;
  const total = subtotal - discount;
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };


  const handlePayment = async () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);

    script.onload = () => {
      const options = {
        key: "rzp_test_Sj9AI3BjLrmDF6",
        amount: 50000,
        currency: "INR",
        name: "Giftrix",
        description: "Demo Payment",

        handler: (response: any) => {


          localStorage.setItem("latestOrder", JSON.stringify(order));

          const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
          existingOrders.push(order);
          localStorage.setItem("orders", JSON.stringify(existingOrders));

          window.location.href = `/order-success`;
        },

        modal: {
          ondismiss: () => {
            console.log("Fallback triggered");

            const order = {
              id: Date.now(),
              items: Array.isArray(cartItems) ? cartItems : [],
              total: typeof total === "number" ? total : 500,
              status: "Processing",
              createdAt: new Date().toISOString(),
            };

            const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
            existingOrders.push(order);
            localStorage.setItem("orders", JSON.stringify(existingOrders));

            window.location.href = "/order-success";
          },
        },

        theme: {
          color: "#9333ea",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    };
  };




  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setLoading(true);

    try {
      const token = getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: cartItems.map((i) => ({
            productId: i.productId, name: i.name, price: i.price,
            image: i.image, quantity: i.quantity,
          })),
          total,
          shippingAddress: {
            fullName: form.fullName, email: form.email, phone: form.phone,
            address: form.address, city: form.city, state: form.state, pincode: form.pincode,
          },
        }),
      });
      const order = await response.json();
      clearCart();
      navigate(`/order-success?orderId=${order.id}&total=${total}`);
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ background: "linear-gradient(180deg,#faf5ff 0%,#f5f3ff 50%,#fdf4ff 100%)" }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
          <Link href="/"><span className="hover:text-violet-600 cursor-pointer">Home</span></Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/cart"><span className="hover:text-violet-600 cursor-pointer">Cart</span></Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 font-medium">Checkout</span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <div className="flex items-center gap-1.5 text-sm text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            Secure Checkout
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Address + Payment */}
            <div className="lg:col-span-2 space-y-5">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-sm border border-violet-100 p-5">
                <h2 className="font-bold text-gray-800 mb-4">Shipping Address</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input name="fullName" required value={form.fullName} onChange={handleChange}
                      placeholder="Ashish Sharma"
                      className="w-full px-3.5 py-2.5 border border-violet-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-violet-50/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input name="email" type="email" required value={form.email} onChange={handleChange}
                      placeholder="you@email.com"
                      className="w-full px-3.5 py-2.5 border border-violet-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-violet-50/30" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input name="phone" required value={form.phone} onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 border border-violet-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-violet-50/30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input name="pincode" required value={form.pincode} onChange={handleChange}
                        placeholder="110011"
                        className="w-full px-3.5 py-2.5 border border-violet-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-violet-50/30" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input name="state" required value={form.state} onChange={handleChange}
                        placeholder="Delhi"
                        className="w-full px-3.5 py-2.5 border border-violet-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-violet-50/30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input name="city" required value={form.city} onChange={handleChange}
                        placeholder="New Delhi"
                        className="w-full px-3.5 py-2.5 border border-violet-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-violet-50/30" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                    <input name="address" required value={form.address} onChange={handleChange}
                      placeholder="Flat 123, Rosewood Apartments, MG Road"
                      className="w-full px-3.5 py-2.5 border border-violet-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-violet-50/30" />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm border border-violet-100 p-5">
                <h2 className="font-bold text-gray-800 mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((m) => (
                    <label key={m.id} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors"
                      style={{ borderColor: paymentMethod === m.id ? "#7c3aed" : "#ede9fe", background: paymentMethod === m.id ? "#f5f3ff" : "transparent" }}>
                      <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id}
                        onChange={() => setPaymentMethod(m.id)} className="accent-violet-600" />
                      <span className="text-sm font-medium text-gray-700">{m.label}</span>
                    </label>
                  ))}

                  {paymentMethod === "card" && (
                    <div className="mt-3 space-y-3 p-3 bg-violet-50/50 rounded-xl border border-violet-100">
                      <input name="cardNumber" value={form.cardNumber} onChange={handleChange}
                        placeholder="4217 8763 9994 2356" maxLength={19}
                        className="w-full px-3.5 py-2.5 border border-violet-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" />
                      <input name="cardName" value={form.cardName} onChange={handleChange}
                        placeholder="Card Holder Name"
                        className="w-full px-3.5 py-2.5 border border-violet-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" />
                      <div className="grid grid-cols-2 gap-3">
                        <input name="expiry" value={form.expiry} onChange={handleChange}
                          placeholder="MM / YY" maxLength={5}
                          className="w-full px-3.5 py-2.5 border border-violet-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" />
                        <input name="cvv" value={form.cvv} onChange={handleChange}
                          placeholder="CVV" maxLength={3} type="password"
                          className="w-full px-3.5 py-2.5 border border-violet-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" />
                      </div>
                      <div className="flex justify-end gap-3 text-xs font-bold text-gray-400">
                        <span>VISA</span><span>Mastercard</span><span>PayTM</span><span>SBI</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                    100% Secure Payments
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-violet-100 p-5">
                <h2 className="font-bold text-gray-800 mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">{formatPrice(item.price)} × {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-violet-100 pt-3 space-y-2 text-sm">
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discounts</span><span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-1 border-t border-violet-100">
                    <span>Total</span>
                    <span className="text-violet-700">{formatPrice(total)}</span>
                  </div>
                </div>

                <button type="submit" disabled={loading || cartItems.length === 0}
                  className="w-full mt-4 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#c026d3)" }} onClick={handlePayment}>
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Place Order & Pay
                </button>

                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-400">100% Secure Payments by VISA</p>
                  <p className="text-xs text-gray-400 mt-1">Free Delivery. Easy Returns</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}