import * as React from 'react';
import styles from './index.less';
import { ErrorInfo } from 'react';

interface FErrorBoundaryProps {
  // children: React.ReactChildren;
}

interface FErrorBoundaryStates {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class FErrorBoundary extends React.Component<FErrorBoundaryProps, FErrorBoundaryStates> {
  constructor(props: FErrorBoundaryProps) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (<div>
        <h2>Something went wrong.</h2>
        <details style={{ whiteSpace: 'pre-wrap' }}>
          {this.state.error && this.state.error.toString()}
          <br />
          {this.state.errorInfo.componentStack}
        </details>
      </div>);
    }
    // Normally, just render children
    // @ts-ignore
    return this.props.children;
  }
}

export default FErrorBoundary;
