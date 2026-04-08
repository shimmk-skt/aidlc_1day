import { useState } from 'react';
import { useAddresses } from '../hooks/queries/useAddresses';
import { createAddress, deleteAddress, setDefaultAddress } from '../api/addresses';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Address } from '../types/address';
import { validatePhone, validateRequired } from '../utils/validation';

declare global { interface Window { daum: any; } }

export default function AddressList() {
  const { data: addresses, isLoading } = useAddresses();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', zipCode: '', address: '', addressDetail: '', isDefault: false });

  const handleDaumSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data: any) => setForm(p => ({ ...p, zipCode: data.zonecode, address: data.roadAddress })),
    }).open();
  };

  const handleSubmit = async () => {
    const nameErr = validateRequired(form.name, '수령인'); if (nameErr) { showToast(nameErr, 'error'); return; }
    const phoneErr = validatePhone(form.phone); if (phoneErr) { showToast(phoneErr, 'error'); return; }
    if (!form.zipCode) { showToast('우편번호를 검색해 주세요', 'error'); return; }
    const detailErr = validateRequired(form.addressDetail, '상세 주소'); if (detailErr) { showToast(detailErr, 'error'); return; }
    try {
      await createAddress(form);
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setShowForm(false);
      setForm({ name: '', phone: '', zipCode: '', address: '', addressDetail: '', isDefault: false });
      showToast('주소가 추가되었습니다', 'success');
    } catch { showToast('주소 추가에 실패했습니다', 'error'); }
  };

  if (isLoading) return <div className="flex justify-center p-12"><LoadingSpinner /></div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">주소록</h1>
        <button onClick={() => setShowForm(true)} className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm" data-testid="address-add">주소 추가</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-lg border p-6 mb-4">
          <div className="grid gap-3">
            <div><label className="block text-sm font-medium mb-1">수령인</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full border rounded-lg px-3 py-2" data-testid="address-name" /></div>
            <div><label className="block text-sm font-medium mb-1">전화번호</label><input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="010-0000-0000" className="w-full border rounded-lg px-3 py-2" data-testid="address-phone" /></div>
            <div className="flex gap-2"><input value={form.zipCode} readOnly placeholder="우편번호" className="flex-1 border rounded-lg px-3 py-2 bg-gray-50" /><button onClick={handleDaumSearch} className="bg-gray-200 px-4 py-2 rounded-lg text-sm" data-testid="address-search-zip">우편번호 검색</button></div>
            <div><input value={form.address} readOnly placeholder="도로명 주소" className="w-full border rounded-lg px-3 py-2 bg-gray-50" /></div>
            <div><input value={form.addressDetail} onChange={e => setForm(p => ({ ...p, addressDetail: e.target.value }))} placeholder="상세 주소" className="w-full border rounded-lg px-3 py-2" data-testid="address-detail" /></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isDefault} onChange={e => setForm(p => ({ ...p, isDefault: e.target.checked }))} />기본 주소로 설정</label>
            <div className="flex gap-2"><button onClick={handleSubmit} className="bg-primary-500 text-white px-4 py-2 rounded-lg" data-testid="address-save">저장</button><button onClick={() => setShowForm(false)} className="border px-4 py-2 rounded-lg">취소</button></div>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {addresses?.map(a => (
          <div key={a.id} className="bg-white rounded-lg border p-4" data-testid={`address-card-${a.id}`}>
            <div className="flex items-center justify-between">
              <p className="font-medium">{a.name} {a.isDefault && <span className="text-xs bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded ml-1">기본</span>}</p>
              <div className="flex gap-2">
                {!a.isDefault && <button onClick={async () => { await setDefaultAddress(a.id); queryClient.invalidateQueries({ queryKey: ['addresses'] }); }} className="text-xs text-primary-500">기본 설정</button>}
                <button onClick={async () => { await deleteAddress(a.id); queryClient.invalidateQueries({ queryKey: ['addresses'] }); showToast('주소가 삭제되었습니다', 'success'); }} className="text-xs text-red-500" data-testid={`address-delete-${a.id}`}>삭제</button>
              </div>
            </div>
            <p className="text-sm text-gray-600">{a.address} {a.addressDetail}</p>
            <p className="text-sm text-gray-500">{a.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
