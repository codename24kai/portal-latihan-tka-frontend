import { Cloud, CloudOff } from 'lucide-react';

/**
 * Visual network status indicator.
 * Shows cloud with checkmark (online) or cloud with slash (offline).
 */
export default function NetworkIndicator({ isOnline }) {
  return (
    <div
      id="network-indicator"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
        isOnline
          ? 'bg-correct/10 text-correct'
          : 'bg-incorrect/10 text-incorrect animate-pulse-soft'
      }`}
    >
      {isOnline ? (
        <>
          <Cloud size={14} />
          <span>Online</span>
        </>
      ) : (
        <>
          <CloudOff size={14} />
          <span>Offline</span>
        </>
      )}
    </div>
  );
}
