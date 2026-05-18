import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ background: '#0a0a0a', color: '#f87171', padding: '40px', fontFamily: 'monospace', minHeight: '100vh' }}>
          <h1 style={{ color: '#ef4444', marginBottom: '16px' }}>Runtime Error</h1>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #ef4444' }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
