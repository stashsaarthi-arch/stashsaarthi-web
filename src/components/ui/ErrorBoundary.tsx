import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reportError } from "@/lib/error-reporting";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  sectionName?: string;
  compact?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, showDetails: false };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Uncaught error in boundary [${this.props.sectionName || "unnamed"}]:`, error, errorInfo);
    reportError(error, {
      section: this.props.sectionName || "unnamed_section",
      componentStack: errorInfo.componentStack,
    });
  }

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      if (this.props.compact) {
        return null;
      }

      const sectionTitle = this.props.sectionName || "This Section";

      return (
        <div className="min-h-[220px] w-full flex items-center justify-center bg-background/50 p-4 my-4">
          <div className="glass max-w-md w-full rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center shadow-2xl">
            <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">
              {sectionTitle} Unavailable
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              A rendering issue occurred in this section. Other parts of the platform remain functional.
            </p>

            {this.state.error && (
              <div className="mb-4 text-left">
                <button
                  type="button"
                  onClick={() => this.setState((s) => ({ showDetails: !s.showDetails }))}
                  className="flex items-center gap-1 text-xs text-red-400/80 hover:text-red-300 transition"
                >
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${this.state.showDetails ? "rotate-180" : ""}`}
                  />
                  <span>Technical details</span>
                </button>
                {this.state.showDetails && (
                  <pre className="mt-2 max-h-32 overflow-auto rounded-lg bg-black/80 p-2.5 text-[11px] font-mono text-red-300 border border-red-500/20">
                    {this.state.error.message || String(this.state.error)}
                    {"\n"}
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full border-white/10 hover:bg-white/5 cursor-pointer text-xs"
              onClick={() => {
                this.setState({ hasError: false, error: null });
              }}
            >
              <RefreshCcw className="mr-2 h-3.5 w-3.5" />
              Retry Section
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

