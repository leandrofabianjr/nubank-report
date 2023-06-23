import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
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

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    flexGrow: 1,
  }));

  const bs = bill?.summary;

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
                <b>Valor:</b>
              </div>
              {Formatters.currency(bs.total_balance / 100)}
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
