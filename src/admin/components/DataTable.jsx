import { ChevronUp, ChevronDown } from 'lucide-react';

/**
 * Enhanced data table component for admin views.
 * Supports sorting, summary footer, and conditional row styling.
 */
export default function DataTable({ 
  columns, 
  data, 
  onRowClick, 
  emptyMessage = 'Tidak ada data',
  sortConfig = null,
  onSort = null,
  footerRow = null,
  rowClassName = null
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-sm border border-slate-100 dark:border-dark-border p-10 text-center">
        <p className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-widest">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-sm border border-slate-100 dark:border-dark-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-dark-border bg-slate-50/50 dark:bg-slate-800/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && onSort?.(col.key)}
                  className={`text-left px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap ${col.sortable ? 'cursor-pointer hover:text-teal-600 transition-colors' : ''}`}
                  style={col.width ? { width: col.width } : {}}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp size={10} className={sortConfig?.key === col.key && sortConfig?.direction === 'asc' ? 'text-teal-600' : 'opacity-20'} />
                        <ChevronDown size={10} className={sortConfig?.key === col.key && sortConfig?.direction === 'desc' ? 'text-teal-600' : 'opacity-20'} />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-slate-50 dark:border-dark-border/50 last:border-b-0 transition-colors duration-150 ${
                  onRowClick ? 'cursor-pointer hover:bg-teal-50/30' : ''
                } ${rowClassName ? rowClassName(row) : ''}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : (
                      <span className="font-bold text-slate-700 dark:text-slate-300">{row[col.key]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {/* Footer / Summary Row */}
            {footerRow && (
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-t-2 border-slate-100 dark:border-slate-700">
                {columns.map((col) => (
                  <td key={`footer-${col.key}`} className="px-6 py-5 text-sm whitespace-nowrap font-black text-slate-800 dark:text-white">
                    {footerRow[col.key]}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
