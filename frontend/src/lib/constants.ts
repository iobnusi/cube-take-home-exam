import { IsMall, MallStatus, Origin } from './types';

const FALLBACK_URL = 'http://localhost:4000';
export const PAGE_SIZE = 10;
export const BASE_URL =
  typeof window === 'undefined'
    ? process.env.API_URL || FALLBACK_URL // server side
    : process.env.NEXT_PUBLIC_API_URL || FALLBACK_URL; // browser side

export const ORIGINS: Origin[] = ['Imported', 'Local'];

export const MALL_STATUS: { value: IsMall; label: MallStatus }[] = [
  { value: 'true', label: 'Mall' },
  { value: 'false', label: 'Non-Mall' },
  { value: 'other', label: 'Other' },
];
