import { NubankApi } from 'nubank-api';

export class Nubank {
  api: NubankApi;

  constructor() {
    this.api = new NubankApi();
  }

  async auth(cpf: string, password: string, authCode: string) {
    await this.api.auth.authenticateWithQrCode(cpf, password, authCode);
    return this.api.authState;
  }
}
