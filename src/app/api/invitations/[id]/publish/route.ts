import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const shouldPublish = body.publish !== undefined ? body.publish : true;

    const invitation = await prisma.invitation.findFirst({
      where: { id: params.id, project: { userId: user.id } },
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    const updated = await prisma.invitation.update({
      where: { id: params.id },
      data: {
        status: shouldPublish ? 'published' : 'draft',
        publishedAt: shouldPublish ? (invitation.publishedAt || new Date()) : null,
      },
    });

    return NextResponse.json({
      success: true,
      status: updated.status,
      slug: updated.slug,
      publishedAt: updated.publishedAt,
    });
  } catch (error) {
    console.error('Error updating publish status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
