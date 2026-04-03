/**
 * Reusable data table component for admin views.
 * Renders columns and rows with a clean design.
 */
export default function DataTable({ columns, data, onRowClick, emptyMessage = 'Tidak ada data' }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-card dark:shadow-none border border-transparent dark:border-dark-border p-10 text-center">
        <p className="text-gray-400 dark:text-gray-500 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-card dark:shadow-none border border-transparent dark:border-dark-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-dark-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-5 py-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  style={col.width ? { width: col.width } : {}}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-gray-50 dark:border-dark-border/50 last:border-b-0 transition-colors duration-150 ${
                  onRowClick ? 'cursor-pointer hover:bg-primary-50/30 dark:hover:bg-dark-border' : ''
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4 text-sm whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : (
                      <span className="text-gray-600 dark:text-gray-300">{row[col.key]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
