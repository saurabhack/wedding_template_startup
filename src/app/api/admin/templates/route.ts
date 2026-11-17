import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const templates = await prisma.template.findMany({
      include: {
        category: true,
        _count: { select: { invitations: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const categories = await prisma.templateCategory.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ templates, categories });
  } catch (error) {
    console.error('Error in admin templates GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { name, slug, categoryId, description, previewImage, price, isPremium, designConfiguration } = body;

    const template = await prisma.template.create({
      data: {
        name,
        slug,
        categoryId,
        description,
        previewImage,
        thumbnailImage: previewImage,
        price: Number(price) || 0,
        isPremium: Boolean(isPremium),
        designConfiguration: designConfiguration || {},
      },
    });

    await prisma.templateVersion.create({
      data: {
        templateId: template.id,
        versionNumber: 1,
        designConfiguration: designConfiguration || {},
        isPublished: true,
      },
    });

    return NextResponse.json({ success: true, template }, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { id, name, description, price, isPremium, isActive } = body;

    const updated = await prisma.template.update({
      where: { id },
      data: {
        name,
        description,
        price: price !== undefined ? Number(price) : undefined,
        isPremium: isPremium !== undefined ? Boolean(isPremium) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      },
    });

    return NextResponse.json({ success: true, template: updated });
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
    }

    await prisma.template.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Template deleted' });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
