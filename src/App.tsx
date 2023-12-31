import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { useCache } from './hooks/useCache';
import AuthPage from './pages/AuthPage';
import BillsListPage from './pages/BillsListPage';
import TransactionsListPage from './pages/TransactionsListPage';

function App() {
  const { state } = useCache();

  if (!state) {
    return <AuthPage />;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to='bills' />} />
          <Route path="bills" element={<BillsListPage />} />
          <Route path="transactions" element={<TransactionsListPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
