'use client';

import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import { useFilters } from '@/lib/useFilters';
import type { SalesRecord, GetRecordsResponse } from '@/lib/types';
import { PAGE_SIZE } from '@/lib/constants';

const columnHelper = createColumnHelper<SalesRecord>();

function Badge({ value }: { value: string | null | boolean }) {
  if (value === null || value === undefined) {
    return <span className="text-slate-300">—</span>;
  }
  const text =
    typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
      {text}
    </span>
  );
}

const SORTABLE_COLS = [
  'period',
  'platform',
  'region',
  'nmv',
  'units_sold',
  'avg_price_per_unit',
];

const ALL_COLUMNS = [
  columnHelper.accessor('period', {
    header: 'Period',
    cell: (i) => i.getValue().slice(0, 7),
    enableSorting: true,
  }),
  columnHelper.accessor('region', { header: 'Region', enableSorting: true }),
  columnHelper.accessor('platform', {
    header: 'Platform',
    enableSorting: true,
  }),
  columnHelper.accessor('shop_id', {
    header: 'Shop ID',
    cell: (i) => (
      <span className="font-mono text-xs text-slate-500">{i.getValue()}</span>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('is_mall', {
    header: 'Mall',
    cell: (i) => <Badge value={i.getValue()} />,
    enableSorting: false,
  }),
  columnHelper.accessor('product_id', {
    header: 'Product ID',
    cell: (i) => (
      <span className="font-mono text-xs text-slate-500">{i.getValue()}</span>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('sku_id', {
    header: 'SKU ID',
    cell: (i) => (
      <span className="font-mono text-xs text-slate-400">
        {i.getValue() ?? '—'}
      </span>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('origin', {
    header: 'Origin',
    cell: (i) => <Badge value={i.getValue()} />,
    enableSorting: false,
  }),
  columnHelper.accessor('l1_category', {
    header: 'L1 Cat.',
    enableSorting: false,
  }),
  columnHelper.accessor('l2_category', {
    header: 'L2 Cat.',
    enableSorting: false,
  }),
  columnHelper.accessor('l3_category', {
    header: 'L3 Cat.',
    enableSorting: false,
  }),
  columnHelper.accessor('l4_category', {
    header: 'L4 Cat.',
    enableSorting: false,
  }),
  columnHelper.accessor('nmv', {
    header: 'NMV',
    cell: (i) => {
      const v = Number(i.getValue());
      return (
        <span className="tabular-nums font-medium text-slate-800">
          ฿{v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toFixed(2)}
        </span>
      );
    },
    enableSorting: true,
  }),
  columnHelper.accessor('units_sold', {
    header: 'Units',
    cell: (i) => (
      <span className="tabular-nums text-slate-700">
        {i.getValue().toLocaleString()}
      </span>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor('avg_price_per_unit', {
    header: 'Avg Price',
    cell: (i) => (
      <span className="tabular-nums text-slate-700">
        ฿{Number(i.getValue()).toFixed(2)}
      </span>
    ),
    enableSorting: true,
  }),
];

function SortIcon({ direction }: { direction: false | 'asc' | 'desc' }) {
  if (!direction) {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-slate-300"
      >
        <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
      </svg>
    );
  }
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="text-blue-500"
    >
      {direction === 'asc' ? (
        <path d="M12 19V5M5 12l7-7 7 7" />
      ) : (
        <path d="M12 5v14M5 12l7 7 7-7" />
      )}
    </svg>
  );
}

export default function SalesTable({
  data: result,
}: {
  data: GetRecordsResponse;
}) {
  const { filters, setFilter, setFilters } = useFilters();

  const sorting: SortingState = filters.sort_by
    ? [{ id: filters.sort_by, desc: filters.sort_dir !== 'asc' }]
    : [];

  const tableData = useMemo(() => result?.data ?? [], [result]);

  const table = useReactTable({
    data: tableData,
    columns: ALL_COLUMNS,
    state: { sorting },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      if (next.length > 0) {
        setFilters({
          sort_by: next[0].id,
          sort_dir: next[0].desc ? 'desc' : 'asc',
        });
      } else {
        setFilters({ sort_by: undefined, sort_dir: undefined });
      }
    },
    manualSorting: true,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    pageCount: result ? Math.ceil(result.total / PAGE_SIZE) : -1,
  });

  const totalPages = result ? Math.ceil(result.total / PAGE_SIZE) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Sales Records
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {result
              ? `${result.total.toLocaleString()} total records`
              : 'Loading...'}
          </p>
        </div>
        {result && (
          <span className="text-xs text-slate-400">
            Page {result.page} of {totalPages}
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="bg-slate-50 border-b border-slate-100">
                {hg.headers.map((header) => {
                  const canSort = SORTABLE_COLS.includes(header.column.id);
                  return (
                    <th
                      key={header.id}
                      className={`px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap ${canSort ? 'cursor-pointer select-none hover:text-slate-700' : ''}`}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-1.5">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {canSort && (
                          <SortIcon direction={header.column.getIsSorted()} />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={ALL_COLUMNS.length}
                  className="px-5 py-12 text-center text-sm text-slate-400"
                >
                  No records found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-slate-50 hover:bg-slate-50/70 transition-colors ${i % 2 === 1 ? 'bg-slate-50/30' : ''}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-3 py-2.5 text-slate-700 whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100">
          <button
            onClick={() => setFilter('page', Math.max(1, result.page - 1))}
            disabled={result.page <= 1}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Prev
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let page: number;
              if (totalPages <= 7) {
                page = i + 1;
              } else if (result.page <= 4) {
                page = i + 1;
              } else if (result.page >= totalPages - 3) {
                page = totalPages - 6 + i;
              } else {
                page = result.page - 3 + i;
              }
              const isActive = page === result.page;
              return (
                <button
                  key={page}
                  onClick={() => setFilter('page', page)}
                  className={`w-7 h-7 text-xs font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() =>
              setFilter('page', Math.min(totalPages, result.page + 1))
            }
            disabled={result.page >= totalPages}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
