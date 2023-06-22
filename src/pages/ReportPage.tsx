import React from 'react';
import { useAuth } from '../hooks/useAuth';

const ReportPage = () => {
  const { state } = useAuth();

  return <div>{JSON.stringify(state)}</div>;
};

export default ReportPage;
