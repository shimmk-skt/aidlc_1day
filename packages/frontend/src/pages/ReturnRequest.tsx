import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createReturn } from '../api/returns';
import { useToast } from '../context/ToastContext';
import { RETURN_REASON_LABEL } from '../utils/constants';
import type { ReturnReason } from '../types/returns';

export default function ReturnRequest() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [reason, setReason] = useState<ReturnReason | ''>('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter(f => f.size <= 5 * 1024 * 1024 && /^image\/(jpeg|png)$/.test(f.type));
    if (valid.length !== files.length) showToast('JPEG/PNG, 5MB 이하만 가능합니다', 'error');
    setPhotos(prev => [...prev, ...valid].slice(0, 3));
  };

  const handleSubmit = async () => {
    if (!reason) { showToast('반품 사유를 선택해 주세요', 'error'); return; }
    setLoading(true);
    try {
      await createReturn(Number(orderId), reason, description || undefined, photos.length ? photos : undefined);
      showToast('반품 신청이 완료되었습니다', 'success');
      navigate(`/orders/${orderId}`);
    } catch { showToast('반품 신청에 실패했습니다', 'error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">반품 신청 — 주문 #{orderId}</h1>
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">반품 사유 *</label>
          <select value={reason} onChange={e => setReason(e.target.value as ReturnReason)} className="w-full border rounded-lg px-3 py-2" data-testid="return-reason" aria-label="반품 사유">
            <option value="">선택해 주세요</option>
            {Object.entries(RETURN_REASON_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">상세 설명</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={1000} rows={3} className="w-full border rounded-lg px-3 py-2" placeholder="상세 내용을 입력해 주세요" data-testid="return-description" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">사진 첨부 (최대 3장)</label>
          <input type="file" accept="image/jpeg,image/png" multiple onChange={handlePhotoChange} className="text-sm" data-testid="return-photos" />
          {photos.length > 0 && (
            <div className="flex gap-2 mt-2">
              {photos.map((f, i) => (
                <div key={i} className="relative">
                  <img src={URL.createObjectURL(f)} alt={`첨부 ${i + 1}`} className="w-16 h-16 object-cover rounded" />
                  <button onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={handleSubmit} disabled={loading || !reason} className="w-full bg-primary-500 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50" data-testid="return-submit">{loading ? '처리 중...' : '반품 신청'}</button>
      </div>
    </div>
  );
}
