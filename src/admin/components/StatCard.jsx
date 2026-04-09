/**
 * Dashboard stat widget card.
 * Shows an icon, value, label, and optional trend.
 */
export default function StatCard({ icon: Icon, label, value, trend, color = 'primary' }) {
  const colorMap = {
    primary: { bg: 'bg-primary-50 dark:bg-primary/20', text: 'text-primary dark:text-primary-light', icon: 'text-primary dark:text-primary-light' },
    secondary: { bg: 'bg-secondary/10 dark:bg-secondary/20', text: 'text-secondary-dark dark:text-secondary', icon: 'text-secondary' },
    correct: { bg: 'bg-correct/10 dark:bg-correct/20', text: 'text-correct', icon: 'text-correct' },
    accent: { bg: 'bg-accent/10 dark:bg-accent/20', text: 'text-accent-dark dark:text-accent', icon: 'text-accent' },
    warning: { bg: 'bg-warning/10 dark:bg-warning/20', text: 'text-warning', icon: 'text-warning' },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-card dark:shadow-none border border-transparent dark:border-dark-border p-5 hover:shadow-card-hover transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} className={c.icon} />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
            trend > 0 ? 'bg-correct/10 dark:bg-correct/20 text-correct' : 'bg-incorrect/10 dark:bg-incorrect/20 text-incorrect'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className={`text-2xl font-bold ${c.text} mb-0.5`}>{value}</p>
      <p className="text-sm text-slate-400 dark:text-slate-500">{label}</p>
    </div>
  );
}
