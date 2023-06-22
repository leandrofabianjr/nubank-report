import { Box, Tab, Tabs } from '@mui/material';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/AuthPage';
import TransactionsListPage from './pages/TransactionsListPage';
import React from 'react';

function App() {
  const { state } = useAuth();
  const [tabIndex, setTabIndex] = React.useState(0);

  const tabs = [
    <TransactionsListPage />,
    <>1</>,
    <>2</>,
  ];

  return (
    <>
      <h1>Nubank Report</h1>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={(_, index) => setTabIndex(index)} >
          <Tab label="Transações" value="0" />
          <Tab label="Item Two" value="1" />
          <Tab label="Item Three" value="2" />
        </Tabs>
      </Box>
      {!state && <AuthPage />}
      {state && tabs[tabIndex]}
    </>
  );
}

export default App;
