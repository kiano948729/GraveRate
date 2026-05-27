import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "./config";

const googleProvider = new GoogleAuthProvider();

export async function registerUser(username, email, password) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    username,
    email,
    bio: "",
    profilePicture: "",
    private: false,
    friends: [],
    blockedUsers: [],
    upvotes: 0,
    createdAt: serverTimestamp(),
  });

  return user;
}

export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  return userCredential.user;
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);

  const user = result.user;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      username: user.displayName,
      email: user.email,
      bio: "",
      profilePicture: user.photoURL,
      private: false,
      friends: [],
      blockedUsers: [],
      upvotes: 0,
      createdAt: serverTimestamp(),
    });
  }

  return user;
}

export async function logoutUser() {
  await signOut(auth);
}
