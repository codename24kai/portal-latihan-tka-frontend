/**
 * Dashboard stat widget card.
 * Shows an icon, value, label, and optional trend.
 */
export default function StatCard({ icon: Icon, label, value, trend, color = 'indigo' }) {
  const colorMap = {
    indigo: { 
      bg: 'bg-indigo-50 dark:bg-indigo-900/20', 
      text: 'text-indigo-600 dark:text-indigo-400', 
      iconBg: 'bg-indigo-100 dark:bg-indigo-500/20',
      border: 'border-indigo-100 dark:border-indigo-900/50'
    },
    teal: { 
      bg: 'bg-teal-50 dark:bg-teal-900/20', 
      text: 'text-teal-600 dark:text-teal-400', 
      iconBg: 'bg-teal-100 dark:bg-teal-500/20',
      border: 'border-teal-100 dark:border-teal-900/50'
    },
    orange: { 
      bg: 'bg-orange-50 dark:bg-orange-900/20', 
      text: 'text-orange-600 dark:text-orange-400', 
      iconBg: 'bg-orange-100 dark:bg-orange-500/20',
      border: 'border-orange-100 dark:border-orange-900/50'
    },
    yellow: { 
      bg: 'bg-yellow-50 dark:bg-yellow-900/20', 
      text: 'text-yellow-600 dark:text-yellow-400', 
      iconBg: 'bg-yellow-100 dark:bg-yellow-500/20',
      border: 'border-yellow-100 dark:border-yellow-900/50'
    },
  };

  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className={`${c.bg} ${c.border} border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden flex flex-col justify-between h-full`}>
      <div className="flex items-start justify-between relative z-10">
        <div className={`w-14 h-14 rounded-2xl ${c.iconBg} ${c.text} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={28} strokeWidth={2.5} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1.5 rounded-full ${
            trend > 0 ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20 text-white' : 'bg-rose-500 shadow-lg shadow-rose-500/20 text-white'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div className="mt-8 relative z-10">
        <p className={`text-4xl font-black ${c.text} tracking-tight`}>{value}</p>
        <p className="text-xs font-black text-slate-400 mt-1 uppercase tracking-widest">{label}</p>
      </div>

      {/* Subtle patterns/circles for flair */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-slate-800/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none" />
    </div>
  );
}
