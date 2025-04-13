import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log the error to your error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 rounded-xl p-6 text-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-4 text-red-500"
          >
            <AlertTriangle size={32} />
          </motion.div>
          
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            Something went wrong
          </h3>
          
          <p className="text-sm text-red-600 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </motion.button>

          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details className="mt-4 text-left">
              <summary className="text-sm text-red-600 cursor-pointer hover:text-red-700">
                Error Details
              </summary>
              <pre className="mt-2 p-4 bg-red-100 rounded-lg text-xs text-red-800 overflow-auto">
                {this.state.error?.toString()}
                {'\n'}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;