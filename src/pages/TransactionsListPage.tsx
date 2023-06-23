import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import DataTable from 'react-data-table-component';
import { Transaction, useNubank } from '../hooks/useNubank';
import { Formatters } from '../utils/Formatters';

const TransactionsListPage = () => {
  const { getTransactions, loading, error } = useNubank();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

  React.useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  if (loading) {
    return <CircularProgress color="primary" />;
  }

  return (
    <main>
      {error && <div>{error}</div>}
      <DataTable
        title="Transações"
        pagination
        progressPending={loading}
        columns={[
          {
            name: 'Hora',
            sortable: true,
            selector: (row: Transaction) => row.time,
            format: (row: Transaction) => Formatters.dateWithHour(row.time),
          },
          {
            name: 'Valor (R$)',
            sortable: true,
            selector: (row: Transaction) => row.amount,
            format: (row: Transaction) => Formatters.currency(row.amount / 100),
            right: true,
          },
          {
            sortable: true,
            name: 'Descrição',
            selector: (row: Transaction) => row.description ?? '',
          },
          {
            sortable: true,
            name: 'Categoria',
            selector: (row: Transaction) => row.title,
          },
          {
            sortable: true,
            name: 'Subcategoria',
            selector: (row: Transaction) => row.details?.subcategory ?? '',
          },
          {
            sortable: true,
            name: 'Tags',
            selector: (row: Transaction) => row.details?.tags?.join(', ') ?? '',
          },
        ]}
        data={transactions}
        defaultSortFieldId={1}
        defaultSortAsc={false}
      />
    </main>
  );
};

export default TransactionsListPage;
