import React from 'react';
import { CacheContext } from '../context/CacheContext';

export const useAuth = () => {
  const context = React.useContext(CacheContext);

  if (!context) {
    console.error('Contexto de autentcação não encontrado.');
  }

  return context;
};
