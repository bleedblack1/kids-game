type AppErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type ErrorReporter = (
  error: unknown,
  context?: Record<string, unknown>,
  options?: AppErrorOptions,
) => void;

let reporter: ErrorReporter | undefined;

// Wire up an external error-tracking service (e.g. Sentry) here if needed.
export function setErrorReporter(fn: ErrorReporter) {
  reporter = fn;
}

export function reportAppError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const fullContext = {
    source: "react_error_boundary",
    route: window.location.pathname,
    ...context,
  };
  if (reporter) {
    reporter(error, fullContext, {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    });
  } else {
    console.error("[app-error]", error, fullContext);
  }
}
