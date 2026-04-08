export default function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="flex justify-center gap-1 mt-6" aria-label="페이지 네비게이션">
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="px-3 py-1 rounded border disabled:opacity-40" aria-label="이전 페이지">‹</button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onPageChange(p)} className={`px-3 py-1 rounded border ${p === page ? 'bg-primary-500 text-white border-primary-500' : 'hover:bg-gray-100'}`} aria-current={p === page ? 'page' : undefined}>{p}</button>
      ))}
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="px-3 py-1 rounded border disabled:opacity-40" aria-label="다음 페이지">›</button>
    </nav>
  );
}
