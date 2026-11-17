import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import crypto from 'crypto';

const rsvpSchema = z.object({
  token: z.string().optional(),
  invitationSlug: z.string(),
  fullName: z.string().min(2, 'Name is required'),
  responseStatus: z.enum(['attending', 'declined', 'tentative']),
  numberOfAttendees: z.number().min(1).default(1),
  dietaryPreference: z.string().default('Vegetarian'),
  message: z.string().optional(),
  phone: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = rsvpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const {
      token,
      invitationSlug,
      fullName,
      responseStatus,
      numberOfAttendees,
      dietaryPreference,
      message,
      phone,
    } = parsed.data;

    const invitation = await prisma.invitation.findUnique({
      where: { slug: invitationSlug },
      include: { project: true },
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    let guestInvitationId: string | null = null;

    if (token) {
      // Find matching guest invitation by token
      const existingInvite = await prisma.guestInvitation.findUnique({
        where: { uniqueToken: token },
      });
      if (existingInvite) {
        guestInvitationId = existingInvite.id;
        await prisma.guestInvitation.update({
          where: { id: existingInvite.id },
          data: { status: 'responded' },
        });
      }
    }

    // If not found by token, create guest record and invitation for this public RSVP
    if (!guestInvitationId) {
      const guest = await prisma.guest.create({
        data: {
          projectId: invitation.projectId,
          fullName,
          phone: phone || null,
          category: 'Online RSVP',
        },
      });

      const newToken = `${fullName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${crypto.randomBytes(4).toString('hex')}`;
      const guestInvite = await prisma.guestInvitation.create({
        data: {
          guestId: guest.id,
          invitationId: invitation.id,
          uniqueToken: newToken,
          status: 'responded',
        },
      });

      guestInvitationId = guestInvite.id;
    }

    // Upsert RSVP Response
    const rsvp = await prisma.rSVPResponse.upsert({
      where: { guestInvitationId },
      update: {
        responseStatus,
        numberOfAttendees,
        dietaryPreference,
        message: message || null,
        respondedAt: new Date(),
      },
      create: {
        guestInvitationId,
        responseStatus,
        numberOfAttendees,
        dietaryPreference,
        message: message || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your RSVP has been recorded.',
      rsvp,
    });
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
