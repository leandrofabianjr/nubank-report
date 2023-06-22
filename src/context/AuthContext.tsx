import React from 'react';

interface AuthContextProps {
  state?: unknown;
  setState: React.Dispatch<React.SetStateAction<unknown>>;
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
  const [state, setState] = React.useState<unknown>();
  return (
    <AuthContext.Provider value={{ state, setState }}>
      {children}
    </AuthContext.Provider>
  );
};
