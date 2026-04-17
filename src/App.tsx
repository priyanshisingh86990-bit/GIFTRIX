import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Login from "@/pages/Login";
import ProductDetail from "@/pages/ProductDetail";
import AiSuggestions from "@/pages/AiSuggestions";
import AiChat from "@/pages/AiChat";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import Orders from "@/pages/Orders";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 * 2 } },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/explore">{() => <ProtectedRoute component={Explore} />}</Route>
      <Route path="/product/:id">{() => <ProtectedRoute component={ProductDetail} />}</Route>
      <Route path="/ai-suggestions">{() => <ProtectedRoute component={AiSuggestions} />}</Route>
      <Route path="/ai-chat">{() => <ProtectedRoute component={AiChat} />}</Route>
      <Route path="/cart">{() => <ProtectedRoute component={Cart} />}</Route>
      <Route path="/checkout">{() => <ProtectedRoute component={Checkout} />}</Route>
      <Route path="/order-success">{() => <ProtectedRoute component={OrderSuccess} />}</Route>
      <Route path="/orders">{() => <ProtectedRoute component={Orders} />}</Route>
      <Route path="/profile">{() => <ProtectedRoute component={Profile} />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
