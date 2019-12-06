import { HttpClient } from '@0x/connect';

const SRA_BASE_URL = 'https://api.0x.org/sra';

export const sraClient = new HttpClient(SRA_BASE_URL);
