// The email Veda receives for every demo-class booking. Plain HTML tables and inline
// styles, so it reads well in Gmail on a phone and on a computer. Used only on the server.

import type { Enquiry } from "./enquiry";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** e.g. "29 Sept 2026, 6:45 pm IST" */
export function istTimestamp(date: Date) {
  const formatted = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
  return `${formatted} IST`;
}

export function bookingSubject(e: Enquiry) {
  return `New demo class booking: ${e.studentName}, Grade ${e.grade}`;
}

export function bookingEmail(e: Enquiry, submittedAt: Date) {
  const phoneDisplay = `+91 ${e.phone.slice(0, 5)} ${e.phone.slice(5)}`;
  const tel = `tel:+91${e.phone}`;
  const whatsapp = `https://wa.me/91${e.phone}`;
  const when = istTimestamp(submittedAt);

  const rows: [string, string][] = [
    ["Parent's name", escape(e.parentName)],
    ["Student's name", escape(e.studentName)],
    ["Grade", escape(e.grade)],
    ["Preparing for", escape(e.preparingFor)],
    [
      "Phone",
      `<a href="${tel}" style="color:#8a4f10;font-weight:600;text-decoration:underline">${phoneDisplay}</a>` +
        ` &nbsp;·&nbsp; <a href="${whatsapp}" style="color:#8a4f10;text-decoration:underline">WhatsApp</a>`,
    ],
    ...(e.email ? ([["Email", `<a href="mailto:${escape(e.email)}" style="color:#8a4f10">${escape(e.email)}</a>`]] as [string, string][]) : []),
    ["Message", e.message ? escape(e.message).replace(/\n/g, "<br>") : `<span style="color:#7a6353">No message</span>`],
    ["Submitted", when],
  ];

  const html = `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#f2e8d9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2b1b12">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2e8d9;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #e3d4bd">
        <tr><td style="padding:24px 24px 8px">
          <p style="margin:0;font-size:13px;color:#7a6353">Veda website</p>
          <h1 style="margin:6px 0 0;font-size:22px;line-height:1.3;font-weight:600">New demo class booking</h1>
          <p style="margin:8px 0 0;font-size:15px;line-height:1.5;color:#4a3528">Call the parent to fix a day and time for the free demo class.</p>
        </td></tr>
        <tr><td style="padding:12px 24px 8px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;line-height:1.5">
            ${rows
              .map(
                ([k, v]) => `<tr>
              <td style="padding:10px 0;border-top:1px solid #efe4d3;color:#7a6353;width:38%;vertical-align:top">${k}</td>
              <td style="padding:10px 0;border-top:1px solid #efe4d3;vertical-align:top">${v}</td>
            </tr>`,
              )
              .join("")}
          </table>
        </td></tr>
        <tr><td style="padding:8px 24px 24px">
          <a href="${tel}" style="display:inline-block;background:#e39b2e;color:#2b1b12;font-weight:600;font-size:15px;text-decoration:none;padding:12px 20px;border-radius:6px">Call ${phoneDisplay}</a>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:12px;color:#7a6353">Sent automatically from the "Book a free demo class" form.</p>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    "New demo class booking",
    "",
    `Parent's name: ${e.parentName}`,
    `Student's name: ${e.studentName}`,
    `Grade: ${e.grade}`,
    `Preparing for: ${e.preparingFor}`,
    `Phone: ${phoneDisplay} (${tel})`,
    ...(e.email ? [`Email: ${e.email}`] : []),
    `Message: ${e.message || "No message"}`,
    `Submitted: ${when}`,
  ].join("\n");

  return { html, text };
}
