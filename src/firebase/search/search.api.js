import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config";

//USERS
export async function fetchUsers() {
  return getDocs(collection(db, "users"));
}

//GROUPS (public only)
export async function fetchGroups() {
  return getDocs(
    query(collection(db, "groups"), where("private", "==", false)),
  );
}

//POSTS
export async function fetchPosts() {
  return getDocs(collection(db, "posts"));
}

//CEMETERIES
export async function fetchCemeteries() {
  return getDocs(collection(db, "cemeteries"));
}
