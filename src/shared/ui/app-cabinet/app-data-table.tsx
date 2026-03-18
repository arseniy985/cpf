'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AppEmptyState } from './app-empty-state';

type AppDataTableProps<TData> = {
  data: TData[];
  columns: Array<ColumnDef<TData>>;
  emptyTitle: string;
  emptyDescription: string;
};

export function AppDataTable<TData>({
  data,
  columns,
  emptyTitle,
  emptyDescription,
}: AppDataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data.length) {
    return (
      <AppEmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <Table className="border-collapse [&_td]:border-b [&_td]:border-app-cabinet-border/70 [&_th]:border-b [&_th]:border-app-cabinet-border">
      <TableHeader className="bg-slate-50">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-transparent">
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="h-12 text-[11px] tracking-[0.16em] text-app-cabinet-muted">
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} className="bg-app-cabinet-surface hover:bg-slate-50">
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className="align-top">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
