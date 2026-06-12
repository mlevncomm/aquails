# Aquails Backend Roadmap

## Overview

This document outlines the backend architecture, API endpoints, database models, and third-party integrations needed to support the Aquails water purification e-commerce platform.

---

## 1. API Endpoint Structure

### Base URL
```
/api/v1
```

### Authentication
```
POST   /auth/register           - User registration
POST   /auth/login              - User login (JWT)
POST   /auth/refresh            - Refresh JWT token
POST   /auth/forgot-password    - Password reset request
POST   /auth/reset-password     - Password reset confirm
POST   /auth/logout             - Invalidate token
```

### Products
```
GET    /products                - List products (paginated, filterable)
GET    /products/:slug          - Product detail
GET    /products/related/:id    - Related products
GET    /categories              - List categories
GET    /categories/:id          - Category detail
```

### Cart
```
GET    /cart                    - Get current cart
POST   /cart/items              - Add item to cart
PUT    /cart/items/:id          - Update cart item quantity
DELETE /cart/items/:id          - Remove item from cart
DELETE /cart                    - Clear cart
```

### Orders
```
POST   /orders                  - Create order
GET    /orders                  - List user orders
GET    /orders/:id              - Order detail
PATCH  /orders/:id/status       - Update order status (admin)
POST   /orders/:id/cancel       - Cancel order
```

### Checkout
```
POST   /checkout                - Initiate checkout
POST   /checkout/validate       - Validate checkout data
GET    /checkout/shipping-cost  - Calculate shipping cost
GET    /checkout/install-slots  - Get available installation slots
```

### Customers
```
GET    /customers/profile       - Get profile
PUT    /customers/profile       - Update profile
GET    /customers/addresses     - List addresses
POST   /customers/addresses     - Add address
PUT    /customers/addresses/:id - Update address
DELETE /customers/addresses/:id - Delete address
```

### Service Requests
```
POST   /service-requests        - Create service request
GET    /service-requests        - List user requests
GET    /service-requests/:id    - Request detail
PATCH  /service-requests/:id    - Update request status (admin)
```

### Coupons
```
GET    /coupons                 - List available coupons
POST   /coupons/validate        - Validate coupon code
```

### Subscriptions
```
POST   /subscriptions           - Create subscription
GET    /subscriptions           - List subscriptions
PATCH  /subscriptions/:id       - Pause/resume/cancel subscription
```

### Stock Notifications
```
POST   /stock-notifications     - Register stock notification
GET    /stock-notifications     - List notifications (admin)
PATCH  /stock-notifications/:id - Mark as notified (admin)
```

### Product Questions
```
POST   /questions               - Ask product question
GET    /questions               - List questions
GET    /questions/:id           - Question detail
POST   /questions/:id/answer    - Answer question (admin)
```

### Loyalty
```
GET    /loyalty/points          - Get current points balance
GET    /loyalty/transactions    - List point transactions
POST   /loyalty/convert         - Convert points to coupon
GET    /loyalty/rules           - Get earn rules
```

### Referral
```
GET    /referrals               - Get referral data
POST   /referrals/track         - Track referral conversion
```

### Admin
```
GET    /admin/dashboard         - Dashboard metrics
GET    /admin/orders            - All orders (admin)
GET    /admin/customers         - All customers (admin)
GET    /admin/products          - Product management
GET    /admin/reports/sales     - Sales reports
GET    /admin/reports/inventory - Inventory reports
GET    /admin/service-calendar  - Service calendar
```

---

## 2. Database Models

### User (Auth)
```typescript
interface User {
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  phone?: string;
  role: 'customer' | 'admin';
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Customer Profile
```typescript
interface CustomerProfile {
  id: string;
  userId: string;
  tcKimlik?: string;
  birthDate?: Date;
  loyaltyPoints: number;
  referralCode: string;
  referredBy?: string;
  createdAt: Date;
}
```

### Product
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  description: string;
  shortDescription: string;
  price: number;
  oldPrice?: number;
  stock: number;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Category
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
}
```

### Cart
```typescript
interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  couponCode?: string;
  discountAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}
```

### Order
```typescript
interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  installationSlot?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
```

### Address
```typescript
interface Address {
  id: string;
  userId: string;
  title: string;
  type: 'shipping' | 'billing';
  city: string;
  district: string;
  fullAddress: string;
  postalCode?: string;
  isDefault: boolean;
}
```

### Coupon
```typescript
interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit: number;
  usageCount: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}
```

