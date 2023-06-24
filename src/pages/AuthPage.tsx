import QR from 'qrcode';
import React, { FormEvent } from 'react';
import uuid from 'react-native-uuid';
import { useNubank } from '../hooks/useNubank';

const AuthPage = () => {
  const { authWithQrCode } = useNubank();
  const [cpf, setCpf] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState();
  const [authCode] = React.useState(uuid.v4().toString());
  const [qrCode, setQrCode] = React.useState<string | undefined>();

  React.useEffect(() => {
    QR.toDataURL(authCode, { width: 300 }, (err, url) => {
      if (err) {
        console.error(err);
        return;
      }
      setQrCode(url);
    });
  }, [authCode]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    authWithQrCode(authCode, cpf, password).catch((e: any) => {
      setError(e.toString());
      console.error(e);
    });
  };

  return (
    <main>
      <p>
        Preencha o CPF e senha, escaneie o QRCode no aplicativo do Nubank e
        clique no botão "Autenticar"
      </p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>CPF</span>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </label>
        <label>
          <span>Senha</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div>
          {!qrCode ? <span>Carregando QRCOde</span> : <img src={qrCode} />}
        </div>
        {error && <div>{error}</div>}
        <button type="submit">Autenticar</button>
      </form>
    </main>
  );
};

export default AuthPage;
