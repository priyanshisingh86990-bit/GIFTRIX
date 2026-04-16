import { Link, useLocation } from "wouter";
import { CheckCircle2, Truck, RefreshCw, Headphones } from "lucide-react";
import Navbar from "@/components/Navbar";
import { formatPrice } from "@/lib/utils";

export default function OrderSuccess() {
  const [location] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("orderId") || "N/A";
  const total = Number(params.get("total") || 0);

  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ background: "linear-gradient(180deg,#faf5ff 0%,#f0ecff 40%,#fdf4ff 100%)" }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Robot celebration banner */}
        <div className="relative rounded-2xl overflow-hidden mb-8 flex items-center justify-center py-10"
          style={{ background: "linear-gradient(135deg,#ede9fe 0%,#ddd6fe 50%,#f5d0fe 100%)" }}>
          {/* Floating gift boxes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {["top-4 left-8","top-8 left-1/4","bottom-6 right-8","bottom-4 right-1/4","top-3 right-1/3"].map((pos, i) => (
              <div key={i} className={`absolute ${pos} text-2xl opacity-60`}>{["🎁","🎀","🎊","💜","✨"][i]}</div>
            ))}
          </div>
          {/* Robot mascot */}
          <div className="w-32 h-32 drop-shadow-xl">
            <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <rect x="45" y="40" width="110" height="70" rx="22" fill="white" fillOpacity="0.9"/>
              <circle cx="78" cy="70" r="12" fill="white"/><circle cx="122" cy="70" r="12" fill="white"/>
              <circle cx="78" cy="70" r="7" fill="#2563eb"/><circle cx="122" cy="70" r="7" fill="#2563eb"/>
              <circle cx="80" cy="68" r="2.5" fill="white"/><circle cx="124" cy="68" r="2.5" fill="white"/>
              <path d="M80 87 Q100 99 120 87" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" fill="none"/>
              <rect x="50" y="100" width="100" height="78" rx="18" fill="url(#sg)"/>
              <line x1="100" y1="40" x2="100" y2="22" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="100" cy="18" r="5" fill="#fbbf24"/>
              <rect x="18" y="108" width="30" height="15" rx="7.5" fill="#a78bfa" fillOpacity="0.6"/>
              <rect x="155" y="96" width="24" height="22" rx="5" fill="#fce7f3"/>
              <rect x="155" y="96" width="24" height="9" rx="5" fill="#ec4899"/>
              <line x1="167" y1="96" x2="167" y2="118" stroke="#ec4899" strokeWidth="2"/>
              <defs><linearGradient id="sg" x1="50" y1="100" x2="150" y2="178" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
            </svg>
          </div>
        </div>

        {/* Success card */}
        <div className="bg-white rounded-2xl shadow-sm border border-violet-100 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h1>
          <div className="flex items-center justify-center gap-2 text-green-600 mb-6">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Your order has been placed successfully!</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-violet-50 rounded-xl p-4 text-left">
              <p className="text-xs text-gray-500 mb-1">Order ID:</p>
              <p className="font-bold text-gray-800 text-lg">#{orderId}</p>
            </div>
            <div className="bg-violet-50 rounded-xl p-4 text-left">
              <p className="text-xs text-gray-500 mb-1">Total Paid:</p>
              <p className="font-bold text-violet-700 text-lg">{formatPrice(total)}</p>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-6">
            A confirmation has been sent to your registered email address.
          </p>

          <div className="flex gap-3">
            <Link href="/orders">
              <button className="flex-1 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg,#7c3aed,#c026d3)" }}>
                Track Order
              </button>
            </Link>
            <Link href="/">
              <button className="flex-1 py-3 rounded-xl font-semibold text-gray-700 text-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                Back to Home
              </button>
            </Link>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { icon: Truck, label: "Free Shipping on All Orders" },
            { icon: RefreshCw, label: "Easy Returns & Exchange" },
            { icon: Headphones, label: "Customer Support Available" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="text-center">
              <div className="w-10 h-10 bg-violet-100 rounded-xl mx-auto flex items-center justify-center mb-2">
                <Icon className="w-5 h-5 text-violet-600" />
              </div>
              <p className="text-xs text-gray-500 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
