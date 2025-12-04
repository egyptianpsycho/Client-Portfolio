//api/calendar/book/route.js
import { createEvent } from "@/app/utils/googleCalendar";
import nodemailer from "nodemailer";
import { format, parseISO } from "date-fns";
import { NextResponse } from "next/server";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE = "true",
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM,
  EMAIL_TO,
  SITE_NAME = "Abbas Visuals",
  PHOTOGRAPHER_TZ = "GST",
} = process.env;

if (!SMTP_HOST || !SMTP_USER) {
  console.warn("⚠️ SMTP not configured. Email notifications will be skipped.");
}

async function sendEmail({ subject, html }) {
  // Check if essential SMTP configs are present
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !EMAIL_TO) {
    console.warn("⚠️ Email sending skipped: Missing SMTP configuration.");
    return { skipped: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 465),
      secure: SMTP_SECURE === "true",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: EMAIL_FROM || SMTP_USER,
      to: EMAIL_TO,
      subject,
      html,
    });

    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}

// POST handler for /api/calendar/book
export async function POST(request) {
  try {
    // Get body data from request
    const body = await request.json();
    const { name, email, phone, service, place, startISO, endISO, notes } = body;

    console.log("📅 Booking request received:", { 
      name, 
      email, 
      phone, 
      service, 
      place, 
      startISO, 
      endISO 
    });

    // Validate required fields
    if (!name || !email || !phone || !service || !place || !startISO || !endISO) {
      const missingFields = [];
      if (!name) missingFields.push("name");
      if (!email) missingFields.push("email");
      if (!phone) missingFields.push("phone");
      if (!service) missingFields.push("service");
      if (!place) missingFields.push("place");
      if (!startISO) missingFields.push("startISO");
      if (!endISO) missingFields.push("endISO");
      
      return NextResponse.json(
        { 
          error: `Missing required fields: ${missingFields.join(", ")}`,
          missingFields 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address format" },
        { status: 400 }
      );
    }

    // Validate phone format (basic check)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Validate date formats
    let startDate, endDate;
    try {
      startDate = parseISO(startISO);
      endDate = parseISO(endISO);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date format");
      }
      
      if (endDate <= startDate) {
        return NextResponse.json(
          { error: "End time must be after start time" },
          { status: 400 }
        );
      }

      // Check if booking is in the past
      const now = new Date();
      if (startDate < now) {
        return NextResponse.json(
          { error: "Cannot book sessions in the past" },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid date format. Please use ISO 8601 format." },
        { status: 400 }
      );
    }

    // Create event summary and description
    const summary = `${service} — ${name}`;
    const description = `
📸 Booking Details
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Client Name: ${name}
📧 Email: ${email}
📞 Phone: ${phone}
🎯 Service: ${service}
📍 Location: ${place}
📝 Notes: ${notes || "No additional notes"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Booked via Abbas Visuals AI Assistant
    `.trim();

    // Create event in Google Calendar
    console.log("📝 Creating calendar event...");
    const event = await createEvent({
      summary,
      description,
      startISO,
      endISO,
    });

    console.log("✅ Calendar event created:", event.id);

    // Format dates for email
    const startPretty = format(startDate, "EEEE, MMMM do, yyyy 'at' h:mm a");
    const endPretty = format(endDate, "h:mm a");
    const duration = Math.round((endDate - startDate) / (1000 * 60)); // minutes

    // Send notification email to photographer
    const subject = `🎨 New Booking: ${name} - ${service}`;
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6; 
      color: #333;
      background: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container { 
      max-width: 600px; 
      margin: 40px auto; 
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white; 
      padding: 40px 30px; 
      text-align: center; 
    }
    .header h1 { 
      margin: 0; 
      font-size: 32px;
      font-weight: 700;
    }
    .header p {
      margin: 10px 0 0 0;
      opacity: 0.95;
      font-size: 16px;
    }
    .content { 
      padding: 40px 30px; 
    }
    .booking-card {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 12px;
      padding: 24px;
      margin: 20px 0;
    }
    .info-row { 
      margin: 16px 0; 
      padding: 16px;
      background: white; 
      border-radius: 8px; 
      border-left: 4px solid #667eea;
      display: flex;
      align-items: center;
    }
    .info-icon {
      font-size: 20px;
      margin-right: 12px;
      min-width: 24px;
    }
    .info-label { 
      font-weight: 600; 
      color: #667eea; 
      margin-right: 8px;
      min-width: 100px;
    }
    .info-value {
      color: #333;
      flex: 1;
    }
    .highlight-box {
      background: #fff3cd;
      border: 2px solid #ffc107;
      border-radius: 8px;
      padding: 16px;
      margin: 20px 0;
      text-align: center;
    }
    .button { 
      display: inline-block; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white; 
      padding: 14px 32px; 
      text-decoration: none; 
      border-radius: 8px; 
      margin-top: 24px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      transition: transform 0.2s;
    }
    .button:hover {
      transform: translateY(-2px);
    }
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #ddd, transparent);
      margin: 30px 0;
    }
    .footer { 
      text-align: center; 
      padding: 30px;
      background: #f8f9fa;
      color: #6c757d; 
      font-size: 13px;
      border-top: 1px solid #e9ecef;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 New Booking!</h1>
      <p>You have a new photography session scheduled</p>
    </div>
    
    <div class="content">
      <div class="booking-card">
        <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">📸 ${service}</h2>
        
        <div class="info-row">
          <span class="info-icon">👤</span>
          <span class="info-label">Client:</span>
          <span class="info-value"><strong>${name}</strong></span>
        </div>
        
        <div class="info-row">
          <span class="info-icon">📧</span>
          <span class="info-label">Email:</span>
          <span class="info-value"><a href="mailto:${email}" style="color: #667eea;">${email}</a></span>
        </div>
        
        <div class="info-row">
          <span class="info-icon">📞</span>
          <span class="info-label">Phone:</span>
          <span class="info-value"><a href="tel:${phone}" style="color: #667eea;">${phone}</a></span>
        </div>
        
        <div class="divider"></div>
        
        <div class="info-row">
          <span class="info-icon">📍</span>
          <span class="info-label">Location:</span>
          <span class="info-value">${place}</span>
        </div>
        
        <div class="info-row">
          <span class="info-icon">🕐</span>
          <span class="info-label">When:</span>
          <span class="info-value">${startPretty}</span>
        </div>
        
        <div class="info-row">
          <span class="info-icon">⏱️</span>
          <span class="info-label">Duration:</span>
          <span class="info-value">${duration} minutes (until ${endPretty})</span>
        </div>
        
        ${notes ? `
        <div class="divider"></div>
        <div class="info-row">
          <span class="info-icon">📝</span>
          <span class="info-label">Notes:</span>
          <span class="info-value">${notes}</span>
        </div>
        ` : ''}
      </div>
      
      <div class="highlight-box">
        <strong>⏰ Time Zone:</strong> ${PHOTOGRAPHER_TZ}<br>
        <small style="color: #856404;">Make sure to adjust for your local timezone if different</small>
      </div>
      
      <div style="text-align: center;">
        <a href="${event.htmlLink}" class="button">📅 Open in Google Calendar</a>
      </div>
    </div>
    
    <div class="footer">
      <p style="margin: 0 0 10px 0;"><strong>Automated Booking Confirmation</strong></p>
      <p style="margin: 0;">This booking was made through ${SITE_NAME} AI Assistant</p>
      <p style="margin: 10px 0 0 0;">
        <a href="mailto:${email}">Reply to Client</a> • 
        <a href="tel:${phone}">Call Client</a>
      </p>
    </div>
  </div>
</body>
</html>
    `;

    try {
      await sendEmail({ subject, html });
      console.log("✅ Notification email sent");
    } catch (emailError) {
      console.error("⚠️ Email failed but booking was created:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ 
      ok: true, 
      message: "Booking created successfully",
      event: {
        id: event.id,
        htmlLink: event.htmlLink,
        summary: event.summary,
        start: event.start,
        end: event.end,
      }
    });
    
  } catch (err) {
    console.error("❌ Booking Error:", err);
    
    // Handle specific Google Calendar errors
    if (err.message?.includes("calendar")) {
      return NextResponse.json(
        { 
          error: "Unable to access calendar service. Please check your calendar configuration.",
          details: process.env.NODE_ENV === "development" ? err.message : undefined
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: err.message || "Failed to create booking",
        details: process.env.NODE_ENV === "development" ? err.stack : undefined
      },
      { status: 500 }
    );
  }
}