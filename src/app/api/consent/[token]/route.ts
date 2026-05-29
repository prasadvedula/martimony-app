import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/consent/:token — verify consent token
export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const request = await prisma.consentRequest.findUnique({
    where: { token: params.token },
  })
  if (!request) {
    return NextResponse.json({ success: false, error: 'Invalid consent link' }, { status: 404 })
  }

  const profile = await prisma.profile.findUnique({
    where: { id: request.profileId },
    select: { id: true, name: true, gender: true, status: true, consentGiven: true },
  })

  return NextResponse.json({ success: true, data: { request, profile } })
}

// POST /api/consent/:token — accept or reject consent
export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const body = await req.json()
  const action: 'ACCEPT' | 'REJECT' = body.action

  if (action !== 'ACCEPT' && action !== 'REJECT') {
    return NextResponse.json({ success: false, error: 'action must be ACCEPT or REJECT' }, { status: 400 })
  }

  const request = await prisma.consentRequest.findUnique({
    where: { token: params.token },
  })
  if (!request) {
    return NextResponse.json({ success: false, error: 'Invalid consent link' }, { status: 404 })
  }
  if (request.status !== 'PENDING') {
    return NextResponse.json({ success: false, error: 'Consent already responded to' }, { status: 409 })
  }

  await prisma.consentRequest.update({
    where: { token: params.token },
    data: { status: action, respondedAt: new Date() },
  })

  if (action === 'ACCEPT') {
    await prisma.profile.update({
      where: { id: request.profileId },
      data: { consentGiven: true, consentGivenAt: new Date(), status: 'ACTIVE' },
    })
  } else {
    await prisma.profile.update({
      where: { id: request.profileId },
      data: { status: 'REJECTED' },
    })
  }

  return NextResponse.json({
    success: true,
    message: action === 'ACCEPT'
      ? 'Consent accepted. Your profile is now visible.'
      : 'Consent rejected. Your profile has been removed.',
  })
}
