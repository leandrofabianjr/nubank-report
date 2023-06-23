import React from 'react';
import { AuthState } from '../hooks/useNubank';

interface AuthContextProps {
  state?: AuthState;
  setState: React.Dispatch<React.SetStateAction<AuthState | undefined>>;
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
  const [state, setState] = React.useState<AuthState | undefined>(() => {
    const state = localStorage.getItem('authState');
    return state ? JSON.parse(state) : undefined;
  });
  return (
    <AuthContext.Provider value={{ state, setState }}>
      {children}
    </AuthContext.Provider>
  );
};
