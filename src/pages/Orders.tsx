import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronRight, Package, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import { formatPrice } from "@/lib/utils";


interface Order {
  id: number;
  items: { productId: number; name: string; price: number; image: string; quantity: number }[];
  total: number;
  status: string;
  shippingAddress: { fullName: string; city: string };
  createdAt: string;
}

const STATUS_STYLES: Record<string, { color: string; bg: string; dot: string }> = {
  Processing: { color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200", dot: "bg-yellow-400" },
  Shipped: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", dot: "bg-blue-400" },
  Delivered: { color: "text-green-700", bg: "bg-green-50 border-green-200", dot: "bg-green-400" },
  Cancelled: { color: "text-red-700", bg: "bg-red-50 border-red-200", dot: "bg-red-400" },
};

const TABS = ["All", "Processing", "Shipped", "Delivered"];

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");

  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
    setLoading(false);
  }, []);

  const filtered = tab === "All" ? orders : orders.filter((o) => o.status === tab);

  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ background: "linear-gradient(180deg,#faf5ff 0%,#f5f3ff 50%,#fdf4ff 100%)" }}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
          <Link href="/"><span className="hover:text-violet-600 cursor-pointer">Home</span></Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 font-medium">My Orders</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${tab === t
                ? "bg-violet-600 text-white"
                : "bg-white border border-violet-200 text-gray-600 hover:bg-violet-50"
                }`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-violet-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-violet-100">
            <ShoppingBag className="w-12 h-12 text-violet-200 mx-auto mb-3" />
            <p className="font-semibold text-gray-700">No orders yet</p>
            <p className="text-sm text-gray-400 mt-1">Start shopping to place your first order</p>
            <Link href="/explore">
              <button className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#7c3aed,#c026d3)" }}>
                Shop Now
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => {
              const items = order.items || [];
              const total = order.total || order.amount || 0;
              const createdAt = order.createdAt || order.date;
              const s = STATUS_STYLES[order.status] || STATUS_STYLES["Processing"];
              const date = order.createdAt
                ? new Date(order.createdAt || order.date).toLocaleDateString("en-IN", {
                  day: "2-digit", month: "short", year: "numeric"
                })
                : "N/A";
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-violet-100 shadow-sm p-4 sm:p-5">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div>
                        <p className="font-bold text-gray-800">Order ID: #{order.id}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {date} &bull; {(order.items?.length || 0)} item{order.items.length !== 1 ? "s" : ""} &bull; {formatPrice(order.total || order.amount || 0)}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${s.bg} ${s.color}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {order.status}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href="/explore">
                        <button className="px-3 py-1.5 text-xs font-semibold bg-violet-50 text-violet-600 border border-violet-200 rounded-xl hover:bg-violet-100 transition-colors">
                          Order Again
                        </button>
                      </Link>
                      <Link href={`/order-success?orderId=${order.id}&total=${order.total}`}>
                        <button className="px-3 py-1.5 text-xs font-semibold bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                  {/* Items preview */}
                  <div className="flex gap-2 mt-3">
                    {(order.items || []).slice(0, 4).map((item) => (
                      <img key={item.productId} src={item.image} alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover border border-violet-100" />
                    ))}
                    {(order.items?.length || 0) > 4 && (
                      <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center text-xs text-violet-600 font-bold">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* AI Insight card */}
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-2xl border border-violet-100 p-4 flex items-center gap-3">
            <span className="text-2xl">🎁</span>
            <div>
              <p className="font-semibold text-gray-800 text-sm">Upcoming Birthday? Buy again</p>
              <Link href="/explore">
                <button className="mt-1.5 px-3 py-1 text-xs font-semibold text-white rounded-lg"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#c026d3)" }}>
                  Shop Now
                </button>
              </Link>
            </div>
            <span className="ml-auto text-2xl">📅</span>
          </div>
          <div className="bg-white rounded-2xl border border-violet-100 p-4 flex items-center gap-3">
            <span className="text-2xl">💜</span>
            <div>
              <p className="text-xs text-violet-600 font-semibold">Insight:</p>
              <p className="text-sm text-gray-700 font-medium">You love gifting thoughtful presents</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
