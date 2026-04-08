import { apiClient } from './client';
import type { ForecastResult } from '../types/ai';

export const fetchForecast = (productId: number) =>
  apiClient<ForecastResult>(`/api/forecast/${productId}`);
