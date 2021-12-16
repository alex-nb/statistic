import React from "react";
import ErrorPage from "./ErrorPage/ErrorPage";

type StateToProps = {
  error?: Error;
  errorInfo?: React.ErrorInfo;
};

type State = {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
};

class ErrorBoundary extends React.Component<StateToProps, State> {
  constructor(props: StateToProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo
    });
  }

  render(): React.ReactNode {
    const { hasError, error, errorInfo } = this.state;

    if (hasError) {
      return <ErrorPage message={error && error.toString()} describeMessage={errorInfo && errorInfo.componentStack} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
