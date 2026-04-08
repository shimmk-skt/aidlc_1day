import { useQuery } from '@tanstack/react-query';
import { fetchProductRecommendations, fetchUserRecommendations } from '../../api/recommendations';

export const useProductRecommendations = (productId: number) =>
  useQuery({ queryKey: ['recommendations', 'product', productId], queryFn: () => fetchProductRecommendations(productId), enabled: !!productId });

export const useUserRecommendations = (userId: number | undefined) =>
  useQuery({ queryKey: ['recommendations', 'user', userId], queryFn: () => fetchUserRecommendations(userId!), enabled: !!userId });
