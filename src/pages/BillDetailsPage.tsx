import CircularProgress from '@mui/material/CircularProgress';
import { Bill } from 'nubank-api';
import React from 'react';
import DataTable from 'react-data-table-component';
import { useAuth } from '../hooks/useAuth';
import { Nubank } from '../services/Nubank';
import { Formatters } from '../utils/Formatters';

const BillDetailsPage = ({ link }: { link: string }) => {
  const { state } = useAuth();
  const [bill, setBill] = React.useState<Bill>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState();

  const getBillDetails = React.useCallback(async () => {
    try {
      const nb = new Nubank(state);
      setBill(await nb.cardBillDetails(link));
      setLoading(false);
    } catch (e: any) {
      setError(e.toString());
    }
  }, []);

  React.useEffect(() => {
    getBillDetails();
  }, []);

  if (loading) {
    return <CircularProgress color="primary" />;
  }

  return (
    <main>
      {error && <div>{error}</div>}
      <DataTable
        pagination
        progressPending={loading}
        columns={[
          {
            name: 'Data',
            sortable: true,
            selector: (row) => row?.post_date,
            format: (row) => Formatters.date(row?.post_date),
          },
          {
            name: 'Valor',
            sortable: true,
            selector: (row) => row?.amount,
            format: (row) => Formatters.currency(row?.amount),
          },
          {
            name: 'Descrição',
            sortable: true,
            selector: (row) => row?.title,
          },
        ]}
        data={bill?.line_items ?? []}
        defaultSortFieldId={1}
        defaultSortAsc={false}
      />
    </main>
  );
};

export default BillDetailsPage;
