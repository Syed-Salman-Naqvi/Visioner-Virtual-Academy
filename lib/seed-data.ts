import { StudentAccount } from "./types";

/**
 * Default student accounts for testing and initial deployment
 * These will be automatically loaded if no accounts exist in storage
 */
export const DEFAULT_STUDENT_ACCOUNTS: StudentAccount[] = [
  {
    applicationId: "VVA-INTL-159994",
    studentId: "VVA-INTL-159994",
    password: "VVA123456",
    studentName: "Test Student",
    studentEmail: "student@visionervirtualacademy.com",
    createdAt: "Sep 27, 2026",
  },
  {
    applicationId: "VVA-INTL-443603",
    studentId: "VVA-INTL-443603",
    password: "Aiden12345",
    studentName: "Aiden Vance",
    studentEmail: "aiden.vance@example.com",
    createdAt: "Aug 15, 2026",
  },
];

/**
 * Initialize default accounts if storage is empty
 * This ensures deployed apps have test accounts available
 */
export function initializeDefaultAccounts(): void {
  if (typeof window === "undefined") return;
  
  try {
    const existing = localStorage.getItem("vva_student_accounts");
    
    // Only seed if no accounts exist
    if (!existing || JSON.parse(existing).length === 0) {
      console.log("Initializing default student accounts...");
      localStorage.setItem("vva_student_accounts", JSON.stringify(DEFAULT_STUDENT_ACCOUNTS));
      console.log("Default accounts initialized:", DEFAULT_STUDENT_ACCOUNTS.length);
    }
  } catch (error) {
    console.error("Failed to initialize default accounts:", error);
  }
}

/**
 * Get default account by student ID (for fallback authentication)
 */
export function getDefaultAccount(studentId: string): StudentAccount | undefined {
  const normalizedId = studentId.trim().toUpperCase();
  return DEFAULT_STUDENT_ACCOUNTS.find(
    (acc) =>
      acc.studentId.toUpperCase() === normalizedId ||
      acc.applicationId.toUpperCase() === normalizedId ||
      acc.studentId.replace(/[^0-9]/g, "") === normalizedId.replace(/[^0-9]/g, "")
  );
}
