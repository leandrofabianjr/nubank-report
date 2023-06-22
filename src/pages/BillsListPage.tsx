import CircularProgress from '@mui/material/CircularProgress';
import { Bill } from 'nubank-api';
import React from 'react';
import DataTable from 'react-data-table-component';
import { useAuth } from '../hooks/useAuth';
import { Nubank } from '../services/Nubank';
import { Formatters } from '../utils/Formatters';

const BillsListPage = () => {
  const { state } = useAuth();
  const [bills, setBills] = React.useState<Bill[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState();

  const getBills = React.useCallback(async () => {
    try {
      const nb = new Nubank(state);
      setBills(await nb.cardBills());
      setLoading(false);
    } catch (e: any) {
      setError(e.toString());
    }
  }, []);

  React.useEffect(() => {
    getBills();
  }, []);

  if (loading) {
    return <CircularProgress color="primary" />;
  }

  return (
    <main>
      {error && <div>{error}</div>}
      <DataTable
        title="Faturas"
        pagination
        progressPending={loading}
        columns={[
          {
            name: 'Status',
            sortable: true,
            selector: (row: Bill) => row.state,
          },
          {
            name: 'Fechamento',
            sortable: true,
            selector: (row: Bill) => row?.summary?.close_date,
            format: (row: Bill) => Formatters.date(row?.summary?.close_date),
          },
        ]}
        data={bills}
        defaultSortFieldId={1}
        defaultSortAsc={false}
      />
    </main>
  );
};

export default BillsListPage;
