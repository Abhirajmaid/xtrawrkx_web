import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Email configuration - uses environment variables for security
const createTransporter = () => {
  // Check if environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration missing. Please set EMAIL_USER and EMAIL_PASS in .env.local');
  }

  // For Google Workspace email (xsos@xtrawrkx.com)
  return nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "hello@xtrawrkx.com",
      pass: "yhws dmzi qtcc icgr",
    },
  });
};

// Email templates
const getRegistrationEmailTemplate = (data) => {
  const {
    registrationId,
    companyName,
    primaryContactName,
    eventTitle,
    eventDate,
    eventLocation,
    ticketType,
    totalCost,
    paymentStatus
  } = data;

  const isPaymentPending = paymentStatus === 'pending';
  const isPaid = paymentStatus === 'completed';

  return {
    subject: `Registration ${isPaid ? 'Confirmed' : 'Received'} - ${eventTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Registration ${isPaid ? 'Confirmation' : 'Received'}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
            margin: 10px 0;
          }
          .confirmed {
            background: #d4edda;
            color: #155724;
          }
          .pending {
            background: #fff3cd;
            color: #856404;
          }
          .detail-row {
            display: flex;
            margin: 10px 0;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }
          .detail-label {
            font-weight: bold;
            min-width: 150px;
          }
          .detail-value {
            flex: 1;
          }
          .next-steps {
            background: #e7f3ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px 5px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 ${isPaid ? 'Registration Confirmed!' : 'Registration Received!'}</h1>
          <p>Thank you for registering with xtrawrkx Events</p>
        </div>
        
        <div class="content">
          <div class="status-badge ${isPaid ? 'confirmed' : 'pending'}">
            ${isPaid ? '✅ Registration Confirmed' : '⏳ Registration Received'}
          </div>
          
          <h2>Hello ${primaryContactName},</h2>
          
          <p>
            ${isPaid
        ? `We are pleased to confirm your registration for <strong>${eventTitle}</strong>. Your payment has been successfully processed and your spot is secured.`
        : `Thank you for registering for <strong>${eventTitle}</strong>. We have received your registration details.`
      }
          </p>

          ${isPaymentPending && totalCost > 0 ? `
            <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <h3 style="color: #856404; margin-top: 0;">⚠️ Payment Required</h3>
              <p style="color: #856404; margin-bottom: 0;">
                Your registration is currently pending. Please complete the payment of <strong>₹${totalCost}</strong> to confirm your spot.
              </p>
            </div>
          ` : ''}

          <h3>Registration Details:</h3>
          <div class="detail-row">
            <div class="detail-label">Registration ID:</div>
            <div class="detail-value"><strong>${registrationId}</strong></div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Company:</div>
            <div class="detail-value">${companyName}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Event:</div>
            <div class="detail-value">${eventTitle}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Date & Time:</div>
            <div class="detail-value">${eventDate}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Location:</div>
            <div class="detail-value">${eventLocation}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Ticket Type:</div>
            <div class="detail-value">${ticketType}</div>
          </div>
          ${totalCost > 0 ? `
            <div class="detail-row">
              <div class="detail-label">Amount:</div>
              <div class="detail-value">₹${totalCost}</div>
            </div>
          ` : ''}

          <div class="next-steps">
            <h3>📋 What's Next?</h3>
            <ul>
              ${isPaid
        ? `
                  <li>✅ Your registration is confirmed</li>
                  <li>✅ Event details and instructions will follow closer to the date</li>
                  <li>✅ You will receive your event pass shortly</li>
                  <li>✅ Join our community for updates and networking opportunities</li>
                `
        : `
                  <li>Complete payment to confirm your registration</li>
                  <li>Once payment is received, you'll get a confirmation email</li>
                  <li>Event pass will be sent after payment confirmation</li>
                  <li>Contact support if you need assistance with payment</li>
                `
      }
            </ul>
          </div>

          ${isPaid ? `
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://xtrawrkx.com/events" class="btn">View All Events</a>
              <a href="https://xtrawrkx.com/communities" class="btn">Join Our Community</a>
            </div>
          ` : ''}
        </div>

        <div class="footer">
          <p>
            <strong>Need help?</strong><br>
            Contact our support team at <a href="mailto:support@xtrawrkx.com">support@xtrawrkx.com</a><br>
            Registration ID: ${registrationId}
          </p>
          <p>
            <strong>xtrawrkx Events</strong><br>
            Empowering Professional Growth Through Strategic Networking
          </p>
        </div>
      </body>
      </html>
    `
  };
};

