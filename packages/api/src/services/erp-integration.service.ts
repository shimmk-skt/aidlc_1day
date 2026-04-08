import { logger } from '../utils/logger.js';

// ERP Adapter Interface
export interface ERPAdapter {
  name: string;
  syncFinancialData(order: { id: number; total: number; status: string; created_at: string }): Promise<void>;
  runReconciliation(): Promise<{ matched: number; mismatched: number; missing: number }>;
}

// Null adapter (no ERP connected)
const nullAdapter: ERPAdapter = {
  name: 'none',
  syncFinancialData: async () => { logger.debug('No ERP configured — skipping sync'); },
  runReconciliation: async () => ({ matched: 0, mismatched: 0, missing: 0 }),
};

let currentAdapter: ERPAdapter = nullAdapter;

export const erpIntegrationService = {
  setAdapter: (adapter: ERPAdapter) => {
    currentAdapter = adapter;
    logger.info({ erp: adapter.name }, 'ERP adapter configured');
  },

  getAdapterName: () => currentAdapter.name,

  syncFinancialData: async (order: { id: number; total: number; status: string; created_at: string }) => {
    await currentAdapter.syncFinancialData(order);
  },

  runReconciliation: async () => {
    return currentAdapter.runReconciliation();
  },
};
