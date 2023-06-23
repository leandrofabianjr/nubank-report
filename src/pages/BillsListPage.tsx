import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNew from '@mui/icons-material/OpenInNew';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import { Bill } from 'nubank-api';
import React from 'react';
import DataTable from 'react-data-table-component';
import { useAuth } from '../hooks/useAuth';
import { Nubank } from '../services/Nubank';
import { Formatters } from '../utils/Formatters';
import BillDetailsPage from './BillDetailsPage';

const BillsListPage = () => {
  const { state } = useAuth();
  const [bills, setBills] = React.useState<Bill[]>([]);
  const [selectedBillLink, setSelectedBillLink] = React.useState<
    string | undefined
  >();
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

  if (selectedBillLink) {
    return (
      <>
        <IconButton onClick={() => setSelectedBillLink(undefined)}>
          <ArrowBackIcon fontSize="inherit" color="primary" />
        </IconButton>
        <BillDetailsPage link={selectedBillLink} />
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
        defaultSortFieldId={1}
        defaultSortAsc={false}
      />
    </main>
  );
};

export default BillsListPage;