const getPaymentConfirmationTemplate = (data) => {
  const {
    registrationId,
    companyName,
    primaryContactName,
    eventTitle,
    eventDate,
    eventLocation,
    ticketType,
    totalCost,
    paymentId
  } = data;

  return {
    subject: `Payment Received & Registration Confirmed - ${eventTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .success-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
            margin: 10px 0;
            background: #d4edda;
            color: #155724;
          }
          .detail-row {
            display: flex;
            margin: 10px 0;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }
          .detail-label {
            font-weight: bold;
            min-width: 150px;
          }
          .detail-value {
            flex: 1;
          }
          .next-steps {
            background: #e7f3ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            background: #28a745;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px 5px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>💳 Payment Received!</h1>
          <p>Your registration is now confirmed</p>
        </div>
        
        <div class="content">
          <div class="success-badge">
            ✅ Payment Successful
          </div>
          
          <h2>Hello ${primaryContactName},</h2>
          
          <p>
            We are pleased to inform you that we have received your payment for <strong>${eventTitle}</strong>. 
            Your registration is now confirmed and your spot is secured.
          </p>

          <p><strong>You will receive your confirmation pass shortly.</strong></p>

          <h3>Payment Details:</h3>
          <div class="detail-row">
            <div class="detail-label">Payment ID:</div>
            <div class="detail-value"><strong>${paymentId}</strong></div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Amount Paid:</div>
            <div class="detail-value"><strong>₹${totalCost}</strong></div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Registration ID:</div>
            <div class="detail-value">${registrationId}</div>
          </div>

          <h3>Event Details:</h3>
          <div class="detail-row">
            <div class="detail-label">Company:</div>
            <div class="detail-value">${companyName}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Event:</div>
            <div class="detail-value">${eventTitle}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Date & Time:</div>
            <div class="detail-value">${eventDate}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Location:</div>
            <div class="detail-value">${eventLocation}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Ticket Type:</div>
            <div class="detail-value">${ticketType}</div>
          </div>

          <div class="next-steps">
            <h3>📋 What's Next?</h3>
            <ul>
              <li>✅ Your payment has been processed successfully</li>
              <li>✅ Registration is confirmed</li>
              <li>✅ You will receive your event pass shortly</li>
              <li>✅ Event details and instructions will follow closer to the date</li>
              <li>✅ Join our community for updates and networking opportunities</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 20px 0;">
            <a href="https://xtrawrkx.com/events" class="btn">View All Events</a>
            <a href="https://xtrawrkx.com/communities" class="btn">Join Our Community</a>
          </div>
        </div>

        <div class="footer">
          <p>
            <strong>Need help?</strong><br>
            Contact our support team at <a href="mailto:support@xtrawrkx.com">support@xtrawrkx.com</a><br>
            Payment ID: ${paymentId} | Registration ID: ${registrationId}
          </p>
          <p>
            <strong>xtrawrkx Events</strong><br>
            Empowering Professional Growth Through Strategic Networking
          </p>
        </div>
      </body>
      </html>
    `
  };
};

