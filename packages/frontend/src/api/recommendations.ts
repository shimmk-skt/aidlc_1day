import { apiClient } from './client';
import type { Recommendation } from '../types/ai';

export const fetchProductRecommendations = (productId: number) =>
  apiClient<Recommendation[]>(`/api/recommendations/product/${productId}`);
export const fetchUserRecommendations = (userId: number) =>
  apiClient<Recommendation[]>(`/api/recommendations/user/${userId}`);
