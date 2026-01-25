// lib/email.ts
// TratoDatos - Email configuration with Resend

import { Resend } from 'resend';

// Lazy initialization to avoid build-time errors when API key is not set
let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured. Please set it in your environment variables.');
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'TratoDatos <noreply@tratodatos.cl>';
const APP_URL = process.env.NEXTAUTH_URL || 'https://tratodatos.cl';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  // Check if email is configured
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Email not sent:', { to, subject });
    // In development, log instead of throwing
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email would be sent (dev mode):', { to, subject });
      return { id: 'dev-mode-no-email' };
    }
    throw new Error('Email service not configured');
  }

  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

// Email Templates
export function getVerificationEmailTemplate(name: string, verificationUrl: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifica tu email - TratoDatos</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #e2e8f0;">
              <div style="width: 50px; height: 50px; background-color: #2563eb; border-radius: 12px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 24px;">🛡️</span>
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1a1a2e;">TratoDatos</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #1a1a2e;">¡Hola ${name}!</h2>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #64748b;">
                Gracias por registrarte en TratoDatos. Para completar tu registro y comenzar a crear tus políticas de datos, necesitas verificar tu email.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 500; font-size: 16px;">
                  Verificar mi email
                </a>
              </div>
              
              <p style="margin: 24px 0 0; font-size: 14px; color: #94a3b8;">
                Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:
              </p>
              <p style="margin: 8px 0 0; font-size: 14px; color: #2563eb; word-break: break-all;">
                ${verificationUrl}
              </p>
              
              <p style="margin: 32px 0 0; font-size: 14px; color: #94a3b8;">
                Este enlace expira en 24 horas.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8fafc; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                Si no creaste una cuenta en TratoDatos, puedes ignorar este email.
              </p>
              <p style="margin: 16px 0 0; font-size: 12px; color: #94a3b8;">
                © ${new Date().getFullYear()} TratoDatos. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function getPasswordResetEmailTemplate(name: string, resetUrl: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recupera tu contraseña - TratoDatos</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #e2e8f0;">
              <div style="width: 50px; height: 50px; background-color: #2563eb; border-radius: 12px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 24px;">🛡️</span>
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1a1a2e;">TratoDatos</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #1a1a2e;">¡Hola ${name}!</h2>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #64748b;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón para crear una nueva contraseña.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 500; font-size: 16px;">
                  Restablecer contraseña
                </a>
              </div>
              
              <p style="margin: 24px 0 0; font-size: 14px; color: #94a3b8;">
                Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:
              </p>
              <p style="margin: 8px 0 0; font-size: 14px; color: #2563eb; word-break: break-all;">
                ${resetUrl}
              </p>
              
              <p style="margin: 32px 0 0; font-size: 14px; color: #94a3b8;">
                Este enlace expira en 1 hora.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8fafc; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                Si no solicitaste restablecer tu contraseña, puedes ignorar este email. Tu contraseña no cambiará.
              </p>
              <p style="margin: 16px 0 0; font-size: 12px; color: #94a3b8;">
                © ${new Date().getFullYear()} TratoDatos. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Helper to generate verification URL
export function generateVerificationUrl(token: string) {
  return `${APP_URL}/verify-email?token=${token}`;
}

// Helper to generate password reset URL  
export function generatePasswordResetUrl(token: string) {
  return `${APP_URL}/reset-password?token=${token}`;
}
