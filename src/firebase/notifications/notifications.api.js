import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config";

export async function addNotificationDoc(uid, type, data) {
  return addDoc(collection(db, "notifications"), {
    uid,
    type,
    data,
    read: false,
    createdAt: serverTimestamp(),
  });
}

export async function getNotificationDocs(uid) {
  const snap = await getDocs(
    query(
      collection(db, "notifications"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc"),
    ),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function markReadDoc(notificationId) {
  return updateDoc(doc(db, "notifications", notificationId), { read: true });
}

export async function markAllReadDoc(uid) {
  const snap = await getDocs(
    query(
      collection(db, "notifications"),
      where("uid", "==", uid),
      where("read", "==", false),
    ),
  );
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.update(d.ref, { read: true }));
  return batch.commit();
}
