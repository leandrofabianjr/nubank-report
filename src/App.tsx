import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/AuthPage';
import BillsListPage from './pages/BillsListPage';
import TransactionsListPage from './pages/TransactionsListPage';

function App() {
  const { state } = useAuth();

  if (!state) {
    return <AuthPage />;
  }

  return (
    <>
    <h1>Ok</h1>
      {/* <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to='bills' />} />
          <Route path="bills" element={<BillsListPage />} />
          <Route path="transactions" element={<TransactionsListPage />} />
        </Routes>
      </BrowserRouter> */}
    </>
  );
}

export default App;
