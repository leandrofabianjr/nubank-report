import React from 'react';
import { AuthState } from '../hooks/useNubank';

interface CacheContextProps {
  state?: AuthState;
  setState: (value?: AuthState) => void;
}

export const CacheContext = React.createContext<CacheContextProps>({
  state: undefined,
  setState: () => undefined,
});

export const CacheContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, _setState] = React.useState<AuthState | undefined>(() => {
    const state = localStorage.getItem('authState');
    try {
      return state ? JSON.parse(state) : undefined;
    } catch {
      return undefined;
    }
  });

  const setState = (value?: AuthState) => {
    if (value) {
      localStorage.setItem('authState', JSON.stringify(value));
    }
    _setState(value);
  };

  return (
    <CacheContext.Provider value={{ state, setState }}>
      {children}
    </CacheContext.Provider>
  );
};
