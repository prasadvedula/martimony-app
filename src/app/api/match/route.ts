import { NextRequest, NextResponse } from 'next/server'
import { calculateAshtakoot } from '@/lib/kundali'
import { prisma } from '@/lib/db'

// POST /api/match — calculate kundali match between two profiles or two nakshatras
export async function POST(req: NextRequest) {
  const body = await req.json()

  let groomNakshatra: string
  let brideNakshatra: string
  let groomMangal: boolean | null = null
  let brideMangal: boolean | null = null

  // Support matching by profile IDs or directly by nakshatra names
  if (body.groomProfileId && body.brideProfileId) {
    const [groom, bride] = await Promise.all([
      prisma.profile.findUnique({ where: { id: body.groomProfileId } }),
      prisma.profile.findUnique({ where: { id: body.brideProfileId } }),
    ])
    if (!groom || !bride) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
    }
    if (groom.gender !== 'MALE' || bride.gender !== 'FEMALE') {
      return NextResponse.json(
        { success: false, error: 'groomProfileId must be MALE and brideProfileId must be FEMALE' },
        { status: 400 }
      )
    }
    groomNakshatra = groom.nakshatra
    brideNakshatra = bride.nakshatra
    groomMangal    = groom.mangalDosha
    brideMangal    = bride.mangalDosha
  } else if (body.groomNakshatra && body.brideNakshatra) {
    groomNakshatra = body.groomNakshatra
    brideNakshatra = body.brideNakshatra
    groomMangal    = body.groomMangal ?? null
    brideMangal    = body.brideMangal ?? null
  } else {
    return NextResponse.json(
      { success: false, error: 'Provide either (groomProfileId + brideProfileId) or (groomNakshatra + brideNakshatra)' },
      { status: 400 }
    )
  }

  try {
    const result = calculateAshtakoot(groomNakshatra, brideNakshatra, groomMangal, brideMangal)

    // Optionally persist match record
    if (body.groomProfileId && body.brideProfileId) {
      await prisma.matchRecord.upsert({
        where: {
          groomProfileId_brideProfileId: {
            groomProfileId: body.groomProfileId,
            brideProfileId: body.brideProfileId,
          },
        },
        create: {
          groomProfileId: body.groomProfileId,
          brideProfileId: body.brideProfileId,
          totalScore: Math.round(result.totalScore),
          scoreBreakdown: result.scores as object,
          mangalStatus: result.mangalDosha.doshaPresent ? 'DOSHA_PRESENT' : 'NO_DOSHA',
          recommendation: result.recommendation,
        },
        update: {
          totalScore: Math.round(result.totalScore),
          scoreBreakdown: result.scores as object,
          recommendation: result.recommendation,
        },
      })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Match calculation failed'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}

// GET /api/match?groomNakshatra=X&brideNakshatra=Y — quick nakshatra match
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const groomNakshatra = searchParams.get('groomNakshatra')
  const brideNakshatra = searchParams.get('brideNakshatra')

  if (!groomNakshatra || !brideNakshatra) {
    return NextResponse.json(
      { success: false, error: 'groomNakshatra and brideNakshatra are required' },
      { status: 400 }
    )
  }

  try {
    const result = calculateAshtakoot(groomNakshatra, brideNakshatra)
    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Match calculation failed'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}
