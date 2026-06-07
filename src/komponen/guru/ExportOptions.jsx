import React from 'react';
import { X, Info, Download } from 'lucide-react';

/**
 * ExportOptions component encapsulates the export customization modal.
 * Props:
 *  - isOpen: boolean, controls visibility
 *  - onClose: () => void, closes the modal
 *  - exportFormat: string, selected format (e.g., 'PDF' or 'Excel')
 *  - setExportFormat: (format: string) => void
 *  - exportScope: string, selected data scope
 *  - setExportScope: (scope: string) => void
 *  - exportColumns: Record<string, boolean>, column selections
 *  - setExportColumns: (cols: Record<string, boolean>) => void
 *  - isExporting: boolean, export in progress flag
 *  - setIsExporting: (val: boolean) => void
 *  - onExport: (e: React.FormEvent) => void, form submit handler
 */
export default function ExportOptions({
  isOpen,
  onClose,
  exportFormat,
  setExportFormat,
  exportScope,
  setExportScope,
  exportColumns,
  setExportColumns,
  isExporting,
  setIsExporting,
  onExport,
}) {
  if (!isOpen) return null;

  const scopeOptions = [
    { id: 'Semua', label: 'Semua Murid' },
    { id: 'Lulus', label: 'Hanya Lulus' },
    { id: 'Remedial', label: 'Hanya Remedial' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl max-w-lg w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20 dark:border-slate-700">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
              Kustomisasi Ekspor Laporan
            </span>
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">
              Format Dokumen: {exportFormat}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-rose-500 transition-colors font-black text-sm"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onExport} className="p-8 space-y-6">
          {/* Scope Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Cakupan Data
            </label>
            <div className="flex gap-2">
              {scopeOptions.map((scope) => (
                <button
                  key={scope.id}
                  type="button"
                  onClick={() => setExportScope(scope.id)}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    exportScope === scope.id
                      ? 'bg-orange-600 text-white border-transparent shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {scope.label}
                </button>
              ))}
            </div>
          </div>

          {/* Columns Checkbox */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Pilih Kolom Nilai
            </label>
            <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
              {Object.keys(exportColumns).map((col) => (
                <label key={col} className="flex items-center gap-2 cursor-pointer p-1">
                  <input
                    type="checkbox"
                    checked={exportColumns[col]}
                    onChange={(e) =>
                      setExportColumns((prev) => ({ ...prev, [col]: e.target.checked }))
                    }
                    className="w-4 h-4 text-orange-600 border-slate-300 dark:border-slate-600 rounded focus:ring-orange-500"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 capitalize">
                    {col}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Info Banner */}
          <div className="flex items-center gap-3 p-4 bg-teal-50 dark:bg-teal-900/10 rounded-2xl border border-teal-100 dark:border-teal-900/30">
            <Info size={16} className="text-teal-600 shrink-0" />
            <p className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase leading-relaxed">
              Laporan akan diunduh secara otomatis setelah berkas diproses di browser.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 border-t border-slate-100 dark:border-slate-700 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-400 font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isExporting || !Object.values(exportColumns).some(Boolean)}
              className="flex-1 py-4 bg-orange-600 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isExporting ? 'Memproses Berkas...' : 'Ekspor Laporan'}
              <Download size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
