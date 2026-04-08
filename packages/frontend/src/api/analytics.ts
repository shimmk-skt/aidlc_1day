import { apiClient } from './client';
import type { DashboardData } from '../types/analytics';

export const fetchDashboard = () => apiClient<DashboardData>('/api/analytics/dashboard');
