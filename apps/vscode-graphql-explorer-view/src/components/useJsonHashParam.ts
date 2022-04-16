import { useMemo } from 'react';
import useHashParam from 'use-hash-param';

export const useJsonHashParam = (
  name: string,
  defaultValue: Record<string, any>
) => {
  const defaultAsString = JSON.stringify(defaultValue);

  const [params, setParams] = useHashParam(name, defaultAsString);

  const paramsAsJson = useMemo(() => {
    try {
      return JSON.parse(params);
    } catch (error) {
      return {};
    }
  }, []);

  const setParamsToString = (params: Record<string, any>) => {
    setParams(JSON.stringify(params));
  };

  return [paramsAsJson, setParamsToString];
};
