import { NubankApi } from 'nubank-api';

export class Nubank {
  api: NubankApi;

  constructor(authState: unknown) {
    this.api = new NubankApi(authState as never);
  }

  async auth(cpf: string, password: string, authCode: string) {
    await this.api.auth.authenticateWithQrCode(cpf, password, authCode);
    localStorage.setItem('authState', JSON.stringify(this.api.authState));
    return this.api.authState;
  }

  async cardTransactions() {
    return await this.api.card.getTransactions();
  }
}
