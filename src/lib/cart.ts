const CART_KEY = "giftrix_cart";

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

export function getCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item: Omit<CartItem, "quantity">, qty = 1): void {
  const cart = getCart();
  const existing = cart.find((i) => i.productId === item.productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ ...item, quantity: qty });
  }
  saveCart(cart);
}

export function removeFromCart(productId: number): void {
  saveCart(getCart().filter((i) => i.productId !== productId));
}

export function updateQuantity(productId: number, quantity: number): void {
  if (quantity <= 0) { removeFromCart(productId); return; }
  const cart = getCart();
  const item = cart.find((i) => i.productId === productId);
  if (item) { item.quantity = quantity; saveCart(cart); }
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}
