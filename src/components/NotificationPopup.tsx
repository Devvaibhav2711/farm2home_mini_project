import { useState, useEffect } from 'react';
import { X, Bell, Gift, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string | null;
}

const NotificationPopup = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchNotifications();
    
    // Subscribe to realtime notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications((prev) => [newNotif, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    const dismissedIds = JSON.parse(localStorage.getItem('dismissedNotifications') || '[]');
    setDismissed(new Set(dismissedIds));
    
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (data) setNotifications(data);
  };

  const dismissNotification = (id: string) => {
    const newDismissed = new Set([...dismissed, id]);
    setDismissed(newDismissed);
    localStorage.setItem('dismissedNotifications', JSON.stringify([...newDismissed]));
  };

  const activeNotifications = notifications.filter((n) => !dismissed.has(n.id));
  const currentNotification = activeNotifications[currentIndex];

  if (!currentNotification) return null;

  const getIcon = () => {
    switch (currentNotification.type) {
      case 'promo': return <Gift className="h-5 w-5" />;
      case 'alert': return <AlertCircle className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getColor = () => {
    switch (currentNotification.type) {
      case 'promo': return 'bg-accent text-accent-foreground';
      case 'alert': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <div className={`${getColor()} rounded-xl shadow-2xl p-4 relative`}>
        <button
          onClick={() => dismissNotification(currentNotification.id)}
          className="absolute top-2 right-2 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex gap-3">
          <div className="shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="pr-4">
            <h4 className="font-semibold text-sm">{currentNotification.title}</h4>
            <p className="text-sm opacity-90 mt-1">{currentNotification.message}</p>
          </div>
        </div>
        
        {activeNotifications.length > 1 && (
          <div className="flex justify-center gap-1 mt-3">
            {activeNotifications.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-current w-4' : 'bg-current/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
