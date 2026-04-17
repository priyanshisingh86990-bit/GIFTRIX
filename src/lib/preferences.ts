const PREFS_KEY = "giftrix_preferences";

export interface UserPreferences {
  categoriesViewed: string[];
  productsClicked: number[];
  searchQueries: string[];
}

export function getPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(PREFS_KEY);
    return stored ? JSON.parse(stored) : { categoriesViewed: [], productsClicked: [], searchQueries: [] };
  } catch {
    return { categoriesViewed: [], productsClicked: [], searchQueries: [] };
  }
}

export function trackCategory(category: string): void {
  const prefs = getPreferences();
  if (!prefs.categoriesViewed.includes(category)) {
    prefs.categoriesViewed = [category, ...prefs.categoriesViewed].slice(0, 20);
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }
}

export function trackProductClick(productId: number): void {
  const prefs = getPreferences();
  prefs.productsClicked = [productId, ...prefs.productsClicked.filter((id) => id !== productId)].slice(0, 50);
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export function trackSearch(query: string): void {
  if (!query.trim()) return;
  const prefs = getPreferences();
  prefs.searchQueries = [query.trim(), ...prefs.searchQueries.filter((q) => q !== query.trim())].slice(0, 20);
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}
