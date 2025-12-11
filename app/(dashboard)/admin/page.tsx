import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const campaignSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  budget: z.number().positive(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  targetAudience: z.array(z.string()),
  platforms: z.array(z.string()),
  products: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const sellerId = searchParams.get('sellerId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (sellerId) {
      where.sellerId = sellerId
    }

    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        seller: { include: { user: true } },
        _count: { select: { orders: true } }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    const total = await prisma.campaign.count({ where })

    return NextResponse.json({
      campaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    const body = campaignSchema.parse(json)

    // Check if user is a seller
    const seller = await prisma.seller.findUnique({
      where: { userId: session.user.id }
    })

    if (!seller) {
      return NextResponse.json(
        { error: 'Only sellers can create campaigns' },
        { status: 403 }
      )
    }

    const campaign = await prisma.campaign.create({
      data: {
        ...body,
        sellerId: seller.id,
        status: 'DRAFT',
        spent: 0
      },
      include: {
        seller: { include: { user: true } }
      }
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating campaign:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}