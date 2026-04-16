import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ChevronRight, User, ShoppingBag, Heart, Settings, Headphones, LogOut, Edit, Star, Copy, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getToken, clearToken } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

interface Order {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  items: { name: string; image: string }[];
}

const SIDEBAR_LINKS = [
  { icon: User, label: "My Account", href: "/profile" },
  { icon: ShoppingBag, label: "My Orders", href: "/orders", badge: true },
  { icon: Heart, label: "Wishlist", href: "/explore" },
  { icon: Settings, label: "Settings", href: "/profile" },
  { icon: Headphones, label: "Customer Support", href: "/profile" },
];

export default function Profile() {
  const [, navigate] = useLocation();
  const token = getToken();
  const [user , setUser] = useState<{ name?: string; email?:string}>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ phone: "+91 98765 43210", address: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [token]);

  useEffect(() => {
  if (!token) return;

  fetch(`${import.meta.env.VITE_API_URL || ""}/api/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((r) => r.json())
    .then((data) => setUser(data || {}))
    .catch(() => {});
}, [token]);

  function handleLogout() { clearToken(); navigate("/login"); }

  function handleCopy() {
    navigator.clipboard.writeText("WELCOME100").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const rewardPoints = orders.length * 64;

  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ background: "linear-gradient(180deg,#faf5ff 0%,#f5f3ff 50%,#fdf4ff 100%)" }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
          <Link href="/"><span className="hover:text-violet-600 cursor-pointer">Home</span></Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 font-medium">Profile</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Hi {user?.name?.split(" ")[0] || "there"}!
        </h1>

        <div className="grid md:grid-cols-4 gap-5">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-violet-100 shadow-sm p-5 text-center mb-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-violet-600 border-2 border-violet-200">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <p className="font-bold text-gray-800">{user?.name || "User"}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{user?.email || ""}</p>
            </div>

            <div className="bg-white rounded-2xl border border-violet-100 shadow-sm overflow-hidden">
              {SIDEBAR_LINKS.map(({ icon: Icon, label, href, badge }) => (
                <Link key={label} href={href}>
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-violet-50 transition-colors cursor-pointer border-b border-violet-50 last:border-0">
                    <Icon className="w-4 h-4 text-violet-500" />
                    <span className="text-sm font-medium text-gray-700 flex-1">{label}</span>
                    {badge && orders.length > 0 && (
                      <span className="w-5 h-5 bg-violet-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {orders.length}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
              <button onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors w-full border-t border-violet-50">
                <LogOut className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-red-500">Logout</span>
              </button>
            </div>

            {/* Robot mascot */}
            <div className="mt-4 flex justify-center">
              <div className="w-24 h-24">
                <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <rect x="45" y="40" width="110" height="70" rx="22" fill="white" fillOpacity="0.9"/>
                  <circle cx="78" cy="70" r="12" fill="white"/><circle cx="122" cy="70" r="12" fill="white"/>
                  <circle cx="78" cy="70" r="7" fill="#2563eb"/><circle cx="122" cy="70" r="7" fill="#2563eb"/>
                  <circle cx="80" cy="68" r="2.5" fill="white"/><circle cx="124" cy="68" r="2.5" fill="white"/>
                  <path d="M82 86 Q100 96 118 86" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                  <rect x="50" y="100" width="100" height="78" rx="18" fill="url(#pg)"/>
                  <line x1="100" y1="40" x2="100" y2="22" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="100" cy="18" r="5" fill="#c026d3"/>
                  <rect x="18" y="108" width="30" height="15" rx="7.5" fill="#a78bfa" fillOpacity="0.5"/>
                  <rect x="152" y="108" width="30" height="15" rx="7.5" fill="#a78bfa" fillOpacity="0.5"/>
                  <defs><linearGradient id="pg" x1="50" y1="100" x2="150" y2="178" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-3 space-y-5">
            {/* Profile Overview */}
            <div className="bg-white rounded-2xl border border-violet-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">Profile Overview</h2>
                <button className="flex items-center gap-1 text-sm text-violet-600 hover:underline">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  <input readOnly value={user?.name || ""} placeholder="Your name"
                    className="w-full px-3.5 py-2.5 bg-violet-50/50 border border-violet-100 rounded-xl text-sm text-gray-700 focus:outline-none" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                    <span className="w-3.5 h-3.5 text-xs">✉</span> Email Address
                  </label>
                  <input readOnly value={user?.email || ""} placeholder="your@email.com"
                    className="w-full px-3.5 py-2.5 bg-violet-50/50 border border-violet-100 rounded-xl text-sm text-gray-700 focus:outline-none" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                    <span className="w-3.5 h-3.5 text-xs">📞</span> Phone Number
                  </label>
                  <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-white border border-violet-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                    <span className="w-3.5 h-3.5 text-xs">📍</span> Delivery Address
                  </label>
                  <input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                    placeholder="Flat 123, MG Road, Delhi"
                    className="w-full px-3.5 py-2.5 bg-white border border-violet-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300" />
                </div>
              </div>
              <button onClick={handleSave}
                className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                style={{ background: "linear-gradient(135deg,#7c3aed,#c026d3)" }}>
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Changes"}
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-violet-100 shadow-sm p-5">
              <h2 className="font-bold text-gray-800 mb-4">My Order Summary</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl">
                  <div className="w-9 h-9 bg-violet-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Orders Placed</p>
                    <p className="font-bold text-gray-800 text-lg">{orders.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl">
                  <div className="w-9 h-9 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Wishlist Items</p>
                    <p className="font-bold text-gray-800 text-lg">12</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl mb-4">
                <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Reward Points</p>
                  <p className="font-bold text-gray-800">{rewardPoints}</p>
                </div>
                <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  Copy
                </button>
              </div>

              {/* Exclusive offer */}
              <div className="border border-violet-200 rounded-xl p-4 text-center bg-gradient-to-r from-violet-50 to-pink-50">
                <p className="font-bold text-gray-800 mb-1">Exclusive Offer</p>
                <p className="text-xl font-extrabold text-violet-700">₹100 OFF <span className="text-sm font-medium text-gray-500">on your next order</span></p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">Use Code:</span>
                  <code className="px-2 py-0.5 bg-white border border-violet-200 rounded text-xs font-bold text-violet-700">WELCOME100</code>
                  <button onClick={handleCopy} className="px-2 py-0.5 bg-violet-600 text-white text-xs rounded hover:bg-violet-700 transition-colors">
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
