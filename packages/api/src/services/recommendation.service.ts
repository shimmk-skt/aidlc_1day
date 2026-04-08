import db from '../config/database.js';

export const recommendationService = {
  getFrequentlyBoughtTogether: async (productId: number, limit: number = 5) => {
    const r = await db.query(`
      SELECT p.id, p.name, p.price, p.image_url, COUNT(*) as frequency
      FROM order_items oi1
      JOIN order_items oi2 ON oi1.order_id = oi2.order_id AND oi1.product_id != oi2.product_id
      JOIN products p ON oi2.product_id = p.id
      WHERE oi1.product_id = $1
      GROUP BY p.id, p.name, p.price, p.image_url
      HAVING COUNT(*) >= 2
      ORDER BY frequency DESC LIMIT $2`, [productId, limit]);
    return r.rows;
  },

  getPersonalized: async (userId: number, limit: number = 8) => {
    // 사용자가 구매한 카테고리의 인기 상품 중 미구매 상품
    const r = await db.query(`
      SELECT p.id, p.name, p.price, p.image_url, p.category, COUNT(oi2.id) as popularity
      FROM products p
      JOIN order_items oi2 ON p.id = oi2.product_id
      WHERE p.category IN (
        SELECT DISTINCT p2.category FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN products p2 ON oi.product_id = p2.id
        WHERE o.user_id = $1 AND p2.category IS NOT NULL
      )
      AND p.id NOT IN (
        SELECT oi3.product_id FROM order_items oi3
        JOIN orders o2 ON oi3.order_id = o2.id WHERE o2.user_id = $1
      )
      AND p.stock > 0
      GROUP BY p.id, p.name, p.price, p.image_url, p.category
      ORDER BY popularity DESC LIMIT $2`, [userId, limit]);
    return r.rows;
  },
};
