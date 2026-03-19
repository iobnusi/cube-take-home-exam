import { IsMall, MallStatus, Origin } from './types';

export const PAGE_SIZE = 10;
export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export const ORIGINS: Origin[] = ['Imported', 'Local'];

export const MALL_STATUS: { value: IsMall; label: MallStatus }[] = [
  { value: 'true', label: 'Mall' },
  { value: 'false', label: 'Non-Mall' },
  { value: 'other', label: 'Other' },
];
