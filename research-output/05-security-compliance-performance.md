# Security, Compliance & Performance (2025–2026)

## Executive Summary

Security requirements tightened significantly in 2025: PCI DSS 4.0 became fully mandatory on March 31, 2025, GDPR enforcement continues to escalate, and SOC 2 Type II has become the de facto enterprise sales prerequisite. On the performance side, e-commerce platforms must handle 5–10x normal traffic during peak events, deliver sub-2-second page loads, and scale databases beyond SQLite's single-writer limitation. This document covers security, compliance, and performance/scalability requirements for Inventrix.

---

## Part 1: Security & Compliance

### 1.1 PCI DSS 4.0 (Mandatory from March 31, 2025)

PCI DSS 4.0 introduced new e-commerce-specific requirements:

| Requirement | Description | Impact on Inventrix |
|---|---|---|
| 6.4.3 | Authorize and manage all scripts on payment pages | Audit all JS loaded at checkout |
| 11.6.1 | Change-detection mechanism for payment page scripts | Implement Subresource Integrity (SRI) |
| MFA | Required for all non-consumer accounts accessing cardholder data | Add MFA to admin dashboard |
| Targeted risk analysis | Customized controls based on entity-specific risk | Document risk assessment |

**Best approach for Inventrix**: Use Stripe.js client-side tokenization so card data never touches your servers. This reduces PCI scope to SAQ A (the smallest possible subset of requirements).

```javascript
// CORRECT: Card data never reaches your server
const { paymentMethod } = await stripe.createPaymentMethod({
  type: 'card',
  card: cardElement  // Stripe-hosted iframe — card data stays with Stripe
});
// Only send paymentMethod.id to your backend
await fetch('/api/orders/pay', {
  method: 'POST',
  body: JSON.stringify({ orderId, paymentMethodId: paymentMethod.id })
});
```

### 1.2 GDPR Compliance

GDPR applies to any platform processing EU resident data. Initial compliance investment: $20,000–$100,000 for most organizations.

**Key requirements and implementations:**

| Requirement | Implementation for Inventrix |
|---|---|
| Lawful basis for processing | Document purpose for each data type collected |
| Right to access | `GET /users/:id/data-export` — return all personal data as JSON/CSV |
| Right to erasure | Anonymize user PII; preserve order records for accounting |
| Data minimization | Only collect fields actually needed |
| Privacy by design | Encrypt PII at rest and in transit |
| Breach notification | 72-hour notification to supervisory authority |
| Data retention limits | Auto-anonymize after retention period |

```javascript
// Anonymize user on deletion request (preserve order history for accounting)
async function anonymizeUser(userId) {
  await db.query(`
    UPDATE users SET
      email = 'deleted_' || id || '@anonymized.invalid',
      name = 'Deleted User',
      phone = NULL,
      address_line1 = NULL,
      address_line2 = NULL,
      deleted_at = NOW()
    WHERE id = $1
  `, [userId]);
}
```

### 1.3 SOC 2 Type II

SOC 2 is not legally required but is the de facto standard for B2B SaaS. Enterprise customers will require it before signing contracts.

**Five Trust Service Criteria:**

| Criteria | Key Controls |
|---|---|
| Security | Access controls, encryption, vulnerability management, MFA |
| Availability | Uptime SLAs, disaster recovery, incident response |
| Processing Integrity | Data validation, error handling, complete processing |
| Confidentiality | Data classification, encryption, access restrictions |
| Privacy | GDPR alignment, consent management, data retention |

Estimated timeline: 6–12 months to achieve SOC 2 Type II from scratch.

### 1.4 Node.js + Express Security Hardening

```javascript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';

// Security headers
app.use(helmet());

// Rate limiting
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use('/api/auth/', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }));

// Input validation example
app.post('/api/orders', [
  body('items').isArray({ min: 1 }),
  body('items.*.sku').isString().trim().escape(),
  body('items.*.qty').isInt({ min: 1, max: 1000 }),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  // proceed
});
```

**JWT security pattern:**
```javascript
// Short-lived access tokens + refresh tokens (allows revocation)
const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });
const refreshToken = jwt.sign({ userId }, refreshSecret, { expiresIn: '7d' });
// Store refresh token hash in DB — enables revocation on logout/compromise
```

### 1.5 Security Checklist for Inventrix

- [ ] HTTPS everywhere (TLS 1.3 preferred, TLS 1.2 minimum)
- [ ] JWT with short expiry (15 min access, 7 day refresh with rotation)
- [ ] Refresh token revocation list in database
- [ ] Rate limiting on all public endpoints (stricter on auth endpoints)
- [ ] Input validation and sanitization on all inputs (express-validator)
- [ ] Parameterized queries only — never string concatenation in SQL
- [ ] CORS configured to specific allowed origins
- [ ] Helmet.js for security headers (CSP, HSTS, X-Frame-Options)
- [ ] Secrets in environment variables / AWS Secrets Manager
- [ ] Dependency vulnerability scanning (npm audit in CI, Snyk)
- [ ] Audit logging for all admin actions (who did what, when)
- [ ] MFA for all admin accounts
- [ ] PCI DSS: Stripe.js tokenization (card data never on your servers)
- [ ] GDPR: Data export and deletion endpoints
- [ ] Regular penetration testing (annual minimum)

---

## Part 2: Performance & Scalability

### 2.1 Why SQLite Must Be Replaced

