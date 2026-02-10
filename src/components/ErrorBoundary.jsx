import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.state = { hasError: true, error, errorInfo };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-900 text-white p-8">
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-4xl font-bold text-red-500 mb-4">⚠️ Error en el Wizard</h1>
                        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 mb-4">
                            <h2 className="text-xl font-bold mb-2">Error:</h2>
                            <pre className="text-sm overflow-auto bg-black/50 p-4 rounded">
                                {this.state.error && this.state.error.toString()}
                            </pre>
                        </div>
                        {this.state.errorInfo && (
                            <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                                <h2 className="text-xl font-bold mb-2">Stack Trace:</h2>
                                <pre className="text-xs overflow-auto bg-black/50 p-4 rounded">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </div>
                        )}
                        <button
                            onClick={() => window.location.href = '/'}
                            className="mt-6 bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400"
                        >
                            Volver al inicio
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
