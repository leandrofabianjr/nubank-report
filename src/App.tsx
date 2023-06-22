import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/AuthPage';
import ReportPage from './pages/ReportPage';

function App() {
  const { state } = useAuth();

  return (
    <>
      <h1>Nubank Report</h1>
      {!state && <AuthPage />}
      {state && <ReportPage />}
    </>
  );
}

export default App;
