import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNew from '@mui/icons-material/OpenInNew';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import DataTable from 'react-data-table-component';
import { Bill, useNubank } from '../hooks/useNubank';
import { Formatters } from '../utils/Formatters';
import BillDetailsPage from './BillDetailsPage';

const BillsListPage = () => {
  const { getBillsSummary, loading, error } = useNubank();
  const [bills, setBills] = React.useState<Bill[]>([]);
  const [selectedBillLink, setSelectedBillLink] = React.useState<
    string | undefined
  >();

  React.useEffect(() => {
    getBillsSummary().then((res) => setBills(res));
  }, []);

  if (loading) {
    return <CircularProgress color="primary" />;
  }

  if (selectedBillLink) {
    return (
      <>
        <IconButton onClick={() => setSelectedBillLink(undefined)}>
          <ArrowBackIcon fontSize="inherit" color="primary" />
        </IconButton>
        <BillDetailsPage href={selectedBillLink} />
      </>
    );
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
            name: 'Fechamento',
            sortable: true,
            selector: (row: Bill) => row?.summary?.close_date,
            format: (row: Bill) => Formatters.date(row?.summary?.close_date),
          },
          {
            name: 'Status',
            sortable: true,
            selector: (row: Bill) => row.state,
          },
          {
            button: true,
            cell: (row: Bill) => (
              <IconButton
                aria-label="delete"
                size="small"
                onClick={() => setSelectedBillLink(row._links.self?.href)}
              >
                <OpenInNew fontSize="inherit" color="primary" />
              </IconButton>
            ),
          },
        ]}
        data={bills}
        defaultSortFieldId={0}
        defaultSortAsc={false}
      />
    </main>
  );
};

export default BillsListPage;
