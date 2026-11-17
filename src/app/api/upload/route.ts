import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const projectId = formData.get('projectId') as string | null;
    const mediaType = (formData.get('mediaType') as string) || 'image';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate size (max 10MB)
    if (buffer.length > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    // Determine extension
    const originalName = file.name || 'upload';
    const ext = path.extname(originalName) || '.jpg';
    const filename = `${crypto.randomUUID()}${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    const fileUrl = `/uploads/${filename}`;

    // If projectId provided, save metadata in database
    if (projectId) {
      await prisma.invitationMedia.create({
        data: {
          projectId,
          mediaType,
          fileUrl,
          originalFileName: originalName,
          fileSize: buffer.length,
        },
      });
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: originalName,
      fileSize: buffer.length,
    });
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json({ error: 'Internal server error during upload' }, { status: 500 });
  }
}
