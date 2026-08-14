import React from "react";

/**
 * Catches render errors so one broken component cannot blank the whole page.
 * Still a class: getDerivedStateFromError/componentDidCatch have no hook
 * equivalent in React 19.
 *
 * `fallback` renders in place of the children that failed. Kept deliberately
 * dumb -- if the fallback itself can throw, the boundary has no one to catch it.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    console.error(`[${this.props.name ?? "app"}] render failed`, error, info);
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export default ErrorBoundary;
