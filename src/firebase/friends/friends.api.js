import {
  doc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config";

//stuur een vriendschapsverzoek (maakt een doc in friendRequests)
export async function sendFriendRequestDoc(fromUid, toUid) {
  return addDoc(collection(db, "friendRequests"), {
    from: fromUid,
    to: toUid,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

//haal verzoeken op die naar de user gestuurd zijn
export async function getIncomingRequestDocs(uid) {
  const snap = await getDocs(
    query(
      collection(db, "friendRequests"),
      where("to", "==", uid),
      where("status", "==", "pending"),
    ),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

//haal verzoeken op die de user zelf gestuurd heeft
export async function getOutgoingRequestDocs(uid) {
  const snap = await getDocs(
    query(
      collection(db, "friendRequests"),
      where("from", "==", uid),
      where("status", "==", "pending"),
    ),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

//accepteer verzoek - update status en voeg elkaar toe aan friends-array
export async function acceptRequestDoc(requestId, fromUid, toUid) {
  await updateDoc(doc(db, "friendRequests", requestId), { status: "accepted" });
  await updateDoc(doc(db, "users", toUid), { friends: arrayUnion(fromUid) });
  await updateDoc(doc(db, "users", fromUid), { friends: arrayUnion(toUid) });
}

//weiger of trek verzoek in - verwijder doc
export async function deleteRequestDoc(requestId) {
  return deleteDoc(doc(db, "friendRequests", requestId));
}

//verwijder vriend - haal elkaar uit elkaars friends-array
export async function removeFriendDoc(uid, friendUid) {
  await updateDoc(doc(db, "users", uid), { friends: arrayRemove(friendUid) });
  await updateDoc(doc(db, "users", friendUid), { friends: arrayRemove(uid) });
}

//blokkeer gebruiker
export async function blockUserDoc(uid, targetUid) {
  await updateDoc(doc(db, "users", uid), {
    blockedUsers: arrayUnion(targetUid),
  });
  //verwijder eventuele vriendschap ook
  await updateDoc(doc(db, "users", uid), { friends: arrayRemove(targetUid) });
  await updateDoc(doc(db, "users", targetUid), { friends: arrayRemove(uid) });
}

//deblokkeer gebruiker
export async function unblockUserDoc(uid, targetUid) {
  return updateDoc(doc(db, "users", uid), {
    blockedUsers: arrayRemove(targetUid),
  });
}
