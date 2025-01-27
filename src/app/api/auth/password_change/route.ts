import { NextRequest, NextResponse } from 'next/server';
import { hash, compare } from 'bcryptjs';
import { z } from 'zod';
import { getUserByEmail, updateUserPassword } from '@/lib/services/user';
import { auth } from '@/lib/auth';

const passwordChangeSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { currentPassword, newPassword } = passwordChangeSchema.parse(body);

    const user = await getUserByEmail(session.user.email);
    if (!user || !user.password) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = await compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    const hashedNewPassword = await hash(newPassword, 10);

    await updateUserPassword(session.user.email, hashedNewPassword);

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Password change error:', error);
    return NextResponse.json(
      { error: 'An error occurred while changing the password' },
      { status: 500 }
    );
  }
}
