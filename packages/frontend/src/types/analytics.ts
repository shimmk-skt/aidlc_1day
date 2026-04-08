export interface InventoryKPIs {
  turnoverRate: number;
  daysSalesOfInventory: number;
  stockoutRate: number;
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  inventoryKPIs: InventoryKPIs;
  recentOrders: import('./order').Order[];
  revenueChart: { date: string; revenue: number }[];
}
