export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const sendLocalNotification = (title, body, tag = 'default') => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  
  new Notification(title, {
    body,
    icon: '/manifest-icon-192.png',
    badge: '/manifest-icon-192.png',
    vibrate: [200, 100, 200],
    tag,
  });
};

export const checkUpcomingAppointments = (appointments) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  appointments
    .filter(a => a.status !== 'İptal' && a.status !== 'Tamamlandı')
    .forEach(a => {
      // Reminder date notification
      if (a.reminder_date === today) {
        sendLocalNotification(
          'Randevu Hatırlatma',
          `${a.title} - ${a.date} ${a.time || ''}${a.customer_name ? ` (${a.customer_name})` : ''}`,
          `reminder-${a.id}`
        );
      }

      // Same-day upcoming appointment (within 30 min)
      if (a.date === today && a.time) {
        const [hour, minute] = a.time.split(':').map(Number);
        const diffMinutes = (hour * 60 + minute) - (currentHour * 60 + currentMinute);
        
        if (diffMinutes > 0 && diffMinutes <= 30) {
          sendLocalNotification(
            'Yaklaşan Randevu',
            `${a.title} - ${a.time}${a.customer_name ? ` (${a.customer_name})` : ''}`,
            `appointment-${a.id}`
          );
        }
      }
    });
};
