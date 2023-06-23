import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import DataTable from 'react-data-table-component';
import { Bill, useNubank } from '../hooks/useNubank';
import { Formatters } from '../utils/Formatters';

const BillDetailsPage = ({ href }: { href: string }) => {
  const { getBill, loading, error } = useNubank();
  const [bill, setBill] = React.useState<Bill>();

  React.useEffect(() => {
    getBill(href).then(setBill);
  }, []);

  if (loading) {
    return <CircularProgress color="primary" />;
  }

  return (
    <main>
      {error && <div>{error}</div>}
      <div>{JSON.stringify(bill?.summary)}</div>
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
