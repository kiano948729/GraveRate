import { db } from "./config";
import { collection, getDocs } from "firebase/firestore";

export async function testConnection() {
  try {
    const querySnapshot = await getDocs(collection(db, "test"));

    console.log("Firebase connected!");
    console.log("Documents:", querySnapshot.size);
  } catch (error) {
    console.error("Firebase error:", error);
  }
}