import { HttpClient } from '@0x/connect';

const SRA_V3_BASE_URL = 'https://api.0x.org/sra';
const SRA_V2_BASE_URL = `https://sra.0x.org/v2`;

export const sraV3Client = new HttpClient(SRA_V3_BASE_URL);
export const sraV2Client = new HttpClient(SRA_V2_BASE_URL);
