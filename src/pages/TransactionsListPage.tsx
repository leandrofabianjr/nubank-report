import { CardTransaction } from 'nubank-api';
import React from 'react';
import DataTable from 'react-data-table-component';
import { useAuth } from '../hooks/useAuth';
import { Nubank } from '../services/Nubank';

const TransactionsListPage = () => {
  const { state } = useAuth();
  const [transactions, setTransactions] = React.useState<CardTransaction[]>([]);
  const [error, setError] = React.useState();

  const getTransactions = React.useCallback(async () => {
    try {
      const nb = new Nubank(state);
      setTransactions(await nb.cardTransactions());
    } catch (e: any) {
      setError(e.toString());
    }
  }, []);

  React.useEffect(() => {
    getTransactions();
  }, []);

  return (
    <main>
      {error && <div>{error}</div>}
      <DataTable
        title="Transações"
        pagination
        progressPending={!transactions.length}
        columns={[
          {
            name: 'Hora',
            sortable: true,
            selector: (row: CardTransaction) => row.time,
            format: (row: CardTransaction) =>
              Intl.DateTimeFormat('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short',
                timeZone: 'America/Sao_Paulo',
              }).format(new Date(row.time)),
          },
          {
            name: 'Valor (R$)',
            sortable: true,
            selector: (row: CardTransaction) => row.amount,
            format: (row: CardTransaction) =>
              Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(row.amount / 100),
            right: true,
          },
          {
            sortable: true,
            name: 'Descrição',
            selector: (row: CardTransaction) => row.description ?? '',
          },
          {
            sortable: true,
            name: 'Categoria',
            selector: (row: CardTransaction) => row.title,
          },
          {
            sortable: true,
            name: 'Subcategoria',
            selector: (row: CardTransaction) => row.details?.subcategory ?? '',
          },
          {
            sortable: true,
            name: 'Tags',
            selector: (row: CardTransaction) =>
              row.details?.tags?.join(', ') ?? '',
          },
        ]}
        data={transactions}
        defaultSortFieldId={1}
      />
    </main>
  );
};

export default TransactionsListPage;
