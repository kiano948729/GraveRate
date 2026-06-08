import {
  sendFriendRequestDoc,
  getIncomingRequestDocs,
  getOutgoingRequestDocs,
  acceptRequestDoc,
  deleteRequestDoc,
  removeFriendDoc,
  blockUserDoc,
  unblockUserDoc,
} from "./friends.api";
import { createNotification } from "../notifications/notifications.service";

export async function sendFriendRequest(fromUid, toUid) {
  await sendFriendRequestDoc(fromUid, toUid);
  await createNotification(toUid, "friend_request", { fromUid });
}

export async function getIncomingRequests(uid) {
  return getIncomingRequestDocs(uid);
}

export async function getOutgoingRequests(uid) {
  return getOutgoingRequestDocs(uid);
}

export async function acceptFriendRequest(requestId, fromUid, toUid) {
  await acceptRequestDoc(requestId, fromUid, toUid);
  await createNotification(fromUid, "friend_accepted", { fromUid: toUid });
}

export async function declineFriendRequest(requestId) {
  return deleteRequestDoc(requestId);
}

export async function cancelFriendRequest(requestId) {
  return deleteRequestDoc(requestId);
}

export async function removeFriend(uid, friendUid) {
  return removeFriendDoc(uid, friendUid);
}

export async function blockUser(uid, targetUid) {
  return blockUserDoc(uid, targetUid);
}

export async function unblockUser(uid, targetUid) {
  return unblockUserDoc(uid, targetUid);
}
