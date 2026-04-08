# Frontend Unit — Domain Entities

## 공유 타입 (Shared Types)

### User
```typescript
interface User {
  id: number;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}
```

### AuthTokens
```typescript
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
```

### Product
```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category?: string;
}
```

### CartItem
```typescript
interface CartItem {
  product: Product;
  quantity: number;
}
```

### Order
```typescript
interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: Address;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryEntry[];
}
```

### OrderItem
```typescript
interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  quantity: number;
  price: number;
}
```

### OrderStatus
```typescript
type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PICKED'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'ON_HOLD'
  | 'BACKORDERED'
  | 'RETURN_INITIATED'
  | 'RETURN_RECEIVED'
  | 'REFUNDED'
  | 'EXCHANGED';
```

### StatusHistoryEntry
```typescript
interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}
```

### Address
```typescript
interface Address {
  id: number;
  userId: number;
  name: string;          // 수령인 이름
  phone: string;
  zipCode: string;
  address: string;       // 도로명 주소 (Daum API 결과)
  addressDetail: string; // 상세 주소 (사용자 입력)
  isDefault: boolean;
}
```

### Return
```typescript
interface Return {
  id: number;
  orderId: number;
  reason: ReturnReason;
  description?: string;
  photos?: string[];     // 업로드된 사진 URL 목록
  status: ReturnStatus;
  returnLabelUrl?: string;
  createdAt: string;
}

type ReturnReason = 'DEFECTIVE' | 'WRONG_ITEM' | 'CHANGE_OF_MIND' | 'DAMAGED' | 'OTHER';
type ReturnStatus = 'INITIATED' | 'LABEL_GENERATED' | 'RECEIVED' | 'REFUNDED' | 'EXCHANGED';
```

### Payment
```typescript
interface PaymentRequest {
  orderId: number;
  amount: number;
  orderName: string;
}
```

### InventoryKPIs
```typescript
interface InventoryKPIs {
  turnoverRate: number;
  daysSalesOfInventory: number;
  stockoutRate: number;
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
}
```

### ForecastResult
```typescript
interface ForecastResult {
  productId: number;
  productName: string;
  forecastDays: number;
  dailyForecast: { date: string; quantity: number }[];
  reorderPoint: number;
  currentStock: number;
  suggestedOrderQty: number;
}
```

### Recommendation
```typescript
interface Recommendation {
  productId: number;
  product: Product;
  score: number;
  type: 'frequently_bought_together' | 'personalized';
}
```

### WebSocket Events
```typescript
type WSEvent =
  | { type: 'inventory_update'; productId: number; stock: number }
  | { type: 'order_update'; orderId: number; status: OrderStatus }
  | { type: 'new_order'; order: Order }
  | { type: 'low_stock_alert'; productId: number; productName: string; stock: number }
  | { type: 'reorder_alert'; productId: number; productName: string; suggestedQty: number };
```

### AI Chat
```typescript
interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
```

### DashboardData
```typescript
interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  inventoryKPIs: InventoryKPIs;
  recentOrders: Order[];
  revenueChart: { date: string; revenue: number }[];
}
```
