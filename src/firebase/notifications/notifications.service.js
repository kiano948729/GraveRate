import {
  addNotificationDoc,
  getNotificationDocs,
  markReadDoc,
  markAllReadDoc,
} from "./notifications.api";

export async function createNotification(uid, type, data = {}) {
  return addNotificationDoc(uid, type, data);
}

export async function getNotifications(uid) {
  return getNotificationDocs(uid);
}

export async function markNotificationRead(notificationId) {
  return markReadDoc(notificationId);
}

export async function markAllNotificationsRead(uid) {
  return markAllReadDoc(uid);
}
