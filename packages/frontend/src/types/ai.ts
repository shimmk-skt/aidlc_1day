export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ForecastResult {
  productId: number;
  productName: string;
  forecastDays: number;
  dailyForecast: { date: string; quantity: number }[];
  reorderPoint: number;
  currentStock: number;
  suggestedOrderQty: number;
}

export interface Recommendation {
  productId: number;
  product: import('./product').Product;
  score: number;
  type: 'frequently_bought_together' | 'personalized';
}
