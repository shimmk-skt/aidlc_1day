import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import db from '../config/database.js';

const bedrock = new BedrockRuntimeClient({ region: env.awsRegion });
const CLAUDE_MODEL_ID = process.env.BEDROCK_CLAUDE_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0';

const invokeClaudeChat = async (systemPrompt: string, userMessage: string): Promise<string> => {
  const command = new InvokeModelCommand({
    modelId: CLAUDE_MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });
  const res = await bedrock.send(command);
  const result = JSON.parse(new TextDecoder().decode(res.body));
  return result.content[0].text;
};

export const aiService = {
  askInventoryQuestion: async (question: string) => {
    const inventory = await db.query('SELECT name, stock, reserved_qty, price, category FROM products ORDER BY stock ASC LIMIT 50');
    const recentSales = await db.query(`SELECT p.name, SUM(oi.quantity) as sold FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN orders o ON oi.order_id = o.id WHERE o.created_at > NOW() - INTERVAL '30 days' GROUP BY p.name ORDER BY sold DESC LIMIT 20`);

    const context = `Current inventory (top 50 by lowest stock):\n${inventory.rows.map((r: any) => `- ${r.name}: stock=${r.stock}, reserved=${r.reserved_qty}, price=$${r.price}, category=${r.category}`).join('\n')}\n\nLast 30 days sales:\n${recentSales.rows.map((r: any) => `- ${r.name}: ${r.sold} units sold`).join('\n')}`;

    return invokeClaudeChat(
      'You are an inventory management expert. Answer questions based on the provided inventory and sales data. Be concise and actionable. Respond in Korean.',
      `${context}\n\nQuestion: ${question}`
    );
  },

  generateDemandNarrative: async (days: number = 30) => {
    const sales = await db.query(`SELECT DATE(o.created_at) as date, COUNT(DISTINCT o.id) as orders, SUM(o.total) as revenue FROM orders o WHERE o.created_at > NOW() - INTERVAL '1 day' * $1 AND o.status != 'cancelled' GROUP BY DATE(o.created_at) ORDER BY date`, [days]);
    const topProducts = await db.query(`SELECT p.name, p.category, SUM(oi.quantity) as sold, SUM(oi.quantity * oi.price) as revenue FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN orders o ON oi.order_id = o.id WHERE o.created_at > NOW() - INTERVAL '1 day' * $1 GROUP BY p.name, p.category ORDER BY sold DESC LIMIT 10`, [days]);
    const lowStock = await db.query('SELECT name, stock, category FROM products WHERE stock < 10 ORDER BY stock ASC');

    const context = `Period: Last ${days} days\n\nDaily sales:\n${sales.rows.map((r: any) => `${r.date}: ${r.orders} orders, $${r.revenue}`).join('\n')}\n\nTop products:\n${topProducts.rows.map((r: any) => `- ${r.name} (${r.category}): ${r.sold} sold, $${r.revenue}`).join('\n')}\n\nLow stock alerts:\n${lowStock.rows.map((r: any) => `- ${r.name}: ${r.stock} remaining`).join('\n')}`;

    return invokeClaudeChat(
      'You are a demand analyst. Generate a concise demand narrative report with trends, anomalies, and recommendations. Use bullet points. Respond in Korean.',
      context
    );
  },

  generateProductDescription: async (name: string, category: string, attributes: Record<string, string>) => {
    const attrText = Object.entries(attributes).map(([k, v]) => `${k}: ${v}`).join(', ');
    return invokeClaudeChat(
      'You are an e-commerce copywriter. Write a compelling product description in 2-3 sentences. Respond in Korean.',
      `Product: ${name}\nCategory: ${category}\nAttributes: ${attrText}`
    );
  },
};
