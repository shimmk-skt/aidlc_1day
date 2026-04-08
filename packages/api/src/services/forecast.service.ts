import db from '../config/database.js';

export const forecastService = {
  getForecast: async (productId: number, days: number = 14) => {
    // 최근 90일 일별 판매량
    const sales = await db.query(`
      SELECT DATE(o.created_at) as date, COALESCE(SUM(oi.quantity), 0) as qty
      FROM orders o JOIN order_items oi ON o.id = oi.order_id
      WHERE oi.product_id = $1 AND o.created_at > NOW() - INTERVAL '90 days' AND o.status != 'cancelled'
      GROUP BY DATE(o.created_at) ORDER BY date`, [productId]);

    const dailySales = sales.rows.map((r: any) => parseFloat(r.qty));
    if (dailySales.length === 0) return { forecast: Array(days).fill(0), avgDailyDemand: 0, reorderPoint: 0, safetyStock: 0 };

    // 이동 평균 (7일 window)
    const avg = dailySales.reduce((a: number, b: number) => a + b, 0) / dailySales.length;
    const variance = dailySales.reduce((sum: number, v: number) => sum + Math.pow(v - avg, 2), 0) / dailySales.length;
    const stdDev = Math.sqrt(variance);

    // 14일 예측 (이동 평균 기반)
    const forecast = Array(days).fill(Math.round(avg * 100) / 100);

    // ROP 계산
    const leadTime = 7;
    const z = 1.65; // 95% service level
    const safetyStock = Math.ceil(z * stdDev * Math.sqrt(leadTime));
    const reorderPoint = Math.ceil(avg * leadTime) + safetyStock;

    return { forecast, avgDailyDemand: Math.round(avg * 100) / 100, stdDev: Math.round(stdDev * 100) / 100, reorderPoint, safetyStock, leadTimeDays: leadTime };
  },

  getReorderSuggestions: async () => {
    // 배치 쿼리로 전체 상품의 90일 판매 데이터를 한번에 조회
    const salesData = await db.query(`
      SELECT oi.product_id, DATE(o.created_at) as date, SUM(oi.quantity) as qty
      FROM orders o JOIN order_items oi ON o.id = oi.order_id
      WHERE o.created_at > NOW() - INTERVAL '90 days' AND o.status != 'cancelled'
      GROUP BY oi.product_id, DATE(o.created_at)`);

    const salesByProduct = new Map<number, number[]>();
    for (const row of salesData.rows) {
      const arr = salesByProduct.get(row.product_id) || [];
      arr.push(parseFloat(row.qty));
      salesByProduct.set(row.product_id, arr);
    }

    const products = await db.query('SELECT id, name, stock, reserved_qty, category FROM products WHERE stock > 0');
    const suggestions = [];
    const leadTime = 7;
    const z = 1.65;

    for (const p of products.rows) {
      const daily = salesByProduct.get(p.id) || [];
      if (daily.length === 0) continue;
      const avg = daily.reduce((a: number, b: number) => a + b, 0) / daily.length;
      const variance = daily.reduce((s: number, v: number) => s + Math.pow(v - avg, 2), 0) / daily.length;
      const stdDev = Math.sqrt(variance);
      const safetyStock = Math.ceil(z * stdDev * Math.sqrt(leadTime));
      const reorderPoint = Math.ceil(avg * leadTime) + safetyStock;

      if (reorderPoint > 0 && (p.stock - p.reserved_qty) <= reorderPoint) {
        suggestions.push({
          productId: p.id, name: p.name, category: p.category,
          currentStock: p.stock, reservedQty: p.reserved_qty,
          reorderPoint, safetyStock,
          avgDailyDemand: Math.round(avg * 100) / 100,
          suggestedOrderQty: Math.max(Math.ceil(avg * 30) - p.stock, 0),
        });
      }
    }
    return suggestions.sort((a, b) => (a.currentStock - a.reservedQty) - (b.currentStock - b.reservedQty));
  },
};