### Service Request
```typescript
interface ServiceRequest {
  id: string;
  userId: string;
  type: 'installation' | 'filter_change' | 'maintenance' | 'repair';
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  address: string;
  preferredDate?: Date;
  description: string;
  assignedTo?: string; // technician ID
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Subscription
```typescript
interface Subscription {
  id: string;
  userId: string;
  productId: string;
  plan: 'monthly' | 'quarterly' | 'yearly';
  status: 'active' | 'paused' | 'cancelled';
  nextDeliveryDate: Date;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Stock Notification
```typescript
interface StockNotification {
  id: string;
  productId: string;
  email: string;
  phone?: string;
  status: 'pending' | 'notified';
  createdAt: Date;
  notifiedAt?: Date;
}
```

### Product Question
```typescript
interface ProductQuestion {
  id: string;
  productId: string;
  userId: string;
  question: string;
  answer?: string;
  isPublished: boolean;
  createdAt: Date;
  answeredAt?: Date;
}
```

### Loyalty Transaction
```typescript
interface LoyaltyTransaction {
  id: string;
  userId: string;
  type: 'earn' | 'redeem';
  amount: number;
  description: string;
  orderId?: string;
  createdAt: Date;
}
```

### Review
```typescript
interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
  isPublished: boolean;
  helpful: number;
  createdAt: Date;
}
```

---

## 3. Order Status Flow

```
pending → processing → shipped → delivered
  ↓         ↓
cancelled  returned
```

- **pending**: Order created, awaiting payment
- **processing**: Payment confirmed, preparing shipment
- **shipped**: Handed to courier
- **delivered**: Customer received
- **cancelled**: Cancelled by customer or admin
- **returned**: Return request processed

---

## 4. Payment Integration

### Recommended Providers
- **Iyzico**: Primary Turkish payment provider
- **PayTR**: Alternative Turkish payment gateway
- **Stripe**: International cards

### Payment Methods
- Credit/Debit Card
- Havale/EFT (Bank Transfer)
- Kapıda Ödeme (Cash on Delivery)
- Taksit (Installments - 3/6/9/12 months)

### Webhook Events
```
payment.success      - Payment completed
payment.failed       - Payment failed
payment.refunded     - Refund processed
payment.chargeback   - Chargeback received
```

---

## 5. Shipping Integration

### Recommended Providers
- **Yurtiçi Kargo**: Primary
- **Aras Kargo**: Alternative
- **MNG Kargo**: Alternative

### Features
- Automatic tracking number generation
- Shipping cost calculation by weight/zone
- Real-time tracking status updates via API
- Free shipping threshold: 1,500₺

---

## 6. Notification System

### Channels
- **Email**: SendGrid / Amazon SES
- **SMS**: Twilio / Netgsm / İleti Merkezi
- **WhatsApp**: WhatsApp Business API
- **Push**: Firebase Cloud Messaging (FCM)

### Notification Events
```
order.created        → Email + SMS
order.shipped        → Email + SMS (with tracking)
order.delivered      → Email + SMS
payment.success      → Email
payment.failed       → Email + SMS
service.scheduled    → Email + SMS
filter.reminder      → Email + SMS + WhatsApp
stock.available      → Email
review.request       → Email (3 days after delivery)
campaign.new         → Email (opt-in)
```

---

## 7. Admin Operations

### Dashboard Metrics
- Daily/weekly/monthly revenue
- Order count and status distribution
- New customer registrations
- Low stock alerts
- Pending service requests
- Abandoned cart rate

### Admin Roles
- **Super Admin**: Full access
- **Product Manager**: Products, categories, stock
- **Order Manager**: Orders, shipping
- **Customer Service**: Service requests, questions, reviews
- **Content Manager**: Blog, campaigns, pages

---

## 8. Performance & Scalability

### Caching Strategy
- **Redis**: Session store, cart data, product cache
- **CDN**: Product images, static assets
- **Database**: Query result caching for categories and popular products

### Background Jobs
- **Daily**: Low stock reports, filter change reminders
- **Hourly**: Abandoned cart recovery emails
- **Weekly**: Sales reports, inventory reconciliation
- **Real-time**: Order status webhooks, payment callbacks

---

## 9. Security Considerations

- JWT with refresh token rotation
- Rate limiting on auth endpoints
- Input validation and sanitization
- SQL injection prevention (ORM parameterized queries)
- XSS protection
- CSRF tokens for non-API routes
- File upload validation and virus scanning
- GDPR/KVKK compliance for data handling
