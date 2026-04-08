import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '../../api/analytics';

export const useDashboard = () => useQuery({ queryKey: ['dashboard'], queryFn: fetchDashboard, refetchInterval: 30000 });
