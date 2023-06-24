import React from 'react';
import { useCache } from './useCache';

const DISCOVERY_URL =
  'https://prod-s0-webapp-proxy.nubank.com.br/api/discovery';

const DISCOVERY_APP_URL =
  'https://prod-s0-webapp-proxy.nubank.com.br/api/app/discovery';

export interface Href {
  href: string;
}

export interface SelfHref {
  self: Href;
}

export interface AuthState {
  access_token: string;
  _links: {
    bills_summary: Href;
    events: Href;
  };
}

export interface BillSummary {
  remaining_balance?: number;
  due_date: string;
  close_date: string;
  late_interest_fee?: string;
  past_balance: number;
  late_fee?: string;
  effective_due_date: string;
  total_balance: number;
  interest_rate: string;
  interest: number;
  total_cumulative: number;
  paid: number;
  minimum_payment: number;
  remaining_minimum_payment?: number;
  open_date: string;
}

interface BillLineItem {
  amount: number;
  index?: number;
  title: string;
  post_date: string;
  id: string;
  href?: string;
  category?: string;
  charges?: number;
  transaction?: Transaction;
}

export interface Bill {
  id?: string;
  state: 'overdue' | 'open' | 'future' | 'closed';
  summary: BillSummary;
  _links: SelfHref;
  line_items?: BillLineItem[];
}

interface TransactionCharges {
  count: number;
  amount: number;
}

interface TransactionDetails {
  status?: string;
  tags?: string[];
  lat?: number;
  lon?: number;
  charges?: TransactionCharges;
  subcategory?: string;
}

interface Tag {
  id: string;
  description: string;
}

interface Charge {
  amount: number;
  status: string;
  index: number;
  source: string;
  post_date: string;
}

export interface Transaction {
  description: string;
  title: string;
  details?: TransactionDetails;
  _links?: SelfHref;
  href?: string;
  category: string;
  amount: number;
  tags: Tag[];
  card_last_four_digits: string;
  time: string;
  charges: number;
  original_merchant_name: string;
  mcc: string;
  charges_list: Charge[];
  source: string;
  account: string;
  card: string;
  status: string;
  id: string;
  merchant_name: string;
  event_type: string;
  card_type: string;
  country: string;
}

interface useNubankProps {
  initLoading: boolean;
}

export const useNubank = (props?: useNubankProps) => {
  const cache = useCache();
  const [loading, setLoading] = React.useState(props?.initLoading ?? true);
  const [error, setError] = React.useState();

  const defaultHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${cache.state?.access_token}`,
  });

  const request = async (
    method: string,
    url: string,
    body?: unknown,
    headers?: object
  ) => {
    setLoading(true);
    return fetch(url, {
      method,
      headers: { ...defaultHeaders(), ...headers },
      body: body ? JSON.stringify(body) : null,
      mode: 'no-cors',
    })
      .then(async (res): Promise<any> => {
        if (res.status == 429) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          console.log('tentando novamente', url);
          return await request(method, url, body, headers);
        }

        return res.json();
      })
      .catch((e) => {
        console.log(e);
        setError(e.toString());
      })
      .finally(() => setLoading(false));
  };

  const requestGet = (url: string, headers?: object) =>
    request('GET', url, null, headers);

  const requestPost = async (url: string, body?: unknown, headers?: object) =>
    request('POST', url, body, headers);

  const authWithQrCode = async (
    qrCode: string,
    cpf: string,
    password: string
  ) => {
    const { login } = await requestGet(DISCOVERY_URL);
    const { lift } = await requestGet(DISCOVERY_APP_URL);

    const { access_token } = await requestPost(login, {
      client_id: 'other.conta',
      client_secret: 'yQPeLzoHuJzlMMSAjC-LgNUJdUecx8XO',
      grant_type: 'password',
      login: cpf,
      password,
    });

    const authState = await requestPost(
      lift,
      {
        qr_code_id: qrCode,
        type: 'login-webapp',
      },
      {
        Authorization: `Bearer ${access_token}`,
      }
    );

    if (!error) {
      cache.setState(authState);
    }
  };

  const getBillsSummary = async (): Promise<Bill[]> => {
    if (cache.bills) return cache.bills;

    const href = cache.state?._links.bills_summary.href ?? '';
    const { bills }: { bills: Bill[] } = await requestGet(href);
    bills.sort((b1, b2) =>
      b1.summary.close_date < b2.summary.close_date ? 1 : -1
    );
    cache.setBills(bills);

    return bills;
  };

  const getBillWithTransactionsDetails = async (b: Bill): Promise<Bill> => {
    const bills = await getBillsSummary();

    const cachedBillIndex = bills.findIndex(
      (cb) => cb._links?.self?.href == b._links?.self?.href
    );

    const href = b._links?.self?.href;
    const { bill }: { bill: Bill } = await requestGet(href);

    const transactions = await getTransactions();

    const items = bill.line_items ?? [];
    for (let i = 0; i < items.length ?? 0; i++) {
      const event = transactions.find((t) => t.href == items[i].href);
      if (event) {
        items[i].transaction = await getTransaction(event);
      }
    }
    bill.line_items = items;
    bills[cachedBillIndex] = bill;
    cache.setBills(bills);

    return bill;
  };

  const getBill = async (b: Bill): Promise<Bill> => {
    const bills = await getBillsSummary();

    const cachedBillIndex = bills.findIndex(
      (cb) => cb._links?.self?.href == b._links?.self?.href
    );
    if (bills[cachedBillIndex].line_items) {
      return bills[cachedBillIndex];
    }

    const href = b._links?.self?.href;
    const { bill }: { bill: Bill } = await requestGet(href);
    bills[cachedBillIndex] = bill;
    cache.setBills(bills);

    return bill;
  };

  const getEvents = async (): Promise<(Transaction | any)[]> => {
    const { events } = await requestGet(cache.state?._links.events.href ?? '');
    return events;
  };

  const getTransactions = async (): Promise<Transaction[]> => {
    if (cache.transactions) return cache.transactions;

    const events = await getEvents();
    const transactions = events.filter((e) => e?.category == 'transaction');
    cache.setTransactions(transactions);

    return transactions;
  };

  const getTransaction = async (t: Transaction): Promise<Transaction> => {
    const transactions = await getTransactions();

    const cachedTransactionIndex = transactions.findIndex(
      (cb) => cb._links?.self?.href == t._links?.self?.href
    );
    if (transactions[cachedTransactionIndex].card_last_four_digits) {
      return transactions[cachedTransactionIndex];
    }

    const { transaction }: { transaction: Transaction } = await requestGet(
      t?._links?.self?.href ?? ''
    );
    transactions[cachedTransactionIndex] = transaction;
    cache.setTransactions(transactions);

    return transaction;
  };

  return {
    loading,
    error,
    authWithQrCode,
    getBillsSummary,
    getBill,
    getEvents,
    getTransactions,
    getTransaction,
    getBillWithTransactionsDetails,
  };
};
