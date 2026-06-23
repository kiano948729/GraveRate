import { addReportDoc } from "./reports.api";

export async function reportUser(
  reportedUid,
  reportedBy,
  reason,
  details = "",
) {
  return addReportDoc(reportedUid, reportedBy, reason, details);
}
