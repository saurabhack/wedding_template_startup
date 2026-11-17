import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createInviteSchema = z.object({
  projectId: z.string().uuid(),
  templateId: z.string().uuid(),
  invitationTitle: z.string().min(2),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invitations = await prisma.invitation.findMany({
      where: {
        project: { userId: user.id },
      },
      include: {
        template: true,
        events: { orderBy: { displayOrder: 'asc' } },
        project: true,
        _count: {
          select: { guestInvitations: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ invitations });
  } catch (error) {
    console.error('Error fetching invitations:', error);
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
    const parsed = createInviteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { projectId, templateId, invitationTitle } = parsed.data;

    // Verify project belongs to user
    const project = await prisma.weddingProject.findFirst({
      where: { id: projectId, userId: user.id },
    });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Get template details
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: {
        versions: {
          where: { isPublished: true },
          orderBy: { versionNumber: 'desc' },
          take: 1,
        },
      },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    const templateConfig = (template.designConfiguration as any) || {};

    // Generate unique slug
    const baseSlug = `${project.brideName.toLowerCase().replace(/[^a-z0-9]/g, '')}-weds-${project.groomName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.invitation.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const defaultInvitationData = {
      mantra: templateConfig.defaultMantra || '॥ श्री गणेशाय नमः ॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
      welcomeNote: 'Together with our families, we joyfully invite you to celebrate our wedding ceremonies.',
      couple: {
        bride: {
          name: project.brideName,
          parents: 'Smt. & Shri Parents of the Bride',
          photo: '',
          bio: 'Daughter of the Bride Family',
        },
        groom: {
          name: project.groomName,
          parents: 'Smt. & Shri Parents of the Groom',
          photo: '',
          bio: 'Son of the Groom Family',
        },
        hashtag: `#${project.brideName.replace(/\s+/g, '')}Weds${project.groomName.replace(/\s+/g, '')}`,
      },
      story: {
        headline: 'Our Love Story',
        description: 'Every love story is beautiful, but ours is our favorite.',
        gallery: [],
      },
      audio: {
        enabled: true,
        trackUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
        title: 'Traditional Wedding Shehnai & Sitar Melody',
      },
      shagunRegistry: {
        enabled: true,
        upiId: '',
        note: 'Your blessings are our greatest gift.',
      },
      customStyling: {
        primaryColor: templateConfig.colors?.primary || '#800020',
        secondaryColor: templateConfig.colors?.secondary || '#C9A44C',
        backgroundColor: templateConfig.colors?.background || '#FFF9F0',
      },
    };

    const invitation = await prisma.invitation.create({
      data: {
        projectId,
        templateId,
        templateVersionId: template.versions[0]?.id || null,
        invitationTitle,
        slug,
        status: 'draft',
        invitationData: defaultInvitationData,
      },
    });

    // Create 3 standard default wedding events
    const weddingDate = project.weddingDate || new Date();
    await prisma.invitationEvent.createMany({
      data: [
        {
          invitationId: invitation.id,
          eventName: 'Mehendi & Haldi Ceremony',
          eventDate: weddingDate,
          startTime: '11:00 AM',
          endTime: '03:00 PM',
          venue: 'Grand Courtyard',
          address: 'Venue Address Here',
          dressCode: 'Festive Yellows & Florals',
          description: 'Join us for auspicious turmeric and vibrant mehendi celebrations.',
          displayOrder: 1,
        },
        {
          invitationId: invitation.id,
          eventName: 'Sangeet & Musical Evening',
          eventDate: weddingDate,
          startTime: '07:00 PM',
          endTime: 'Midnight',
          venue: 'Royal Banquet Hall',
          address: 'Venue Address Here',
          dressCode: 'Glamorous Indo-Western',
          description: 'A night filled with dance performances, music, and celebration.',
          displayOrder: 2,
        },
        {
          invitationId: invitation.id,
          eventName: 'Shubh Vivah (Wedding Ceremony)',
          eventDate: weddingDate,
          startTime: '10:00 AM',
          endTime: '02:00 PM',
          venue: 'The Royal Mandap',
          address: 'Venue Address Here',
          dressCode: 'Traditional Indian Elegance',
          description: 'The sacred wedding ceremony and pheras followed by royal lunch.',
          displayOrder: 3,
        },
      ],
    });

    return NextResponse.json({ success: true, invitation }, { status: 201 });
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
