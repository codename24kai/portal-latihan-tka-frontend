import React from 'react';

export default function AdminHeader({ admin }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
                <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight italic">
                    Dashboard <span className="text-teal-600 font-black not-italic">Overview</span>
                </h1>
                <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-2">
                    Selamat Datang Kembali, <span className="text-teal-600">{admin?.name || 'Administrator'}</span>
                </p>
            </div>


        </div>
    );
}
