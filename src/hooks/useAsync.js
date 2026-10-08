import { useState, useCallback, useEffect } from 'react';

/**
 * useAsync hook for managing asynchronous operations with loading and error states
 * @param {Function} asyncFunction
 * @param {boolean} immediate
 * @returns {{ execute: Function, status: string, value: any, error: any, loading: boolean }}
 */
export function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    (...params) => {
      setStatus('pending');
      setValue(null);
      setError(null);

      return asyncFunction(...params)
        .then((response) => {
          setValue(response);
          setStatus('success');
          return response;
        })
        .catch((err) => {
          setError(err);
          setStatus('error');
          throw err;
        });
    },
    [asyncFunction]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    value,
    error,
    loading: status === 'pending',
  };
}
