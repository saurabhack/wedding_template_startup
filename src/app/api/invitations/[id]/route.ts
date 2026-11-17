import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invitation = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        project: { userId: user.id },
      },
      include: {
        template: {
          include: {
            category: true,
          },
        },
        events: {
          orderBy: { displayOrder: 'asc' },
        },
        project: {
          include: {
            familyMembers: { orderBy: { displayOrder: 'asc' } },
            guests: true,
          },
        },
        guestInvitations: {
          include: {
            guest: true,
            rsvpResponse: true,
          },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    return NextResponse.json({ invitation });
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { invitationTitle, invitationData, events, familyMembers } = body;

    // Verify ownership
    const existing = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        project: { userId: user.id },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    // Update invitation
    const updated = await prisma.invitation.update({
      where: { id: params.id },
      data: {
        invitationTitle: invitationTitle || existing.invitationTitle,
        invitationData: invitationData !== undefined ? invitationData : existing.invitationData,
      },
    });

    // Update events if provided
    if (Array.isArray(events)) {
      await prisma.invitationEvent.deleteMany({ where: { invitationId: params.id } });
      for (let i = 0; i < events.length; i++) {
        const ev = events[i];
        await prisma.invitationEvent.create({
          data: {
            invitationId: params.id,
            eventName: ev.eventName,
            eventDate: ev.eventDate ? new Date(ev.eventDate) : null,
            startTime: ev.startTime || null,
            endTime: ev.endTime || null,
            venue: ev.venue || 'Venue',
            address: ev.address || null,
            mapUrl: ev.mapUrl || null,
            dressCode: ev.dressCode || null,
            description: ev.description || null,
            displayOrder: i + 1,
          },
        });
      }
    }

    // Update family members if provided
    if (Array.isArray(familyMembers)) {
      await prisma.familyMember.deleteMany({ where: { projectId: existing.projectId } });
      for (let i = 0; i < familyMembers.length; i++) {
        const fm = familyMembers[i];
        await prisma.familyMember.create({
          data: {
            projectId: existing.projectId,
            fullName: fm.fullName,
            relationship: fm.relationship || 'Family',
            photographUrl: fm.photographUrl || null,
            description: fm.description || null,
            displayOrder: i + 1,
          },
        });
      }
    }

    const fullInvitation = await prisma.invitation.findUnique({
      where: { id: params.id },
      include: {
        template: true,
        events: { orderBy: { displayOrder: 'asc' } },
        project: {
          include: {
            familyMembers: { orderBy: { displayOrder: 'asc' } },
          },
        },
      },
    });

    return NextResponse.json({ success: true, invitation: fullInvitation });
  } catch (error) {
    console.error('Error updating invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invitation = await prisma.invitation.findFirst({
      where: { id: params.id, project: { userId: user.id } },
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    await prisma.invitation.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, message: 'Invitation deleted' });
  } catch (error) {
    console.error('Error deleting invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
