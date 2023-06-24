import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import React from 'react';
import DataTable from 'react-data-table-component';
import { Bill, useNubank } from '../hooks/useNubank';
import { Formatters } from '../utils/Formatters';
import { Button } from '@mui/base';

const BillDetailsPage = ({ bill: _bill }: { bill: Bill }) => {
  const {
    getBill,
    loading,
    error,
    getTransactions,
    getBillWithTransactionsDetails,
  } = useNubank();
  const [bill, setBill] = React.useState<Bill>();

  React.useEffect(() => {
    getTransactions().then(() => getBill(_bill).then(setBill));
  }, [_bill]);

  const handleGetBillWithTransactionsDetails = () => {
    getBillWithTransactionsDetails(_bill).then(setBill);
  };

  if (loading) {
    return <CircularProgress color="primary" />;
  }

  const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'center',
    flexGrow: 1,
  }));

  const bs = bill?.summary;

  const cards: { [card: string]: number } = {};
  bill?.line_items?.forEach((i) => {
    const card = i.transaction?.card_last_four_digits;
    if (card) {
      cards[card] = cards[card] ?? 0;
      cards[card] += i.amount;
    }
  });

  return (
    <main>
      <h1>Detalhes da Fatura</h1>
      {error && <div>{error}</div>}
      {bs && (
        <Box>
          <Stack
            direction="row"
            useFlexGap
            justifyContent="center"
            alignItems="center"
            spacing={2}
            margin={2}
          >
            <Item>
              <div>
                <b>Valores:</b>
              </div>
              {Object.keys(cards).map((k) => (
                <div>
                  Cartão {k}: {Formatters.currency(cards[k] / 100)}
                </div>
              ))}
              Total: {Formatters.currency(bs.total_balance / 100)}
            </Item>
            <Item>
              <div>
                <b>Fechamento:</b>
              </div>
              {Formatters.date(bs.close_date)}
            </Item>
            <Item>
              <div>
                <b>Vencimento:</b>
              </div>
              {Formatters.date(bs.due_date)}
            </Item>
          </Stack>
        </Box>
      )}
      {!Object.keys(cards).length && (
        <Button onClick={handleGetBillWithTransactionsDetails}>
          Carregar detalhes das transações
        </Button>
      )}
      <DataTable
        title="Transações da fatura"
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
            format: (row) => Formatters.currency(row?.amount / 100),
          },
          {
            name: 'Descrição',
            sortable: true,
            selector: (row) => row?.title,
          },
          {
            name: 'Cartão',
            sortable: true,
            selector: (row) => row?.transaction?.card_last_four_digits ?? '',
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
