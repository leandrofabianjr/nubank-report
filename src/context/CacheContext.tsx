import React from 'react';
import { AuthState, Bill, Transaction } from '../hooks/useNubank';

interface CacheContextProps {
  state?: AuthState;
  setState: (value?: AuthState) => void;
  transactions?: Transaction[];
  setTransactions: (value?: Transaction[]) => void;
  bills?: Bill[];
  setBills: (value?: Bill[]) => void;
}

export const CacheContext = React.createContext<CacheContextProps>({
  state: undefined,
  setState: () => undefined,
  transactions: undefined,
  setTransactions: () => undefined,
  bills: undefined,
  setBills: () => undefined,
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

  const [transactions, setTransactions] = React.useState<
    Transaction[] | undefined
  >();
  const [bills, setBills] = React.useState<Bill[] | undefined>();

  return (
    <CacheContext.Provider
      value={{
        state,
        setState,
        transactions,
        setTransactions,
        bills,
        setBills,
      }}
    >
      {children}
    </CacheContext.Provider>
  );
};
