import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with environment variable or dummy key for build
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

export async function POST(request: NextRequest) {
  try {
    // Check if we have a real API key
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_dummy_key_for_build') {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 }
      );
    }

    const { email, fullName } = await request.json();

    if (!email || !fullName) {
      return NextResponse.json(
        { error: 'Email and full name are required' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'SunShare Philippines <noreply@sunshareenergy.ph>',
      to: [email],
      subject: 'Welcome to SunShare Philippines! 🌞',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to SunShare Philippines</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #004F64;
              color: white;
              padding: 30px 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #F3F6E4;
              padding: 30px 20px;
              border-radius: 0 0 8px 8px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .highlight {
              background-color: #D1EB0C;
              padding: 15px;
              border-radius: 6px;
              margin: 20px 0;
              border-left: 4px solid #004F64;
            }
            .button {
              display: inline-block;
              background-color: #004F64;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">SunShare Philippines</div>
            <p>Your Journey to Sustainable Energy Starts Here</p>
          </div>
          
          <div class="content">
            <h2>Welcome, ${fullName}!</h2>
            
            <p>Thank you for registering with SunShare Philippines! We're excited to help you transition to clean, sustainable energy solutions.</p>
            
            <div class="highlight">
              <strong>What happens next?</strong>
              <ul>
                <li>Our team will review your application within 2-3 business days</li>
                <li>We'll contact you to schedule a free energy assessment</li>
                <li>You'll receive a personalized solar energy proposal</li>
                <li>We'll guide you through the installation process</li>
              </ul>
            </div>
            
            <p>In the meantime, here are some resources to help you understand more about solar energy:</p>
            
            <ul>
              <li><strong>How Solar Works:</strong> Learn about the basics of solar energy and how it can benefit your home or business</li>
              <li><strong>Cost Savings Calculator:</strong> Estimate how much you could save on your electricity bills</li>
              <li><strong>Government Incentives:</strong> Discover available tax credits and rebates in the Philippines</li>
            </ul>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="button">Visit Our Website</a>
            
            <p>Have questions? Our team is here to help! You can reach us at:</p>
            <ul>
              <li>📧 Email: info@sunshareenergy.ph</li>
              <li>📞 Phone: +63 (2) 8123-4567</li>
              <li>💬 Live Chat: Available on our website</li>
            </ul>
            
            <p>Thank you for choosing SunShare Philippines for your sustainable energy journey!</p>
            
            <p>Best regards,<br>
            The SunShare Philippines Team</p>
          </div>
          
          <div class="footer">
            <p>© 2024 SunShare Philippines. All rights reserved.</p>
            <p>This email was sent to ${email}. If you no longer wish to receive these emails, you can unsubscribe at any time.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}