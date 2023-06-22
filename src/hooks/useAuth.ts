import React from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    console.error('Contexto de autentcação não encontrado.');
  }

  return context;
};
