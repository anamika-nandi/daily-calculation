import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

export const sendOtpEmail = async (to, otp) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Your Login OTP - Poultry Farm Management',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Login OTP</h2>
        <p>Your one-time password is:</p>
        <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px;">
          ${otp}
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 16px;">
          This code expires in 10 minutes. Do not share it with anyone.
        </p>
      </div>
    `
  });
};

export const sendMagicLinkEmail = async (to, magicLink) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Login Link - Poultry Farm Management',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Magic Login Link</h2>
        <p>Click the button below to log in:</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${magicLink}" style="background: #2563eb; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Log In
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This link expires in 15 minutes. If you didn't request this, ignore this email.
        </p>
      </div>
    `
  });
};
