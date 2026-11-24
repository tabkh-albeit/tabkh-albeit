import { Component, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryState {
  hasError: boolean;
}

class AppErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          className="flex min-h-screen flex-col items-center justify-center bg-[#08080a] p-6 text-center text-white"
        >
          <h1 className="text-2xl font-black text-[#ea7ca2]">طبخ البيت</h1>
          <p className="mt-2 text-sm text-[#b8b1c0]">
            حدث خطأ غير متوقع أثناء تحميل الصفحة. يمكنك تحديث الصفحة أو التواصل معنا عبر واتساب.
          </p>
          <a
            href="https://wa.me/966539227842"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 rounded-xl bg-[#ea7ca2] px-5 py-2.5 text-sm font-extrabold text-[#140b0f]"
          >
            تواصل واتساب: 053 922 7842
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);
