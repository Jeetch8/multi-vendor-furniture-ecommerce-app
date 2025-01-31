import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const myEmail =
  process.env.NODE_ENV === 'production'
    ? 'no-reply@jeetch.com'
    : 'onboarding@resend.dev';

const domain =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.NEXT_PUBLIC_AUTH_TRUST_HOST;

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-password?token=${token}`;

  await resend.emails.send({
    from: myEmail,
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href=${confirmLink}>here</a> to reset password.</p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  await resend.emails.send({
    from: myEmail,
    to: email,
    subject: 'Confirm your email',
    html: `<p>Click <a href=${confirmLink}>here</a> to confirm email.</p>`,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: myEmail,
    to: email,
    subject: '2FA Code',
    html: `<p>Your 2FA code: ${token}`,
  });
};
