import {
  createGroupDoc,
  getGroupDoc,
  getPublicGroupsQuery,
  addMember,
  removeMember,
} from "./groups.api";

import { getDocs } from "firebase/firestore";

// CREATE GROUP
export async function createGroup(ownerId, name, description, isPrivate) {
  return createGroupDoc({
    name,
    description,
    private: isPrivate,
    ownerId,
    members: [ownerId],
    createdAt: Date.now(),
  });
}

// GET ONE
export async function getGroup(groupId) {
  const snap = await getGroupDoc(groupId);

  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() };
}

// GET ALL PUBLIC
export async function getAllGroups() {
  const snap = await getDocs(getPublicGroupsQuery());

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

// JOIN / LEAVE
export const joinGroup = addMember;
export const leaveGroup = removeMember;
