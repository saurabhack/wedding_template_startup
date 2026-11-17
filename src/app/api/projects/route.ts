import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const projectSchema = z.object({
  projectName: z.string().min(2, 'Project name is required'),
  brideName: z.string().min(1, 'Bride name is required'),
  groomName: z.string().min(1, 'Groom name is required'),
  weddingDate: z.string().optional(),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await prisma.weddingProject.findMany({
      where: { userId: user.id },
      include: {
        invitations: {
          include: {
            template: true,
            events: true,
            _count: { select: { guestInvitations: true } },
          },
        },
        familyMembers: {
          orderBy: { displayOrder: 'asc' },
        },
        _count: {
          select: { guests: true, invitations: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
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
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { projectName, brideName, groomName, weddingDate } = parsed.data;

    const project = await prisma.weddingProject.create({
      data: {
        userId: user.id,
        projectName,
        brideName,
        groomName,
        weddingDate: weddingDate ? new Date(weddingDate) : null,
      },
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
