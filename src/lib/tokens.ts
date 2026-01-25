// lib/tokens.ts
// TratoDatos - Token generation and validation

import { prisma } from './prisma';
import crypto from 'crypto';

// Generate a secure random token
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Hash a token for storage
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Create verification token (24 hours expiry)
export async function createVerificationToken(email: string): Promise<string> {
  const token = generateToken();
  const hashedToken = hashToken(token);
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  // Create new token
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: hashedToken,
      expires,
    },
  });

  return token;
}

// Verify email verification token
export async function verifyEmailToken(token: string): Promise<string | null> {
  const hashedToken = hashToken(token);

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token: hashedToken },
  });

  if (!verificationToken) {
    return null;
  }

  // Check if expired
  if (verificationToken.expires < new Date()) {
    // Delete expired token
    await prisma.verificationToken.delete({
      where: { token: hashedToken },
    });
    return null;
  }

  // Delete token after use
  await prisma.verificationToken.delete({
    where: { token: hashedToken },
  });

  return verificationToken.identifier;
}

// Create password reset token (1 hour expiry)
export async function createPasswordResetToken(email: string): Promise<string> {
  const token = generateToken();
  const hashedToken = hashToken(token);
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: `reset:${email}` },
  });

  // Create new token (prefix with 'reset:' to distinguish from email verification)
  await prisma.verificationToken.create({
    data: {
      identifier: `reset:${email}`,
      token: hashedToken,
      expires,
    },
  });

  return token;
}

// Verify password reset token
export async function verifyPasswordResetToken(token: string): Promise<string | null> {
  const hashedToken = hashToken(token);

  const resetToken = await prisma.verificationToken.findUnique({
    where: { token: hashedToken },
  });

  if (!resetToken) {
    return null;
  }

  // Check if it's a reset token
  if (!resetToken.identifier.startsWith('reset:')) {
    return null;
  }

  // Check if expired
  if (resetToken.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { token: hashedToken },
    });
    return null;
  }

  // Extract email from identifier
  return resetToken.identifier.replace('reset:', '');
}

// Delete password reset token after use
export async function deletePasswordResetToken(token: string): Promise<void> {
  const hashedToken = hashToken(token);
  await prisma.verificationToken.delete({
    where: { token: hashedToken },
  }).catch(() => {}); // Ignore if already deleted
}
