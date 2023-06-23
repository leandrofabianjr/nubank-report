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

interface useNubankProps {
  initLoading: boolean;
}

export const useNubank = (props?: useNubankProps) => {
  const { state, setState } = useAuth();
  const [loading, setLoading] = React.useState(props?.initLoading ?? true);

  const defaultHeaders = () => ({
    'Content-Type': 'application/json',
    'User-Agent': 'nubank-api - https://github.com/fmsouza/nubank-api',
    'X-Correlation-Id': 'WEB-APP.pewW9',
    Authorization: `Bearer ${state?.access_token}`,
  });

  const requestGet = (url: string) => {
    return fetch(url, {
      method: 'GET',
      headers: defaultHeaders(),
    }).then((res) => res.json());
  };

  const requestPost = async (url: string, body?: unknown, headers?: object) => {
    return fetch(url, {
      method: 'POST',
      headers: { ...defaultHeaders(), ...headers },
      body: body ? JSON.stringify(body) : null,
    }).then((res) => res.json());
  };

  const authWithQrCode = async (
    qrCode: string,
    cpf: string,
    password: string
  ) => {
    setLoading(true);
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

    setState(authState);
    setLoading(false);
  };

  const getBillsSummary = async (): Promise<Bill[]> => {
    setLoading(true);
    const { bills } = await requestGet(state?._links.bills_summary.href ?? '');
    setLoading(false);
    return bills;
  };

  const getBill = async (href: string): Promise<Bill> => {
    setLoading(true);
    const { bill } = await requestGet(href);
    setLoading(false);
    return bill;
  };

  return { loading, authWithQrCode, getBillsSummary, getBill };
};
