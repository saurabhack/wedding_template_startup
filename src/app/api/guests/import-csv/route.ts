import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, invitationId, csvData } = await req.json();

    if (!projectId || !csvData) {
      return NextResponse.json(
        { error: 'Project ID and CSV data are required' },
        { status: 400 }
      );
    }

    // Verify project belongs to user
    const project = await prisma.weddingProject.findFirst({
      where: { id: projectId, userId: user.id },
    });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Parse CSV lines
    const lines = csvData
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0);

    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV must contain a header and at least one data row' },
        { status: 400 }
      );
    }

    // Header validation (Name, Family, Phone, Email, Category, Message)
    const headers = lines[0].split(',').map((h: string) => h.trim().toLowerCase());
    const nameIdx = headers.findIndex((h: string) => h.includes('name'));
    const familyIdx = headers.findIndex((h: string) => h.includes('family'));
    const phoneIdx = headers.findIndex((h: string) => h.includes('phone') || h.includes('mobile'));
    const emailIdx = headers.findIndex((h: string) => h.includes('email'));
    const catIdx = headers.findIndex((h: string) => h.includes('category') || h.includes('group'));
    const msgIdx = headers.findIndex((h: string) => h.includes('message') || h.includes('note'));

    const importedGuests = [];

    for (let i = 1; i < lines.length; i++) {
      // Split by comma handling simple CSV strings
      const parts = lines[i].split(',').map((p: string) => p.trim().replace(/^["']|["']$/g, ''));
      const fullName = nameIdx >= 0 ? parts[nameIdx] : parts[0];
      if (!fullName) continue;

      const familyName = familyIdx >= 0 ? parts[familyIdx] : null;
      const phone = phoneIdx >= 0 ? parts[phoneIdx] : null;
      const email = emailIdx >= 0 ? parts[emailIdx] : null;
      const category = catIdx >= 0 && parts[catIdx] ? parts[catIdx] : 'General';
      const personalizedMessage = msgIdx >= 0 ? parts[msgIdx] : null;

      const guest = await prisma.guest.create({
        data: {
          projectId,
          fullName,
          familyName,
          phone,
          email,
          category,
        },
      });

      if (invitationId) {
        const token = `${fullName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${crypto.randomBytes(4).toString('hex')}`;
        await prisma.guestInvitation.create({
          data: {
            guestId: guest.id,
            invitationId,
            uniqueToken: token,
            personalizedMessage,
            status: 'pending',
          },
        });
      }

      importedGuests.push(guest);
    }

    return NextResponse.json({
      success: true,
      importedCount: importedGuests.length,
      guests: importedGuests,
    });
  } catch (error) {
    console.error('Error importing CSV:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
