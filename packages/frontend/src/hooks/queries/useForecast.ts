import { useQuery } from '@tanstack/react-query';
import { fetchForecast } from '../../api/forecast';

export const useForecast = (productId: number | null) =>
  useQuery({ queryKey: ['forecast', productId], queryFn: () => fetchForecast(productId!), enabled: !!productId });
