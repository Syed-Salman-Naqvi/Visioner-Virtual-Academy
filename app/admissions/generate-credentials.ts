import { saveStudentAccountToCloud, normalizeId } from "@/lib/database";
import { AdmissionsApplication } from "@/lib/types";

/**
 * Generate unique student credentials after enrollment
 */
export async function generateStudentCredentials(
  application: AdmissionsApplication
) {
  if (!application || !application.id || !application.studentName) {
    throw new Error("Invalid application data");
  }

  const countryCode = (application.countryOfResidence || "INTL")
    .substring(0, 3)
    .toUpperCase();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const studentId = `VVA-${countryCode}-${randomNum}`;

  const firstName = (application.studentName || "Student").split(" ")[0];
  const passwordNum = Math.floor(10000 + Math.random() * 90000);
  const studentPassword = `${firstName}${passwordNum}`;

  const studentAccount = {
    applicationId: application.id,
    studentId: studentId,
    password: studentPassword,
    studentName: application.studentName,
    studentEmail: application.studentEmail || "",
    createdAt: new Date().toISOString(),
  };

  const { success, accountId } = await saveStudentAccountToCloud(studentAccount);

  if (!success) {
    throw new Error(
      "Failed to save credentials to database. Please try again."
    );
  }

  return {
    studentId,
    studentPassword,
    accountId,
    message: `✅ Credentials generated and saved to cloud database. Student can now login from any device.`,
  };
}

/**
 * Verify credentials are synced to cloud
 */
export async function verifySyncedCredentials(studentId: string): Promise<boolean> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { supabase } = await import("@/lib/supabase");
    if (!supabase) return false;

    const normalized = normalizeId(studentId);
    const { data } = await supabase
      .from("student_accounts")
      .select("student_id")
      .eq("student_id", normalized)
      .single();

    return !!data;
  } catch (e) {
    console.error("Sync verification error:", e);
    return false;
  }
}
