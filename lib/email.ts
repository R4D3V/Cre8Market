// Email fallback channel (optional). Only active when RESEND_API_KEY is set.

export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(msg: EmailMessage): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: msg.from || process.env.EMAIL_FROM || "CRE8MARKET <noreply@cre8market.com>",
      to: msg.to,
      subject: msg.subject,
      html: msg.html,
    });
    return { sent: true };
  } catch (err) {
    console.error("Email send failed:", err);
    return { sent: false, error: String(err) };
  }
}