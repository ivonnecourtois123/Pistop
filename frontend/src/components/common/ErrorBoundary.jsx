import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
          <div className="max-w-md rounded-2xl border border-error bg-error-container/20 p-6 text-on-surface card-elevation">
            <span className="material-symbols-outlined text-4xl text-error" data-icon="error">
              error
            </span>
            <h2 className="mt-3 font-headline-md text-lg font-bold text-primary">
              Ocurrió un inconveniente al renderizar esta vista
            </h2>
            <p className="mt-2 text-xs text-on-surface-variant">
              {this.state.error?.message || 'Error inesperado en los componentes visuales.'}
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="mt-5 rounded-xl bg-primary px-5 py-2 font-label-caps text-xs font-bold text-on-primary hover:bg-primary/90"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
