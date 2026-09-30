import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  FileCheck2,
  PackageX,
  Server,
  Share2,
  Check,
  Trash2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useNotifications, NotificationType, NotificationItem } from '../../context/NotificationContext';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateModule: (moduleId: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  onNavigateModule,
}) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [filter, setFilter] = useState<'all' | NotificationType>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'approval':
        return <FileCheck2 className="w-4 h-4 text-purple-500" />;
      case 'stockout':
        return <PackageX className="w-4 h-4 text-amber-500" />;
      case 'agent':
        return <Share2 className="w-4 h-4 text-cyan-500" />;
      case 'system':
      default:
        return <Server className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTypeBadge = (type: NotificationType) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-900/60';
      case 'approval':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-900/60';
      case 'stockout':
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900/60';
      case 'agent':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-400 dark:border-cyan-900/60';
      case 'system':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900/60';
    }
  };

  const handleAction = (item: NotificationItem) => {
    markAsRead(item.id);
    if (item.actionTargetModule) {
      onNavigateModule(item.actionTargetModule);
    }
    onClose();
  };

  return (
    <>
      {/* Click outside backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown Container */}
      <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              National Sentinel Alerts
            </span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-medium px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                title="Mark all as read"
              >
                Read all
              </button>
            )}
            <button
              onClick={clearAll}
              className="text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400 p-1 rounded cursor-pointer transition-colors"
              title="Clear all notifications"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-3 py-1.5 bg-slate-100/70 dark:bg-slate-950/50 border-b border-slate-200/70 dark:border-slate-800 flex items-center gap-1 overflow-x-auto no-scrollbar text-[11px]">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'critical', label: 'Critical' },
              { id: 'approval', label: 'Approvals' },
              { id: 'stockout', label: 'Stockouts' },
              { id: 'agent', label: 'Swarm' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-2 py-0.5 rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filter === t.id
                  ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Notification Items List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredNotifications.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400 dark:text-slate-500">
              No notifications in this queue
            </div>
          ) : (
            filteredNotifications.map((item) => {
              return (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-3.5 transition-colors flex items-start gap-3 cursor-pointer ${
                    item.read
                      ? 'bg-white hover:bg-slate-50 dark:bg-[#0F172A] dark:hover:bg-slate-850/50'
                      : 'bg-blue-50/40 hover:bg-blue-50/70 dark:bg-blue-950/20 dark:hover:bg-blue-950/30'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{getIcon(item.type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span
                        className={`text-[9px] font-bold font-mono uppercase px-1.5 py-0.2 rounded border ${getTypeBadge(
                          item.type
                        )}`}
                      >
                        {item.type}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        {item.timestamp}
                      </span>
                    </div>

                    <h4
                      className={`text-xs leading-snug ${
                        item.read
                          ? 'font-medium text-slate-800 dark:text-slate-300'
                          : 'font-bold text-slate-900 dark:text-white'
                      }`}
                    >
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>

                    {item.actionLabel && (
                      <div className="mt-2 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(item);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
                        >
                          <span>{item.actionLabel}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400"></span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-slate-50/90 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            onClick={() => {
              onNavigateModule('command-center');
              onClose();
            }}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            View National Audit Stream &rarr;
          </button>
        </div>
      </div>
    </>
  );
};