SQLite is a single-writer database — only one write operation can occur at a time. For a multi-user e-commerce platform:

| Scenario | SQLite | PostgreSQL |
|---|---|---|
| Concurrent checkout (10 users) | Serialized writes, timeouts | Full MVCC, concurrent |
| Flash sale (1000 users) | Database locked, errors | Handles with connection pooling |
| Inventory reservation | Race conditions, overselling | Atomic operations |
| Read replicas for analytics | Not supported | Supported |
| Connection pooling | Not supported | PgBouncer / pg-pool |

### 2.2 PostgreSQL Migration Path

```
Phase 1: Schema migration (SQLite → PostgreSQL)
  - Use pgloader or write migration scripts
  - Map SQLite types to PostgreSQL equivalents
  - Add proper indexes (SQLite auto-indexes are minimal)

Phase 2: Connection pooling
  - Add pg-pool (Node.js) or PgBouncer (infrastructure)
  - Configure pool size: (2 × CPU cores) + effective_spindle_count

Phase 3: Read replicas
  - Add RDS read replica for analytics queries
  - Route GET /analytics/* to read replica
  - Route all writes to primary

Phase 4: Caching layer
  - Add Redis for hot inventory data
  - Cache product catalog (changes infrequently)
  - Cache session data (move out of DB)
```

### 2.3 Performance Targets (Industry Standards 2025–2026)

| Metric | Target | Notes |
|---|---|---|
| API response time (p95) | < 200ms | For standard CRUD operations |
| Page load time | < 2 seconds | Google Core Web Vitals threshold |
| Inventory read latency | < 50ms | With Redis cache |
| Order creation throughput | > 100 orders/sec | With PostgreSQL + connection pool |
| Peak traffic handling | 5–10x normal | Load test before every major sale |
| Uptime SLA | 99.9% | ~8.7 hours downtime/year |
| Database query time (p95) | < 100ms | With proper indexing |

### 2.4 Node.js Scaling Strategies

```javascript
// 1. Cluster mode — use all CPU cores
import cluster from 'cluster';
import os from 'os';

if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) cluster.fork();
} else {
  startServer(); // each worker runs the Express app
}

// 2. Redis caching for hot data
const getInventory = async (sku) => {
  const cached = await redis.get(`inventory:${sku}`);
  if (cached) return JSON.parse(cached);
  const data = await db.query('SELECT * FROM inventory WHERE sku = $1', [sku]);
  await redis.setex(`inventory:${sku}`, 30, JSON.stringify(data.rows[0])); // 30s TTL
  return data.rows[0];
};

// 3. Database connection pooling
import { Pool } from 'pg';
const pool = new Pool({ max: 20, idleTimeoutMillis: 30000 });
```

### 2.5 AWS Infrastructure for Inventrix

Recommended AWS architecture for production:

```
Route 53 (DNS)
    → CloudFront (CDN for static assets)
    → ALB (Application Load Balancer)
        → ECS Fargate (Node.js containers, auto-scaling)
            → RDS PostgreSQL (Multi-AZ, read replica)
            → ElastiCache Redis (session, cache, pub/sub)
            → SQS (async job queues)
            → S3 (product images, exports)
            → Bedrock (AI features — already integrated)
```

**Cost-effective scaling**: ECS Fargate auto-scales based on CPU/memory. No idle EC2 costs during low-traffic periods.

### 2.6 Database Indexing for E-Commerce

Critical indexes for order/inventory performance:

```sql
-- Orders: most common query patterns
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status_created ON orders(status, created_at DESC);

-- Inventory: hot path for stock checks
CREATE INDEX idx_inventory_sku ON inventory(sku);
CREATE UNIQUE INDEX idx_inventory_sku_location ON inventory(sku, location_id);

-- Order items: for fulfillment queries
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_sku ON order_items(sku);
```

---

## Recommendations for Inventrix

### Security (Priority Order)
1. **Immediate**: Add Helmet.js, rate limiting, input validation to all endpoints
2. **Immediate**: Switch to Stripe.js client-side tokenization (reduce PCI scope to SAQ A)
3. **Short-term**: Implement GDPR data export and deletion endpoints
4. **Short-term**: Add MFA for admin accounts; implement refresh token rotation
5. **Medium-term**: Begin SOC 2 readiness assessment (6–12 month process)

### Performance
1. **Immediate**: Migrate SQLite → PostgreSQL with connection pooling
2. **Short-term**: Add Redis for inventory caching and session storage
3. **Short-term**: Add proper database indexes for order/inventory query patterns
4. **Medium-term**: Deploy on ECS Fargate with auto-scaling; add RDS read replica
5. **Long-term**: Add CloudFront CDN; implement CQRS for analytics queries

---

## Sources

- PCI Security Standards Council: "PCI DSS E-commerce Requirements Effective After March 2025"
- Basis Theory: "PCI 4.0 in 2025: What best practices are becoming requirements?"
- Thoropass: "About GDPR compliance in 2025"
- Sprinto: "Top 10 Compliance Standards: SOC 2, GDPR, HIPAA & More"
- Rudra Innovative: "E-commerce Platform Development: Scalability & Performance Guide 2026"
- GMobility: "Building a Scalable Postgres RDS Architecture for an E-Commerce Platform"
- Dev.to: "Scaling Node.js Applications to Millions of Users: A Practical Guide", 2025
- Vendure: "Build Enterprise Ecommerce with Node.js Open Source Platforms, 2025"
