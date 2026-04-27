import React from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';

const ImportModal = ({ isOpen, importData, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
         <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                  <Upload size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Pratinjau Impor Soal</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Ditemukan {importData?.length} baris data siap diimpor</p>
               </div>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
               <X size={24} />
            </button>
         </div>

         <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-[2rem] border border-slate-100 dark:border-slate-700 overflow-hidden">
               <DataTable 
                headers={[
                  { label: 'No', align: 'center' },
                  { label: 'Pertanyaan' },
                  { label: 'Mata Pelajaran', align: 'center' },
                  { label: 'Kesulitan', align: 'center' }
                ]}
                data={importData}
                rowsPerPage={50}
                renderRow={(item, idx) => (
                  <tr key={item?.id} className="border-b border-slate-100/50 dark:border-slate-700/50">
                    <td className="py-4 px-6 text-center text-[10px] font-black text-slate-300">{(idx + 1).toString().padStart(2, '0')}</td>
                    <td className="py-4 px-6">
                       <p className="text-xs font-bold text-slate-700 dark:text-slate-200 line-clamp-1">{item?.text}</p>
                    </td>
                    <td className="py-4 px-6 text-center">
                       <Badge text={item?.subject} variant="Info" className="!text-[8px]" />
                    </td>
                    <td className="py-4 px-6 text-center">
                       <Badge 
                        text={item?.difficulty} 
                        variant={item?.difficulty === 'Mudah' ? 'Success' : 'Warning'} 
                        className="!text-[8px]"
                       />
                    </td>
                  </tr>
                )}
               />
            </div>
         </div>

         <div className="p-10 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
               <AlertCircle size={20} className="text-indigo-500" />
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Mohon periksa kembali data sebelum menyimpan ke database.</p>
            </div>
            <div className="flex items-center gap-4">
               <button 
                onClick={onClose}
                className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all hover:bg-slate-50"
               >
                Batalkan
               </button>
               <button 
                onClick={onConfirm}
                className="px-10 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95"
               >
                Konfirmasi & Simpan
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ImportModal;
