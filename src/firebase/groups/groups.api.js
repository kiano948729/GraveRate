import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config";

//CREATE
export const createGroupDoc = (data) => addDoc(collection(db, "groups"), data);

//READ ONE
export const getGroupDoc = (id) => getDoc(doc(db, "groups", id));

//READ MANY
export const getPublicGroupsQuery = () =>
  query(
    collection(db, "groups"),
    where("private", "==", false),
    orderBy("createdAt", "desc"),
  );

//UPDATE MEMBERS
export const addMember = (groupId, userId) =>
  updateDoc(doc(db, "groups", groupId), {
    members: arrayUnion(userId),
  });

export const removeMember = (groupId, userId) =>
  updateDoc(doc(db, "groups", groupId), {
    members: arrayRemove(userId),
  });
