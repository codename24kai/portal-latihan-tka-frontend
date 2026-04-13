import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * DataTable: A structured wrapper for displaying data with integrated pagination.
 * Supports clean headers, hover effects, and numeric alignment.
 */
const DataTable = ({ 
  headers = [], 
  data = [], 
  rowsPerPage = 5,
  renderRow,
  className = ""
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const safeData = Array.isArray(data) ? data : [];
  const totalPages = Math.ceil(safeData.length / rowsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const paginatedData = safeData.slice(
    (safeCurrentPage - 1) * rowsPerPage, 
    safeCurrentPage * rowsPerPage
  );

  return (
    <div className={`overflow-hidden rounded-[2rem] border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
              {headers.map((header, idx) => (
                <th 
                  key={idx} 
                  className={`py-6 px-8 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ${header.align === 'center' ? 'text-center' : header.align === 'right' ? 'text-right' : ''}`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {paginatedData.map((row, idx) => renderRow(row, idx))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={headers.length} className="py-20 text-center text-xs font-bold text-slate-400 uppercase tracking-widest italic">
                  Tidak ada data untuk ditampilkan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-8 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between bg-slate-50/20 dark:bg-slate-900/20">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Total {safeData.length} item
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-teal-600 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="px-6 h-10 flex items-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-black uppercase tracking-widest">
                <span className="text-teal-600">{safeCurrentPage}</span> / <span className="text-slate-400">{totalPages}</span>
              </span>
            </div>

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-teal-600 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
