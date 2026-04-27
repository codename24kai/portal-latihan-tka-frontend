import React, { useRef, useEffect } from 'react';
import { Upload, X, AlertCircle, File, Image as ImageIcon } from 'lucide-react';

/**
 * FilePreviewUpload: A reusable multi-file upload component with thumbnails.
 * Handles validation (size/type) and provides visual feedback.
 */
export default function FilePreviewUpload({ 
  files = [], 
  onAdd, 
  onRemove, 
  multiple = true,
  accept = "image/*",
  maxSizeMB = 2,
  label = "Unggah File Media"
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const newFiles = selectedFiles.map(file => {
      const isImage = file.type.startsWith('image/');
      const isOverSize = file.size > maxSizeMB * 1024 * 1024;
      const isTypeInvalid = accept !== "*" && !file.type.match(accept.replace('*', '.*'));
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        url: isImage ? URL.createObjectURL(file) : null,
        type: file.type,
        name: file.name,
        size: file.size,
        isImage,
        error: isOverSize || isTypeInvalid,
        sizeError: isOverSize,
        typeError: isTypeInvalid
      };
    });

    onAdd(multiple ? [...files, ...newFiles] : newFiles);
    
    // Reset input value to allow re-selecting same file
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (e, id) => {
    e.stopPropagation();
    onRemove(id);
  };

  return (
    <div className="space-y-4 w-full">
      {/* Label and dropzone trigger */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="relative group cursor-pointer"
      >
        <input 
          ref={fileInputRef}
          type="file" 
          multiple={multiple}
          accept={accept}
          onChange={handleFileChange}
          className="hidden" 
        />
        
        <div className="border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-indigo-500/30 group">
          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:scale-110 transition-all shadow-sm border border-slate-50 dark:border-slate-700">
            <Upload size={32} />
          </div>
          <div className="text-center">
            <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{label}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Klik atau Seret file ke sini • Maks {maxSizeMB}MB
            </p>
          </div>
        </div>
      </div>

      {/* Preview Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-in fade-in duration-300">
          {files.map((item) => (
            <div 
              key={item.id} 
              className={`relative aspect-square rounded-[1.5rem] border-2 overflow-hidden group transition-all ${
                item.error ? 'border-rose-500/50 bg-rose-50 dark:bg-rose-950/20' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm'
              }`}
            >
              {/* Thumbnail / Icon */}
              {item.isImage ? (
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                  <File size={32} className="text-slate-300" />
                  <p className="text-[8px] font-bold text-slate-400 mt-2 truncate max-w-full text-center px-2">{item.name}</p>
                </div>
              )}

              {/* Error Overlays */}
              {item.error && (
                <div className="absolute inset-0 bg-rose-500/10 backdrop-blur-[1px] flex flex-col items-center justify-center p-2 text-center">
                  <AlertCircle size={20} className="text-rose-500 mb-1" />
                  <p className="text-[8px] font-black text-rose-600 uppercase leading-tight">
                    {item.sizeError ? 'File Terlalu Besar' : 'Format Tidak Sesuai'}
                  </p>
                </div>
              )}

              {/* Remove Button */}
              <button
                type="button"
                onClick={(e) => handleRemove(e, item.id)}
                className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-slate-900/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-rose-600 transition-all z-10"
              >
                <X size={16} />
              </button>

              {/* Hover Info (If no error) */}
              {!item.error && (
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[7px] font-bold text-white truncate uppercase tracking-widest">
                    {(item.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
