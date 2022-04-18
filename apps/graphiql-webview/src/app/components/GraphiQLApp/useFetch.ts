import { useCallback, useMemo } from 'react';
import type { ComponentProps } from 'react';
import GraphiQL from 'graphiql';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import crossFetch from 'cross-fetch';
type UseFetchProps = {
  token?: string;
  url?: string;
};
type Fetcher = ComponentProps<typeof GraphiQL>['fetcher'];

const DEFAULT_HEADERS = {
  accept: 'application/json',
  'content-type': 'application/json',
};

export function useFetch({ token, url }: UseFetchProps): Fetcher | undefined {
  const fetcher = useCallback(
    (url, { body, method }) => {
      const headers = {
        ...DEFAULT_HEADERS,
        ...((!!token && { authorization: `Bearer ${token}` }) || {}),
      };

      return crossFetch(url, {
        method,
        headers,
        body,
      });
    },
    [token, url]
  );

  return useMemo(() => {
    if (!url) return;
    return createGraphiQLFetcher({
      url,
      fetch: fetcher,
    });
  }, [token, url]);
}
