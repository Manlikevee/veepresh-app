import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const CHANNEL_ID = 'quiz-reminders';

// Show reminders even while the app is open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensureChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Quiz reminders',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#1D6BF3',
  });
}

export async function getPermissionGranted() {
  const p = await Notifications.getPermissionsAsync();
  return p.granted;
}

/** Asks for permission if needed. Returns true when notifications are allowed. */
export async function requestNotificationPermission() {
  await ensureChannel(); // Android 13+ needs the channel to exist before the prompt
  const cur = await Notifications.getPermissionsAsync();
  if (cur.granted) return true;
  if (!cur.canAskAgain) return false;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
}

/** Schedules the repeating local notification(s) for a reminder. Returns the notification ids. */
export async function scheduleReminder(r) {
  await ensureChannel();
  const content = {
    title: 'Time for your quiz ⏰',
    body: `"${r.setTitle}" is ready when you are. Tap to start.`,
    data: { setId: r.setId },
    sound: true,
  };
  const T = Notifications.SchedulableTriggerInputTypes;
  const ids = [];

  if (r.days.length === 0 || r.days.length === 7) {
    ids.push(
      await Notifications.scheduleNotificationAsync({
        content,
        trigger: { type: T.DAILY, hour: r.hour, minute: r.minute, channelId: CHANNEL_ID },
      })
    );
  } else {
    for (const weekday of r.days) {
      ids.push(
        await Notifications.scheduleNotificationAsync({
          content,
          trigger: { type: T.WEEKLY, weekday, hour: r.hour, minute: r.minute, channelId: CHANNEL_ID },
        })
      );
    }
  }
  return ids;
}

export async function cancelNotifications(ids) {
  await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id).catch(() => {})));
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});
}

/* ── formatting helpers ── */
export function formatTime(hour, minute) {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
}

const SHORT = ['', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAY_ORDER = [2, 3, 4, 5, 6, 7, 1]; // Mon … Sun
export const DAY_LETTERS = { 1: 'S', 2: 'M', 3: 'T', 4: 'W', 5: 'T', 6: 'F', 7: 'S' };

export function describeDays(days) {
  if (days.length === 0 || days.length === 7) return 'Every day';
  const key = [...days].sort().join('');
  if (key === '23456') return 'Weekdays';
  if (key === '17') return 'Weekends';
  return DAY_ORDER.filter((d) => days.includes(d)).map((d) => SHORT[d]).join(', ');
}
