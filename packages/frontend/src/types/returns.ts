export type ReturnReason = 'DEFECTIVE' | 'WRONG_ITEM' | 'CHANGE_OF_MIND' | 'DAMAGED' | 'OTHER';
export type ReturnStatus = 'INITIATED' | 'LABEL_GENERATED' | 'RECEIVED' | 'REFUNDED' | 'EXCHANGED';

export interface Return {
  id: number;
  orderId: number;
  reason: ReturnReason;
  description?: string;
  photos?: string[];
  status: ReturnStatus;
  returnLabelUrl?: string;
  createdAt: string;
}
