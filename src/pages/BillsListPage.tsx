import { Tab, Tabs } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import { Bill, useNubank } from '../hooks/useNubank';
import { Formatters } from '../utils/Formatters';
import BillDetailsPage from './BillDetailsPage';

const BillsListPage = () => {
  const { getBillsSummary, loading, error } = useNubank();
  const [bills, setBills] = React.useState<Bill[]>([]);
  const [selectedBillIndex, setSelectedBillIndex] = React.useState(0);

  React.useEffect(() => {
    getBillsSummary().then((res) => {
      const selectableBills = res
        .filter((b) => b?._links?.self?.href);
      setBills(selectableBills);
      setSelectedBillIndex(selectableBills.findIndex((b) => b.state == 'open'));
    });
  }, []);

  if (loading) {
    return <CircularProgress color="primary" />;
  }

  return (
    <main>
      {error && <div>{error}</div>}
      <Tabs
        value={selectedBillIndex}
        onChange={(_, index) => setSelectedBillIndex(index)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        {bills
          .filter((b) => b?._links?.self?.href)
          .map((b, index) => (
            <Tab
              key={b.summary.close_date}
              label={Formatters.date(b.summary.close_date)}
              value={index}
            />
          ))}
      </Tabs>
      <BillDetailsPage bill={bills[selectedBillIndex]} />
      {/* <DataTable
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
            cell: (row: Bill) =>
              row._links.self?.href && (
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
      /> */}
    </main>
  );
};

export default BillsListPage;
