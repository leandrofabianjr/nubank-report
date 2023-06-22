import { Box, Tab, Tabs } from '@mui/material';
import React from 'react';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/AuthPage';
import BillsListPage from './pages/BillsListPage';
import TransactionsListPage from './pages/TransactionsListPage';

function App() {
  const { state } = useAuth();
  const [tabIndex, setTabIndex] = React.useState(0);

  if (!state) {
    return <AuthPage />;
  }

  const tabs = [<BillsListPage />, <TransactionsListPage />, <>2</>];

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={+tabIndex} onChange={(_, index) => {
          console.log(index);
          setTabIndex(index);
        }}>
          <Tab label="Faturas" value="0" />
          <Tab label="Transações" value="1" />
        </Tabs>
      </Box>
      {tabs[tabIndex]}
    </>
  );
}

export default App;
