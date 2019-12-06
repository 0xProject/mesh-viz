import { OrdersResponse } from '@0x/connect';

const SRA_V3_BASE_URL = 'https://api.0x.org/sra';
const SRA_V2_BASE_URL = `https://sra.0x.org/v2`;

class SRAClient {
  public sraUrl: string;
  constructor(sraUrl: string) {
    this.sraUrl = sraUrl;
  }
  public async getOpenOrderCountAsync(): Promise<number> {
    const response = await fetch(`${this.sraUrl}/orders`);
    const ordersResponse: OrdersResponse = await response.json();
    return ordersResponse.total;
  }
}

export const sraV3Client = new SRAClient(SRA_V3_BASE_URL);
export const sraV2Client = new SRAClient(SRA_V2_BASE_URL);
