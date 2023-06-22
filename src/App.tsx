import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/AuthPage';
import TransactionsListPage from './pages/TransactionsListPage';

function App() {
  const { state } = useAuth();

  return (
    <>
      <h1>Nubank Report</h1>
      {!state && <AuthPage />}
      {state && <TransactionsListPage />}
    </>
  );
}

export default App;