// Admin notification template
const getAdminNotificationTemplate = (data, type) => {
  const {
    registrationId,
    companyName,
    primaryContactName,
    primaryContactEmail,
    companyEmail,
    eventTitle,
    eventDate,
    eventLocation,
    ticketType,
    totalCost,
    paymentStatus,
    paymentId,
    season
  } = data;

  const isPaymentNotification = type === 'payment_confirmation';
  const isSeasonRegistration = season && eventTitle.includes('Season');

  return {
    subject: `🚨 ${isPaymentNotification ? 'Payment Received' : 'New Registration'} - ${eventTitle}`,
    html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Admin Notification</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 700px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background: ${isPaymentNotification ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' : 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)'};
                        color: white;
                        padding: 20px;
                        text-align: center;
                        border-radius: 10px 10px 0 0;
                    }
                    .content {
                        background: #f8f9fa;
                        padding: 30px;
                        border-radius: 0 0 10px 10px;
                        border: 1px solid #dee2e6;
                    }
                    .alert {
                        background: ${isPaymentNotification ? '#d4edda' : '#fff3cd'};
                        border: 1px solid ${isPaymentNotification ? '#c3e6cb' : '#ffeeba'};
                        color: ${isPaymentNotification ? '#155724' : '#856404'};
                        padding: 15px;
                        border-radius: 8px;
                        margin: 15px 0;
                        font-weight: bold;
                    }
                    .detail-section {
                        background: white;
                        padding: 20px;
                        margin: 15px 0;
                        border-radius: 8px;
                        border: 1px solid #dee2e6;
                    }
                    .detail-row {
                        display: flex;
                        margin: 8px 0;
                        padding: 8px 0;
                        border-bottom: 1px solid #eee;
                    }
                    .detail-label {
                        font-weight: bold;
                        min-width: 180px;
                        color: #495057;
                    }
                    .detail-value {
                        flex: 1;
                        color: #212529;
                    }
                    .section-title {
                        color: #495057;
                        font-size: 18px;
                        font-weight: bold;
                        margin-bottom: 10px;
                        border-bottom: 2px solid #007bff;
                        padding-bottom: 5px;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        color: #6c757d;
                        font-size: 14px;
                        background: #e9ecef;
                        margin-top: 20px;
                        border-radius: 8px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${isPaymentNotification ? '💰 Payment Received!' : '📝 New Registration Alert!'}</h1>
                    <p>xtrawrkx Admin Notification</p>
                </div>
                
                <div class="content">
                    <div class="alert">
                        ${isPaymentNotification
        ? `💳 Payment of ₹${totalCost} received for ${eventTitle}`
        : `🆕 New registration received for ${eventTitle}`
      }
                    </div>

                    <div class="detail-section">
                        <div class="section-title">📋 Registration Information</div>
                        <div class="detail-row">
                            <div class="detail-label">Registration ID:</div>
                            <div class="detail-value"><strong>${registrationId}</strong></div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Event:</div>
                            <div class="detail-value">${eventTitle}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Date & Location:</div>
                            <div class="detail-value">${eventDate} | ${eventLocation}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Ticket Type:</div>
                            <div class="detail-value">${ticketType}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Payment Status:</div>
                            <div class="detail-value">
                                <span style="color: ${paymentStatus === 'completed' ? '#28a745' : '#dc3545'}; font-weight: bold;">
                                    ${paymentStatus === 'completed' ? '✅ PAID' : '⏳ PENDING'}
                                </span>
                            </div>
                        </div>
                        ${totalCost > 0 ? `
                            <div class="detail-row">
                                <div class="detail-label">Amount:</div>
                                <div class="detail-value"><strong>₹${totalCost}</strong></div>
                            </div>
                        ` : ''}
                        ${paymentId ? `
                            <div class="detail-row">
                                <div class="detail-label">Payment ID:</div>
                                <div class="detail-value"><strong>${paymentId}</strong></div>
                            </div>
                        ` : ''}
                    </div>

                    <div class="detail-section">
                        <div class="section-title">🏢 Company Details</div>
                        <div class="detail-row">
                            <div class="detail-label">Company Name:</div>
                            <div class="detail-value">${companyName}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Primary Contact:</div>
                            <div class="detail-value">${primaryContactName}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Contact Email:</div>
                            <div class="detail-value"><a href="mailto:${primaryContactEmail}">${primaryContactEmail}</a></div>
                        </div>
                        ${companyEmail && companyEmail !== primaryContactEmail ? `
                            <div class="detail-row">
                                <div class="detail-label">Company Email:</div>
                                <div class="detail-value"><a href="mailto:${companyEmail}">${companyEmail}</a></div>
                            </div>
                        ` : ''}
                    </div>

                    ${isSeasonRegistration && data.selectedEvents ? `
                        <div class="detail-section">
                            <div class="section-title">📅 Selected Events</div>
                            ${data.selectedEvents.map(event => `
                                <div class="detail-row">
                                    <div class="detail-label">Event:</div>
                                    <div class="detail-value">${event.title || event.id}</div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://xtrawrkx.com/admin" 
                           style="display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                            View in Admin Panel
                        </a>
                    </div>
                </div>

                <div class="footer">
                    <p><strong>xtrawrkx Admin Panel</strong></p>
                    <p>This is an automated notification for new registrations and payments.</p>
                    <p>Registration Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                </div>
            </body>
            </html>
        `
  };
};

export async function POST(request) {
  try {
    const { type, data } = await request.json();

    // Validate required data
    if (!data || !data.primaryContactEmail) {
      return NextResponse.json(
        { error: "Missing required email data" },
        { status: 400 }
      );
    }

    // Create email transporter
    const transporter = createTransporter();

    let emailTemplate;

    // Generate appropriate email template based on type
    switch (type) {
      case 'registration':
        emailTemplate = getRegistrationEmailTemplate(data);
        break;
      case 'payment_confirmation':
        emailTemplate = getPaymentConfirmationTemplate(data);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        );
    }

    // Prepare recipient list
    const recipients = [data.primaryContactEmail];

    // Add company email if different from primary contact
    if (data.companyEmail && data.companyEmail !== data.primaryContactEmail) {
      recipients.push(data.companyEmail);
    }

    // Email configuration for user/company
    const mailOptions = {
      from: `"xtrawrkx Events" <${process.env.EMAIL_USER || 'hiten@xtrawrkx.com'}>`,
      replyTo: 'xsos@xtrawrkx.com', // Replies go to the group email
      to: recipients.join(', '),
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    };

    // Send email to user/company
    await transporter.sendMail(mailOptions);

    // Send notification to xtrawrkx admin
    const adminEmails = "xsos@xtrawrkx.com, hiten@xtrawrkx.com";
    const adminEmailTemplate = getAdminNotificationTemplate(data, type);

    const adminMailOptions = {
      from: `"xtrawrkx Events" <hello@xtrawrkx.com>`,
      replyTo: 'xsos@xtrawrkx.com', // Replies go to the group email
      to: adminEmails,
      subject: adminEmailTemplate.subject,
      html: adminEmailTemplate.html,
    };

    // Send admin notification
    console.log('Sending admin email to:', adminEmails);
    console.log('Admin email subject:', adminEmailTemplate.subject);

    try {
      await transporter.sendMail(adminMailOptions);
      console.log('Admin email sent successfully to:', adminEmails);
    } catch (adminEmailError) {
      console.error('Failed to send admin email:', adminEmailError);
      // Don't fail the whole process if admin email fails
    }

    return NextResponse.json({
      success: true,
      message: "Emails sent successfully",
      recipients: {
        users: recipients,
        admin: adminEmails
      }
    });

  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
}
