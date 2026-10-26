import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('App runtime error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#090d16', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }} dir="rtl">
          <h2 style={{ color: '#ea580c', fontSize: '24px', marginBottom: '12px' }}>أبوسليم | ABUSALIM</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>حدث خطأ أثناء تحميل الواجهة، يرجى إعادة تحميل الصفحة.</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: '10px 24px', backgroundColor: '#ea580c', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            إعادة تحميل الموقع
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
