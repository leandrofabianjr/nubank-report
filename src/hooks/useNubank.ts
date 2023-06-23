import React from 'react';
import { useAuth } from './useAuth';

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

export interface Transaction {
  description: string;
  category: string;
  amount: number;
  time: string;
  source: string;
  title: string;
  id: string;
  details?: TransactionDetails;
  _links?: SelfHref;
  href?: string;
}

interface useNubankProps {
  initLoading: boolean;
}

export const useNubank = (props?: useNubankProps) => {
  const { state, setState } = useAuth();
  const [loading, setLoading] = React.useState(props?.initLoading ?? true);
  const [error, setError] = React.useState();

  const defaultHeaders = () => ({
    'Content-Type': 'application/json',
    'User-Agent': 'nubank-api - https://github.com/fmsouza/nubank-api',
    'X-Correlation-Id': 'WEB-APP.pewW9',
    Authorization: `Bearer ${state?.access_token}`,
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
    })
      .then((res) => res.json())
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
      setState(authState);
    }
  };

  const getBillsSummary = async (): Promise<Bill[]> => {
    const { bills } = await requestGet(state?._links.bills_summary.href ?? '');
    return bills;
  };

  const getBill = async (href: string): Promise<Bill> => {
    const { bill } = await requestGet(href);
    return bill;
  };

  const getEvents = async (): Promise<(Transaction | any)[]> => {
    const { events } = await requestGet(state?._links.events.href ?? '');
    return events;
  };

  const getTransactions = async (): Promise<Transaction[]> => {
    const events = await getEvents();
    return events.filter((e) => e?.category == 'transaction');
  };

  return {
    loading,
    error,
    authWithQrCode,
    getBillsSummary,
    getBill,
    getEvents,
    getTransactions,
  };
};
