# Domain Entities — Backend Unit

## Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Order : places
    User ||--o{ Address : has
    User ||--o{ RefreshToken : has
    Order ||--|{ OrderItem : contains
    Order ||--o| Payment : has
    Order ||--o| Shipment : has
    Order ||--o| Return : has
    Product ||--o{ OrderItem : referenced_in
    Product ||--o{ InventoryLog : tracks
    Product ||--o{ Forecast : predicted
    Product ||--o{ Recommendation : recommended

    User {
        int id PK
        string email UK
        string password
        string name
        string role
        timestamp created_at
    }

    Address {
        int id PK
        int user_id FK
        string label
        string recipient_name
        string phone
        string address_line1
        string address_line2
        string city
        string postal_code
        boolean is_default
    }

    RefreshToken {
        int id PK
        int user_id FK
        string token_hash
        timestamp expires_at
        boolean revoked
    }

    Product {
        int id PK
        string name
        string description
        decimal price
        int stock
        int reserved_qty
        string image_url
        string category
        timestamp created_at
    }

    Order {
        int id PK
        int user_id FK
        int shipping_address_id FK
        decimal subtotal
        decimal gst
        decimal total
        string status
        string cancel_reason
        timestamp created_at
        timestamp updated_at
    }

    OrderItem {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal price
    }

    Payment {
        int id PK
        int order_id FK
        string payment_key
        string method
        decimal amount
        string status
        timestamp paid_at
        timestamp cancelled_at
    }

    Shipment {
        int id PK
        int order_id FK
        string carrier
        string tracking_number
        string label_url
        string status
        decimal cost
        timestamp shipped_at
        timestamp delivered_at
    }

    Return {
        int id PK
        int order_id FK
        string reason
        string status
        string return_tracking_number
        string return_label_url
        timestamp initiated_at
        timestamp received_at
        timestamp refunded_at
    }

    InventoryLog {
        int id PK
        int product_id FK
        string action
        int quantity_change
        int stock_after
        string reference_type
        int reference_id
        timestamp created_at
    }

    Forecast {
        int id PK
        int product_id FK
        date forecast_date
        decimal predicted_demand
        decimal reorder_point
        decimal safety_stock
        timestamp calculated_at
    }
```

## Entity 상세

### User
- `role`: ENUM('admin', 'customer') — 기존 유지
- Admin 세부 역할 (operations_manager, inventory_manager, finance_manager)은 role 필드 확장으로 처리

### Product
- `reserved_qty`: 주문 생성시 예약된 수량 (available = stock - reserved_qty)
- `category`: Phase 3 추천 엔진에서 사용

### Order.status
- 유효 값: pending, confirmed, processing, picked, packed, shipped, delivered, cancelled, on_hold, backordered, return_initiated, return_received, refunded, exchanged

### Payment.status
- 유효 값: pending, succeeded, failed, cancelled, refunded, partial_refunded

### Shipment.status
- 유효 값: label_created, picked_up, in_transit, out_for_delivery, delivered, exception

### Return.status
- 유효 값: initiated, label_generated, in_transit, received, inspected, refunded, exchanged, rejected
