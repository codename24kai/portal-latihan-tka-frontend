import React, { useState, useRef } from 'react';
import { X, Upload, Check, Image as ImageIcon, Trash2 } from 'lucide-react';

/**
 * ProfilePicModal - A robust modal for selecting or uploading profile pictures.
 * Features:
 * 1. File Upload with FileReader (Path A)
 * 2. Template Selection (Path B)
 * 3. Live Preview
 */
export default function ProfilePicModal({ isOpen, onClose, onSave, currentPic }) {
  const [selectedPic, setSelectedPic] = useState(currentPic);
  const [previewPic, setPreviewPic] = useState(currentPic);
  const fileInputRef = useRef(null);

  // Avatar Templates (3 Male, 2 Female)
  const avatars = [
    { id: 'b1', path: '/avatar/avatar-boy-1.svg', gender: 'Laki-laki' },
    { id: 'b2', path: '/avatar/avatar-boy-2.svg', gender: 'Laki-laki' },
    { id: 'b3', path: '/avatar/avatar-boy-3.svg', gender: 'Laki-laki' },
    { id: 'g1', path: '/avatar/avatar-girl-1.svg', gender: 'Perempuan' },
    { id: 'g2', path: '/avatar/avatar-girl-2.svg', gender: 'Perempuan' },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File terlalu besar. Maksimal 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPic(reader.result);
        setSelectedPic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectTemplate = (path) => {
    setPreviewPic(path);
    setSelectedPic(path);
  };

  const resetSelection = () => {
    setPreviewPic(null);
    setSelectedPic(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-700 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-white/80 dark:bg-slate-800/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Ubah Foto Profil</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Pilih avatar atau unggah foto Anda sendiri</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar space-y-10">
          
          {/* PATH A: UNGGAH FOTO SENDIRI */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Upload size={16} />
              </div>
              <h4 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">Unggah Foto Sendiri</h4>
            </div>
            
            <div 
              className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-8 hover:border-orange-500/50 transition-all group cursor-pointer bg-slate-50/50 dark:bg-slate-900/20"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload}
              />
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-orange-500 group-hover:scale-110 transition-all mb-4 border border-slate-100 dark:border-slate-700">
                <ImageIcon size={32} />
              </div>
              <p className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Unggah dari Perangkat</p>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tight">Format: JPG, PNG (Max 2MB)</p>
            </div>
          </section>

          {/* PATH B: PILIH DARI TEMPLATE AVATAR */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <UserIcon size={16} />
              </div>
              <h4 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">Pilih Template Avatar</h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {avatars?.map((avatar) => (
                <div 
                  key={avatar.id}
                  className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedPic === avatar.path 
                    ? 'border-teal-500 ring-4 ring-teal-500/10' 
                    : 'border-slate-100 dark:border-slate-700 hover:border-teal-500/40 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="p-4 aspect-square flex items-center justify-center">
                    <img 
                      src={avatar.path} 
                      alt={avatar.gender} 
                      className={`w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 ${selectedPic === avatar.path ? 'scale-110' : ''}`}
                    />
                  </div>
                  
                  {/* Selection Overlay */}
                  <div 
                    className={`absolute inset-0 bg-teal-600/10 flex flex-col items-center justify-end p-2 transition-opacity duration-300 ${
                      selectedPic === avatar.path ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                     <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-lg mb-auto mt-2">
                        <Check size={16} strokeWidth={4} />
                     </div>
                  </div>

                  {/* "Pilih" Button - Visible on Hover */}
                  <button 
                    onClick={() => handleSelectTemplate(avatar.path)}
                    className="absolute inset-0 z-20 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="px-4 py-1.5 bg-white dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border border-slate-100 dark:border-slate-700 text-teal-600 dark:text-teal-400">
                      Pilih
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer & Final Preview */}
        <div className="p-8 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative">
                <div className="w-20 h-20 rounded-[2rem] bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-2xl overflow-hidden flex items-center justify-center transition-all duration-500">
                {previewPic ? (
                    <img src={previewPic} alt="Preview" className="w-full h-full object-cover animate-in fade-in zoom-in-75 duration-300" />
                ) : (
                    <div className="text-slate-200 dark:text-slate-700">
                        <ImageIcon size={32} />
                    </div>
                )}
                </div>
                {previewPic && (
                    <button 
                        onClick={resetSelection}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                        title="Reset selection"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pratinjau Terpilih</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">
                    {selectedPic?.startsWith('data:') ? 'Foto Unggahan' : selectedPic ? 'Avatar Template' : 'Belum Memilih'}
                </p>
                {selectedPic && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 sm:flex-none px-8 py-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-xs uppercase tracking-[0.15em] hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              Batal
            </button>
            <button 
              onClick={() => onSave(selectedPic)}
              disabled={!selectedPic}
              className="flex-1 sm:flex-none px-10 py-4 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-xl shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icons
function UserIcon({ size, className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
    )
}
