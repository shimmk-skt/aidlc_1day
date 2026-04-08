# API Documentation

## REST APIs

### Authentication

#### POST /api/auth/login
- **Purpose**: 사용자 로그인
- **Request**: `{ email: string, password: string }`
- **Response**: `{ token: string, user: { id, email, name, role } }`
- **Auth**: 불필요

#### POST /api/auth/register
- **Purpose**: 신규 사용자 등록 (customer 역할 고정)
- **Request**: `{ email: string, password: string, name: string }`
- **Response**: `{ token: string, user: { id, email, name, role } }`
- **Auth**: 불필요

### Products

#### GET /api/products
- **Purpose**: 전체 상품 목록 조회
- **Response**: `Product[]` (id, name, description, price, stock, image_url, created_at)
- **Auth**: 불필요 (공개)

#### GET /api/products/:id
- **Purpose**: 상품 상세 조회
- **Response**: `Product`
- **Auth**: 불필요 (공개)

#### POST /api/products
- **Purpose**: 상품 생성
- **Request**: `{ name, description, price, stock, image_url }`
- **Response**: `{ id, name, description, price, stock, image_url }`
- **Auth**: Admin 필수

#### PUT /api/products/:id
- **Purpose**: 상품 수정
- **Request**: `{ name, description, price, stock, image_url }`
- **Response**: `{ id, name, description, price, stock, image_url }`
- **Auth**: Admin 필수

#### DELETE /api/products/:id
- **Purpose**: 상품 삭제
- **Response**: 204 No Content
- **Auth**: Admin 필수

#### POST /api/products/generate-image
- **Purpose**: AWS Bedrock를 통한 AI 상품 이미지 생성
- **Request**: `{ productName: string, description: string }`
- **Response**: `{ imageUrl: string }`
- **Auth**: Admin 필수

### Orders

#### GET /api/orders
- **Purpose**: 주문 목록 조회 (Admin: 전체, Customer: 본인 주문만)
- **Response**: `Order[]` (Admin: user_name, user_email 포함)
- **Auth**: 필수

#### GET /api/orders/:id
- **Purpose**: 주문 상세 조회 (주문 항목 포함)
- **Response**: `{ ...order, items: OrderItem[] }`
- **Auth**: 필수 (본인 주문 또는 Admin)

#### POST /api/orders
- **Purpose**: 주문 생성 (재고 확인 → 주문 생성 → 재고 차감)
- **Request**: `{ items: [{ product_id: number, quantity: number }] }`
- **Response**: `{ id, subtotal, gst, total, status }`
- **Auth**: 필수
- **비즈니스 로직**: GST 10% 자동 계산, 재고 부족시 400 에러

#### PATCH /api/orders/:id/status
- **Purpose**: 주문 상태 변경
- **Request**: `{ status: string }`
- **Response**: `{ id, status }`
- **Auth**: Admin 필수

### Analytics

#### GET /api/analytics/dashboard
- **Purpose**: Admin 대시보드 데이터 (매출, 주문수, 상품수, 재고부족, 최근주문, 인기상품, 상태별 통계)
- **Response**: `{ summary, recentOrders, topProducts, ordersByStatus }`
- **Auth**: Admin 필수

#### GET /api/analytics/inventory
- **Purpose**: 재고 현황 (상품별 재고 수량 및 상태)
- **Response**: `InventoryItem[]` (id, name, stock, price, status)
- **Auth**: Admin 필수

## Data Models

### users
| Field | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| email | TEXT | UNIQUE NOT NULL |
| password | TEXT | NOT NULL (bcrypt hashed) |
| name | TEXT | NOT NULL |
| role | TEXT | NOT NULL, CHECK('admin', 'customer') |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

### products
| Field | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| name | TEXT | NOT NULL |
| description | TEXT | nullable |
| price | REAL | NOT NULL |
| stock | INTEGER | NOT NULL DEFAULT 0 |
| image_url | TEXT | nullable |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

### orders
| Field | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| user_id | INTEGER | NOT NULL, FK → users(id) |
| subtotal | REAL | NOT NULL |
| gst | REAL | NOT NULL |
| total | REAL | NOT NULL |
| status | TEXT | NOT NULL, CHECK('pending','processing','shipped','delivered','cancelled') |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

### order_items
| Field | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| order_id | INTEGER | NOT NULL, FK → orders(id) |
| product_id | INTEGER | NOT NULL, FK → products(id) |
| quantity | INTEGER | NOT NULL |
| price | REAL | NOT NULL |
