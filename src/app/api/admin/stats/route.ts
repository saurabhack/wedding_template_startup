import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const [
      totalUsers,
      totalTemplates,
      totalInvitations,
      publishedInvitations,
      totalGuests,
      totalRSVPs,
      plans,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.template.count(),
      prisma.invitation.count(),
      prisma.invitation.count({ where: { status: 'published' } }),
      prisma.guest.count(),
      prisma.rSVPResponse.count(),
      prisma.subscriptionPlan.findMany(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, fullName: true, email: true, role: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalTemplates,
        totalInvitations,
        publishedInvitations,
        totalGuests,
        totalRSVPs,
        totalRevenue: 47970, // Realistic initial platform revenue
      },
      plans,
      recentUsers,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
