import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const isPremium = searchParams.get('premium');
    const search = searchParams.get('search');
    const orientation = searchParams.get('orientation');
    const sort = searchParams.get('sort') || 'popular';

    const where: any = { isActive: true };

    if (category && category !== 'all') {
      where.category = { slug: category };
    }

    if (isPremium === 'true') {
      where.isPremium = true;
    } else if (isPremium === 'false') {
      where.isPremium = false;
    }

    if (orientation && orientation !== 'all') {
      where.orientation = orientation;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'name') {
      orderBy = { name: 'asc' };
    }

    const [templates, categories] = await Promise.all([
      prisma.template.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          versions: {
            where: { isPublished: true },
            orderBy: { versionNumber: 'desc' },
            take: 1,
          },
        },
        orderBy,
      }),
      prisma.templateCategory.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
    ]);

    return NextResponse.json({ templates, categories });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
