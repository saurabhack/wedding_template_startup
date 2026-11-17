import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const guestSchema = z.object({
  projectId: z.string().uuid(),
  invitationId: z.string().uuid().optional(),
  fullName: z.string().min(2, 'Name is required'),
  familyName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  category: z.string().default('General'),
  personalizedMessage: z.string().optional(),
  allowedEventIds: z.array(z.string()).optional(),
});

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    const where: any = {
      project: { userId: user.id },
    };

    if (projectId) {
      where.projectId = projectId;
    }

    const guests = await prisma.guest.findMany({
      where,
      include: {
        invitations: {
          include: {
            invitation: { select: { id: true, slug: true, invitationTitle: true } },
            rsvpResponse: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ guests });
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = guestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const {
      projectId,
      invitationId,
      fullName,
      familyName,
      phone,
      email,
      category,
      personalizedMessage,
      allowedEventIds,
    } = parsed.data;

    // Verify project belongs to user
    const project = await prisma.weddingProject.findFirst({
      where: { id: projectId, userId: user.id },
    });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const guest = await prisma.guest.create({
      data: {
        projectId,
        fullName,
        familyName: familyName || null,
        phone: phone || null,
        email: email || null,
        category,
      },
    });

    let guestInvitation = null;
    // If invitationId provided, create guest invitation token
    if (invitationId) {
      const token = `${fullName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${crypto.randomBytes(4).toString('hex')}`;
      guestInvitation = await prisma.guestInvitation.create({
        data: {
          guestId: guest.id,
          invitationId,
          uniqueToken: token,
          personalizedMessage: personalizedMessage || null,
          allowedEventIds: allowedEventIds || [],
          status: 'pending',
        },
      });
    }

    return NextResponse.json({ success: true, guest, guestInvitation }, { status: 201 });
  } catch (error) {
    console.error('Error creating guest:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
    }

    const guest = await prisma.guest.findFirst({
      where: { id, project: { userId: user.id } },
    });

    if (!guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    await prisma.guest.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Guest deleted' });
  } catch (error) {
    console.error('Error deleting guest:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
