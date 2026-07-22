import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="container py-5 text-center">
          <h2 className="text-danger mb-4">Bir şeyler yanlış gitti / Something went wrong</h2>
          <p className="text-secondary mb-4">Sayfayı yenilemeyi deneyin / Try refreshing the page.</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Yenile / Refresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
