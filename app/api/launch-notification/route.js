import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { LaunchNotifications } from "@/configs/schema";
import { eq } from "drizzle-orm";
import nodemailer from "nodemailer";
const path = require("path");

export async function POST(request) {
  try {
    const userAuth = await auth();
    const { userId } = userAuth;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { message: "No email address found for user." },
        { status: 400 },
      );
    }

    // Check if user already registered
    const existing = await db
      .select()
      .from(LaunchNotifications)
      .where(eq(LaunchNotifications.clerkId, userId));

    if (existing && existing.length > 0) {
      const record = existing[0];
      if (!record.notifyMe) {
        await db
          .update(LaunchNotifications)
          .set({ notifyMe: true, updatedAt: new Date() })
          .where(eq(LaunchNotifications.clerkId, userId));
      }
      return NextResponse.json({ success: true, alreadyRegistered: true });
    }

    // Insert new record
    await db.insert(LaunchNotifications).values({
      clerkId: userId,
      email: email,
      notifyMe: true,
    });

    // Send confirmation email (in the background, don't fail the request if it fails)
    sendConfirmationEmail(email, user.firstName || "there").catch((err) => {
      console.error("Failed to send confirmation email:", err);
    });

    return NextResponse.json({ success: true, alreadyRegistered: false });
  } catch (error) {
    console.error("Launch notification error:", error);
    return NextResponse.json(
      { message: error?.message || "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    const userAuth = await auth();
    const { userId } = userAuth;

    if (!userId) {
      return NextResponse.json({ registered: false });
    }

    const existing = await db
      .select()
      .from(LaunchNotifications)
      .where(eq(LaunchNotifications.clerkId, userId));

    if (existing && existing.length > 0 && existing[0].notifyMe) {
      return NextResponse.json({ registered: true });
    }

    return NextResponse.json({ registered: false });
  } catch (error) {
    console.error("Error checking notification status:", error);
    return NextResponse.json({ registered: false });
  }
}
async function sendConfirmationEmail(toEmail, firstName) {
  // Only attempt to send if SMTP variables are set (to prevent crashing in dev)
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log("No SMTP credentials configured. Skipping email send to:", toEmail);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });


  const mailOptions = {
    from: `"SeedofCode" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "🌱 You're on the SeedofCode Early Access List",
    text: `Hi ${firstName},\n\nYou're officially on the SeedofCode Early Access list.\nWe'll notify you as soon as the new experience launches.\n\nLaunch Date\n5 September 2026\n\nThank you for being part of the journey.\nBuild. Learn. Grow.\n— Surya\nSeedofCode`,
    html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SeedofCode Early Access</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f4; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.06);">

            <!-- Header / Logo -->
            <tr>
              <td align="center" style="background-color:#0d0d0d; padding:32px 24px;">
                <img src="https://legacy.seedofcode.dev/seed-of-code-logo.png" alt="SeedofCode" width="220" style="display:block; max-width:220px; height:auto;" />
              </td>
            </tr>

            <!-- Accent bar -->
            <tr>
              <td style="height:4px; background: linear-gradient(90deg, #2e7d32, #66bb6a);"></td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px 40px 24px 40px;">
                <p style="margin:0 0 8px 0; font-size:14px; letter-spacing:1px; text-transform:uppercase; color:#2e7d32; font-weight:600;">
                  Early Access Confirmed
                </p>
                <h1 style="margin:0 0 20px 0; font-size:24px; line-height:1.3; color:#1a1a1a; font-weight:700;">
                  Hi ${firstName}, you're on the list 🌱
                </h1>
                <p style="margin:0 0 16px 0; font-size:15px; line-height:1.6; color:#4a4a4a;">
                  You're officially on the <strong>SeedofCode Early Access</strong> list. We'll notify you the moment the new experience launches.
                </p>
              </td>
            </tr>

            <!-- Launch date card -->
            <tr>
              <td style="padding:0 40px 24px 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f8f1; border:1px solid #d7ead7; border-radius:10px;">
                  <tr>
                    <td style="padding:20px 24px;" align="center">
                      <p style="margin:0 0 4px 0; font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#2e7d32; font-weight:600;">
                        Launch Date
                      </p>
                      <p style="margin:0; font-size:20px; color:#1a1a1a; font-weight:700;">
                        5 September 2026
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Closing -->
            <tr>
              <td style="padding:0 40px 32px 40px;">
                <p style="margin:0 0 16px 0; font-size:15px; line-height:1.6; color:#4a4a4a;">
                  Thank you for being part of the journey.
                </p>
                <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; color:#1a1a1a; font-weight:600;">
                  Build. Learn. Grow.
                </p>
                <p style="margin:0; font-size:14px; line-height:1.6; color:#4a4a4a;">
                  — Surya<br/>
                  <span style="color:#2e7d32; font-weight:600;">SeedofCode</span>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#fafafa; padding:20px 40px; border-top:1px solid #eeeeee;" align="center">
                <p style="margin:0; font-size:12px; color:#9a9a9a; line-height:1.6;">
                  You're receiving this because you signed up for SeedofCode Early Access.<br/>
                  © ${new Date().getFullYear()} SeedofCode. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent:", info.messageId);

  // Update DB that notification was sent
  await db
    .update(LaunchNotifications)
    .set({ notificationSent: true, notificationSentAt: new Date() })
    .where(eq(LaunchNotifications.email, toEmail));
}
