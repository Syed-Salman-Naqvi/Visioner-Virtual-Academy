import { NextResponse } from "next/server";

export const runtime = "nodejs";

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const recipient =
      process.env.ENROLLMENT_NOTIFICATION_EMAIL ||
      "visionervirtualacademy@gmail.com";
    const from =
      process.env.RESEND_FROM_EMAIL ||
      "Visioner Virtual Academy <onboarding@resend.dev>";

    if (!apiKey) {
      console.error("Enrollment notification is not configured: RESEND_API_KEY is missing.");
      return NextResponse.json(
        { ok: false, error: "Email notifications are not configured." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const application = body?.application;
    const details = body?.details;

    if (
      !application ||
      typeof application.id !== "string" ||
      typeof application.studentName !== "string" ||
      !application.studentName.trim() ||
      typeof application.studentEmail !== "string" ||
      !application.studentEmail.trim()
    ) {
      return NextResponse.json(
        { ok: false, error: "Invalid enrollment submission." },
        { status: 400 }
      );
    }

    const rows: Array<[string, unknown]> = [
      ["Application reference", application.id],
      ["Submitted", application.createdAt],
      ["Student name", application.studentName],
      ["Student / parent email", application.studentEmail],
      ["Parent / guardian", application.parentName],
      ["Parent email", application.parentEmail],
      ["Phone", application.parentPhone],
      ["Date of birth", application.dateOfBirth],
      ["Nationality", application.nationality],
      ["Country of residence", application.countryOfResidence],
      ["City", application.city],
      ["Program / board", application.targetTrack],
      ["Grade / year", application.gradeLevel],
      ["Time zone", application.timeZone],
      ["Preferred schedule", application.preferredCohortSlot],
      ["Previous school", details?.previousSchool],
      ["Previous school country", details?.previousSchoolCountry],
      ["Subjects of interest", Array.isArray(details?.subjectsOfInterest) ? details.subjectsOfInterest.join(", ") : ""],
      ["Preferred contact", details?.preferredContact],
      ["Statement of purpose", application.statementOfPurpose],
      ["Documents listed", Array.isArray(application.documentsAttached) ? application.documentsAttached.join(", ") : ""],
    ];

    const text = [
      "A new student enrollment application has been submitted to Visioner Virtual Academy.",
      "",
      ...rows.map(([label, value]) => `${label}: ${String(value ?? "Not provided")}`),
      "",
      "Open the academy portal to review the application.",
    ].join("\n");

    const html = `
      <h2>New Student Enrollment</h2>
      <p>A new enrollment application was submitted to Visioner Virtual Academy.</p>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:720px">
        ${rows.map(([label, value]) => `<tr><th align="left" valign="top" style="border:1px solid #ddd;background:#f7f7f7">${escapeHtml(label)}</th><td style="border:1px solid #ddd;white-space:pre-wrap">${escapeHtml(value || "Not provided")}</td></tr>`).join("")}
      </table>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        subject: `New enrollment: ${application.studentName} (${application.id})`,
        text,
        html,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Resend enrollment notification failed:", response.status, errorBody);
      return NextResponse.json(
        { ok: false, error: "Email provider could not send the notification." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Enrollment notification error:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to process enrollment notification." },
      { status: 500 }
    );
  }
}
