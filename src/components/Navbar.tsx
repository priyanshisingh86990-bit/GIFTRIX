import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Gift, Home, Compass, Sparkles, MessageSquare, LogOut, LogIn, ShoppingCart, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { getToken, clearToken } from "@/lib/auth";
import { getCart } from "@/lib/cart";

interface NavbarProps {
  onSearchOpen?: () => void;
}

export default function Navbar({ onSearchOpen }: NavbarProps) {
  const [location, navigate] = useLocation();
  const [token, setToken] = useState(getToken());
  useEffect(() => {
  const checkAuth = () => {
    setToken(getToken());
  };

  checkAuth();

  window.addEventListener("storage", checkAuth);

  return () => {
    window.removeEventListener("storage", checkAuth);
  };
}, []);

  // ✅ FIX: user state manually
  const [user, setUser] = useState<any>(null);

  const [cartCount, setCartCount] = useState(0);

  // ✅ fetch user manually
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => { });
  }, [token]);

  useEffect(() => {
    function update() {
      const items = getCart();
      setCartCount(items.reduce((sum, i) => sum + i.quantity, 0));
    }
    update();
    window.addEventListener("storage", update);
    const interval = setInterval(update, 1000);
    return () => {
      window.removeEventListener("storage", update);
      clearInterval(interval);
    };
  }, []);

  function handleLogout() {
    clearToken();
    navigate("/login");
  }

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/ai-suggestions", label: "AI Picks", icon: Sparkles },
    { href: "/ai-chat", label: "AI Chat", icon: MessageSquare },
  ];

  const mobileLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/ai-suggestions", label: "AI", icon: Sparkles },
    { href: "/orders", label: "Orders", icon: Package },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-violet-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/">
          <div className="flex items-center gap-2 font-bold text-violet-700 text-lg">
            <Gift className="w-5 h-5" />
            <span>Giftrix</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                location === href ? "text-violet-600 bg-violet-100" : "text-gray-500 hover:text-gray-800 hover:bg-violet-50"
              )}>
                <Icon className="w-4 h-4" />
                {label}
              </div>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {token && (
            <>
              <Link href="/orders">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-800 hover:bg-violet-50">
                  <Package className="w-4 h-4" />
                  Orders
                </div>
              </Link>

              <Link href="/cart">
                <div className="relative p-2 rounded-lg text-gray-500 hover:text-violet-600 hover:bg-violet-50 cursor-pointer">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-violet-600 text-white text-[10px] rounded-full flex items-center justify-center">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </div>
              </Link>
            </>
          )}

          {token ? (
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm text-gray-500 hover:text-violet-600 hover:bg-violet-50 cursor-pointer">
                  <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-700">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden lg:block">{user?.name?.split(" ")[0]}</span>
                </div>
              </Link>

              <button onClick={handleLogout} className="px-3 py-1.5 text-sm text-gray-500 hover:bg-violet-50 rounded-lg">
                <LogOut className="w-4 h-4 inline" /> Logout
              </button>
            </div>
          ) : (
            <Link href="/login">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-violet-600 text-white">
                <LogIn className="w-4 h-4" />
                Login
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}


