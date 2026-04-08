import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export default class GlobalErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" role="alert">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">문제가 발생했습니다</h1>
          <p className="text-gray-600 mb-6">예상치 못한 오류가 발생했습니다.</p>
          <button onClick={() => window.location.reload()} className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition" data-testid="error-reload">새로고침</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}
