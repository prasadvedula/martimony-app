import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

// GET /api/profiles/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const profile = await prisma.profile.findUnique({
    where: { id: params.id },
  })
  if (!profile) {
    return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: profile })
}

// PATCH /api/profiles/:id — update profile or approve/activate
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const isAdmin = (session.user as { role?: string }).role === 'ADMIN'

  // Only admins can change status
  if (body.status && !isAdmin) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const updated = await prisma.profile.update({
    where: { id: params.id },
    data: body,
  })

  return NextResponse.json({ success: true, data: updated })
}

// DELETE /api/profiles/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession()
  const isAdmin = (session?.user as { role?: string })?.role === 'ADMIN'
  if (!session || !isAdmin) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  await prisma.profile.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true, message: 'Profile deleted' })
}
