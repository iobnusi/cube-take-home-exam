import { ReadonlyURLSearchParams } from 'next/navigation';
import {
  FilterParams,
  Filters,
  IsMall,
  SortDir,
  SummaryGroupBy,
  TrendGroupBy,
} from './types';

export function filtersFromParams(
  params: Record<string, string | undefined>,
  prefix = '',
): FilterParams {
  return {
    platform: params[`${prefix}platform`],
    region: params[`${prefix}region`],
    from: params[`${prefix}from`],
    to: params[`${prefix}to`],
    l1_category: params[`${prefix}l1_category`],
    l2_category: params[`${prefix}l2_category`],
    l3_category: params[`${prefix}l3_category`],
    l4_category: params[`${prefix}l4_category`],
    origin: params[`${prefix}origin`],
    is_mall: params[`${prefix}is_mall`] as FilterParams['is_mall'],
  };
}

export function filtersFromParamsClient(
  params: ReadonlyURLSearchParams,
): Filters {
  return {
    platform: params.get('platform') ?? undefined,
    region: params.get('region') ?? undefined,
    from: params.get('from') ?? undefined,
    to: params.get('to') ?? undefined,
    l1_category: params.get('l1_category') ?? undefined,
    l2_category: params.get('l2_category') ?? undefined,
    l3_category: params.get('l3_category') ?? undefined,
    l4_category: params.get('l4_category') ?? undefined,
    origin: params.get('origin') ?? undefined,
    is_mall: (params.get('is_mall') as IsMall) ?? undefined,
    groupBy: (params.get('groupBy') as TrendGroupBy) ?? undefined,
    page: params.get('page') ? Number(params.get('page')) : undefined,
    sort_by: params.get('sort_by') ?? undefined,
    sort_dir: (params.get('sort_dir') as SortDir) ?? undefined,
    kpi_nmv_group_by:
      (params.get('kpi_nmv_group_by') as SummaryGroupBy) ?? undefined,
    kpi_units_sold_group_by:
      (params.get('kpi_units_sold_group_by') as SummaryGroupBy) ?? undefined,
    kpi_unique_shops_group_by:
      (params.get('kpi_unique_shops_group_by') as SummaryGroupBy) ?? undefined,
    kpi_unique_products_group_by:
      (params.get('kpi_unique_products_group_by') as SummaryGroupBy) ??
      undefined,
    kpi_avg_price_platform: params.get('kpi_avg_price_platform') ?? undefined,
    top_platform: params.get('top_platform') ?? undefined,
    top_region: params.get('top_region') ?? undefined,
    top_from: params.get('top_from') ?? undefined,
    top_to: params.get('top_to') ?? undefined,
    top_l1_category: params.get('top_l1_category') ?? undefined,
    top_l2_category: params.get('top_l2_category') ?? undefined,
    top_l3_category: params.get('top_l3_category') ?? undefined,
    top_l4_category: params.get('top_l4_category') ?? undefined,
    top_origin: params.get('top_origin') ?? undefined,
    top_is_mall: (params.get('top_is_mall') as IsMall) ?? undefined,
  };
}

export function buildQuery(
  params: Record<string, string | number | undefined>,
): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== '' && v !== null,
  );
  if (entries.length === 0) return '';
  return (
    '?' +
    new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()
  );
}
