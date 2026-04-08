import { apiClient } from './client';

export const askAI = (question: string) =>
  apiClient<{ answer: string }>('/api/ai/ask', { method: 'POST', body: JSON.stringify({ question }) });
