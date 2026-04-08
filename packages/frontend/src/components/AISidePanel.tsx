import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAIPanel } from '../context/AIPanelContext';
import { askAI } from '../api/ai';
import { useForecast } from '../hooks/queries/useForecast';
import { useUserRecommendations } from '../hooks/queries/useRecommendations';
import { useProducts } from '../hooks/queries/useProducts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatCurrency } from '../utils/format';
import type { AIChatMessage } from '../types/ai';
import { Link } from 'react-router-dom';

export default function AISidePanel() {
  const { isOpen, activeTab, close, setActiveTab } = useAIPanel();
  const { user } = useAuth();
  if (!isOpen) return null;

  const isAdmin = user?.role === 'admin';
  const tabs = isAdmin ? (['chat', 'forecast', 'recommendations'] as const) : (['recommendations'] as const);
  const tabLabels = { chat: 'Q&A', forecast: '수요 예측', recommendations: '추천' };

  return (
    <div className="fixed inset-0 z-40 flex justify-end" role="dialog" aria-label="AI 어시스턴트">
      <div className="absolute inset-0 bg-black/30" onClick={close} />
      <div className="relative w-full max-w-sm lg:max-w-md bg-white shadow-2xl flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg">🤖 AI 어시스턴트</h2>
          <button onClick={close} className="text-gray-400 hover:text-gray-600" aria-label="닫기" data-testid="ai-panel-close">✕</button>
        </div>
        <div className="flex border-b">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`} data-testid={`ai-tab-${tab}`}>{tabLabels[tab]}</button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'chat' && isAdmin && <ChatTab />}
          {activeTab === 'forecast' && isAdmin && <ForecastTab />}
          {activeTab === 'recommendations' && <RecommendationsTab userId={user?.id} />}
        </div>
      </div>
    </div>
  );
}

function ChatTab() {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: AIChatMessage = { role: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const { answer } = await askAI(input);
      setMessages(prev => [...prev, { role: 'assistant', content: answer, timestamp: new Date().toISOString() }]);
    } catch { setMessages(prev => [...prev, { role: 'assistant', content: '오류가 발생했습니다. 다시 시도해 주세요.', timestamp: new Date().toISOString() }]); }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-3 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-primary-50 ml-8' : 'bg-gray-100 mr-8'}`}>{m.content}</div>
        ))}
        {loading && <div className="bg-gray-100 p-3 rounded-lg text-sm mr-8 animate-pulse">생각 중...</div>}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="재고에 대해 질문하세요..." className="flex-1 border rounded-lg px-3 py-2 text-sm" data-testid="ai-chat-input" aria-label="AI 질문 입력" />
        <button onClick={handleSend} disabled={loading} className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50" data-testid="ai-chat-send">전송</button>
      </div>
    </div>
  );
}

function ForecastTab() {
  const { data: products } = useProducts();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: forecast } = useForecast(selectedId);

  return (
    <div>
      <select value={selectedId ?? ''} onChange={e => setSelectedId(Number(e.target.value) || null)} className="w-full border rounded-lg px-3 py-2 text-sm mb-4" data-testid="forecast-product-select" aria-label="상품 선택">
        <option value="">상품을 선택하세요</option>
        {products?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      {forecast && (
        <div>
          <p className="text-sm text-gray-600 mb-2">현재 재고: {forecast.currentStock} | 재주문 포인트: {forecast.reorderPoint}</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={forecast.dailyForecast}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="quantity" stroke="#667eea" strokeWidth={2} />
              <ReferenceLine y={forecast.reorderPoint} stroke="red" strokeDasharray="3 3" label="ROP" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function RecommendationsTab({ userId }: { userId?: number }) {
  const { data: recs } = useUserRecommendations(userId);
  if (!recs?.length) return <p className="text-gray-500 text-sm">추천 상품이 없습니다.</p>;
  return (
    <div className="space-y-3">
      {recs.map(r => (
        <Link key={r.productId} to={`/products/${r.productId}`} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
          <img src={r.product.imageUrl} alt={r.product.name} className="w-12 h-12 object-cover rounded" loading="lazy" />
          <div>
            <p className="text-sm font-medium">{r.product.name}</p>
            <p className="text-xs text-gray-500">{formatCurrency(r.product.price)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
