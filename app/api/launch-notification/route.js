import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { LaunchNotifications } from "@/configs/schema";
import { eq } from "drizzle-orm";
import nodemailer from "nodemailer";

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
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <p>Hi ${firstName},</p>
        <p>You're officially on the SeedofCode Early Access list.</p>
        <p>We'll notify you as soon as the new experience launches.</p>
        <br/>
        <p><strong>Launch Date</strong><br/>5 September 2026</p>
        <br/>
        <p>Thank you for being part of the journey.<br/>Build. Learn. Grow.</p>
        <p>— Surya<br/>SeedofCode</p>
      </div>
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
