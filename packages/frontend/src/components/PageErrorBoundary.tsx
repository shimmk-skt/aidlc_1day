import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export default class PageErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
      <div className="flex items-center justify-center p-12" role="alert">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">이 페이지를 불러올 수 없습니다</p>
          <button onClick={() => this.setState({ hasError: false })} className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition" data-testid="page-error-retry">다시 시도</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}
