import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Clock, FileText, User, AlertCircle, Sparkles, Filter } from 'lucide-react';
import { dataStore, type NotificationItem } from '../../services/dataStore';

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filterType, setFilterType] = useState<string>('All');

  useEffect(() => {
    setNotifications(dataStore.getNotifications());
  }, []);

  const handleMarkAllRead = () => {
    notifications.forEach(n => dataStore.markNotificationRead(n.id));
    setNotifications(dataStore.getNotifications());
  };

  const handleReadSingle = (id: string) => {
    dataStore.markNotificationRead(id);
    setNotifications(dataStore.getNotifications());
  };

  const filtered = notifications.filter(n => {
    if (filterType === 'All') return true;
    if (filterType === 'Unread') return !n.read;
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-800/10 text-amber-900 border border-amber-800/20">
            Activity Center
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-950 mt-1">
            System & Clinical Notifications
          </h1>
          <p className="text-amber-900/70 text-sm mt-0.5">
            Stay updated on new patient registrations, assessment submissions, and follow-up reminders.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 bg-amber-800/10 hover:bg-amber-800/20 text-amber-900 border border-amber-900/20 rounded-xl font-medium text-xs transition-colors flex items-center space-x-1.5"
          >
            <CheckCheck size={16} />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        <Filter size={16} className="text-amber-900/60" />
        {['All', 'Unread'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filterType === type
                ? 'bg-amber-800 text-amber-50 shadow-sm'
                : 'bg-amber-800/10 text-amber-900 hover:bg-amber-800/20'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-12 text-center">
            <Bell size={48} className="mx-auto text-amber-900/30 mb-3" />
            <h3 className="text-lg font-serif font-bold text-amber-950">No notifications found</h3>
            <p className="text-sm text-amber-900/60 mt-1">You are all caught up with your clinical updates!</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleReadSingle(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                !item.read
                  ? 'bg-amber-800/10 border-amber-800/30 shadow-sm'
                  : 'bg-[#fbf7ee]/80 border-amber-900/15 opacity-80'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  item.type === 'assessment' ? 'bg-amber-800/20 text-amber-900' :
                  item.type === 'report' ? 'bg-emerald-800/20 text-emerald-900' :
                  item.type === 'followup' ? 'bg-purple-800/20 text-purple-900' :
                  'bg-blue-800/20 text-blue-900'
                }`}>
                  <Bell size={18} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-amber-950 text-sm">{item.title}</h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-amber-800 inline-block" />
                    )}
                  </div>
                  <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">{item.message}</p>
                  <span className="text-[11px] text-amber-800/60 font-mono mt-2 block">{item.time}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
