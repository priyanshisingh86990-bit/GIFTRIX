# Giftrix — Indian Gift Recommendation App

## Overview
Full-stack gift recommendation web app for Indian gifting occasions. Features 70 curated products, AI gift suggestions, AI chat, voice/keyword search, user auth, cart/checkout/orders flow, AR preview UI placeholder, and a personalization scaffold.

## Tech Stack
- **Frontend**: React + Vite + TypeScript (artifact: `artifacts/giftrix`)
- **Backend**: Express + TypeScript (artifact: `artifacts/api-server`)
- **Database**: PostgreSQL via Drizzle ORM (`lib/db`)
- **Auth**: JWT via bcrypt (SESSION_SECRET env var)
- **State**: React Query + localStorage cart
- **Design**: TailwindCSS + shadcn/ui + Lucide icons
-**Payment Gateway**: Razorpay test 

## Architecture

### Frontend Routes (`artifacts/giftrix/src/App.tsx`)
- `/` — Home (hero, category sections, product grid)
- `/login` — Login/Signup (two-panel dreamy UI + robot mascot)
- `/explore` — Browse + filter + AI recommended badges (ProtectedRoute)
- `/product/:id` — Product detail with cart/AR/buy buttons (ProtectedRoute)
- `/ai-suggestions` — AI gift suggestions page (ProtectedRoute)
- `/ai-chat` — AI chat page (ProtectedRoute)
- `/cart` — Shopping cart with quantity controls (ProtectedRoute)
- `/checkout` — Checkout form + payment selector (ProtectedRoute)
- `/order-success` — Order confirmation page (ProtectedRoute)
- `/orders` — Order history with tabs + status badges (ProtectedRoute)
- `/profile` — Profile with sidebar nav, reward points, exclusive discount code (ProtectedRoute)

### Backend Routes (`artifacts/api-server/src/routes/`)
- `GET /api/health` — Health check
- `GET /api/products` — List all products (filter: category, occasion, relation, priceMin, priceMax)
- `GET /api/products/search` — Keyword search
- `GET /api/products/recommended` — Top-rated recommended
- `GET /api/products/categories` — Category list
- `GET /api/products/:id` — Single product
- `POST /api/auth/login` — Login (returns JWT)
- `POST /api/auth/signup` — Signup (returns JWT)
- `GET /api/auth/me` — Current user (Bearer token)
- `POST /api/ai/suggestions` — AI suggestions placeholder
- `POST /api/ai/chat` — AI chat placeholder
- `POST /api/ai/personalize` — Personalization placeholder
- `POST /api/ai/voice` — Voice search placeholder
- `GET /api/orders` — User's orders (Bearer token)
- `POST /api/orders` — Create order (Bearer token)
- `GET /api/orders/:id` — Single order (Bearer token)

### Database Schema (`lib/db/src/schema/`)
- `users` — id, name, email, passwordHash, createdAt
- `products` — id, name, category, price, rating, image, occasions[], relations[], tags[]
- `orders` — id, userId, items (JSONB), total, status, shippingAddress (JSONB), createdAt

### Key Frontend Files
| File | Purpose |
|------|---------|
| `src/App.tsx` | All routes with ProtectedRoute guards |
| `src/components/Navbar.tsx` | Sticky nav, cart count badge, mobile 5-tab nav |
| `src/components/ProductCard.tsx` | Card with Add to Cart / Buy Now / AR preview |
| `src/components/ARPreviewModal.tsx` | AR preview UI placeholder (camera-style) |
| `src/components/ProtectedRoute.tsx` | JWT-based route guard |
| `src/pages/Home.tsx` | Landing page with hero + category sections |
| `src/pages/Explore.tsx` | Browse page with sidebar filters + search |
| `src/pages/ProductDetail.tsx` | Product page with cart/AR actions |
| `src/pages/Cart.tsx` | Cart with qty controls + order summary |
| `src/pages/Checkout.tsx` | Address + payment form, calls POST /api/orders |
| `src/pages/OrderSuccess.tsx` | Confirmation with robot mascot |
| `src/pages/Orders.tsx` | Order history with status tabs |
| `src/pages/Profile.tsx` | Profile, reward points, exclusive discount code |
| `src/lib/cart.ts` | localStorage cart helpers |
| `src/lib/auth.ts` | JWT token localStorage helpers |
| `src/lib/preferences.ts` | Personalization data tracking scaffold |

### Backend Services
- `artifacts/api-server/src/services/personalizationService.ts` — Personalization stub (TODO: AI team)
- `artifacts/api-server/src/services/voiceService.ts` — Voice processing stub (TODO: AI team)

## Important Notes
- Cart is localStorage-only; orders persist to PostgreSQL
- AR: UI placeholder only — implement `handleARPreview()` in `ARPreviewModal.tsx` for real AR
- JWT secret: `process.env.SESSION_SECRET || "giftrix-secret-key"`
- Seed products: `cd artifacts/api-server && npx tsx src/seed.ts`
- DB schema push: `cd lib/db && pnpm push`
- API codegen: `pnpm --filter @workspace/api-spec run codegen`
- Do NOT use Next.js (Vite only), MongoDB (PostgreSQL+Drizzle only)
