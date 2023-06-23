import React from 'react';
import { useAuth } from './useAuth';

const DISCOVERY_URL =
  'https://prod-s0-webapp-proxy.nubank.com.br/api/discovery';

const DISCOVERY_APP_URL =
  'https://prod-s0-webapp-proxy.nubank.com.br/api/app/discovery';

export interface AuthState {
  access_token: string;
}

export const useNubank = () => {
  const { state, setState } = useAuth();
  const [loading, setLoading] = React.useState();

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

  const requestPost = async (url: string, body: unknown, headers?: object) => {
    return fetch(url, {
      method: 'POST',
      headers: { ...defaultHeaders(), ...headers },
      body: JSON.stringify(body),
    }).then((res) => res.json());
  };

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

    setState(authState);
  };

  return { authWithQrCode };
};
