import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is not configured.");
  }

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: {
  to: string;
  resetUrl: string;
}) {
  return sendEmail({
    to,
    subject: "Reset your JobTrack AI password",
    html: `
      <div
        style="
          margin: 0;
          padding: 40px 20px;
          background-color: #f8fafc;
          font-family: Arial, Helvetica, sans-serif;
        "
      >
        <div
          style="
            max-width: 560px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 32px;
          "
        >
          <h1
            style="
              margin: 0 0 16px;
              color: #0f172a;
              font-size: 24px;
            "
          >
            Reset your password
          </h1>

          <p
            style="
              margin: 0 0 16px;
              color: #475569;
              font-size: 15px;
              line-height: 1.6;
            "
          >
            We received a request to reset the password for your JobTrack AI
            account.
          </p>

          <p
            style="
              margin: 0 0 24px;
              color: #475569;
              font-size: 15px;
              line-height: 1.6;
            "
          >
            Click the button below to create a new password. This link will
            expire in 15 minutes.
          </p>

          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background-color: #0f172a;
              color: #ffffff;
              text-decoration: none;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
            "
          >
            Reset Password
          </a>

          <p
            style="
              margin: 24px 0 0;
              color: #64748b;
              font-size: 13px;
              line-height: 1.6;
            "
          >
            If you didn't request a password reset, you can safely ignore this
            email.
          </p>

          <p
            style="
              margin: 16px 0 0;
              color: #94a3b8;
              font-size: 12px;
            "
          >
            JobTrack AI
          </p>
        </div>
      </div>
    `,
  });
}
