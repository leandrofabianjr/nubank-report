import React from 'react';
import { AuthState } from '../hooks/useNubank';

interface AuthContextProps {
  state?: AuthState;
  setState: (value?: AuthState) => void;
}

export const AuthContext = React.createContext<AuthContextProps>({
  state: undefined,
  setState: () => undefined,
});

export const AuthContextProvider = ({
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
    localStorage.setItem('authState', JSON.stringify(state));
    _setState(value);
  };

  return (
    <AuthContext.Provider value={{ state, setState }}>
      {children}
    </AuthContext.Provider>
  );
};
