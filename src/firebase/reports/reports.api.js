import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config";

export async function addReportDoc(reportedUid, reportedBy, reason, details) {
  return addDoc(collection(db, "reports"), {
    reportedUid,
    reportedBy,
    reason,
    details,
    status: "open",
    createdAt: serverTimestamp(),
  });
}
