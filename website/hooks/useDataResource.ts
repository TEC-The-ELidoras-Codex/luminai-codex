"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface DataResourceState<T> {
  readonly data?: T;
  readonly loading: boolean;
  readonly error?: Error;
}

export function useDataResource<T>(loader: () => Promise<T>) {
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const [{ data, loading, error }, setState] = useState<DataResourceState<T>>({
    loading: true,
  });

  const refresh = useCallback(async () => {
    setState((prev) => ({ data: prev.data, loading: true }));
    try {
      const result = await loaderRef.current();
      setState({ data: result, loading: false });
    } catch (err) {
      setState({
        data: undefined,
        loading: false,
        error: err instanceof Error ? err : new Error("Unknown error"),
      });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setState({ loading: true });
      try {
        const result = await loaderRef.current();
        if (!cancelled) {
          setState({ data: result, loading: false });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            loading: false,
            error: err instanceof Error ? err : new Error("Unknown error"),
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error, refresh } as const;
}
