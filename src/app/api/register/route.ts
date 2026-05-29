import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hash } from 'bcryptjs'

// POST /api/register — create admin or first user
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, password, adminSecret } = body

  if (!email || !password) {
    return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 })
  }

  const passwordHash = await hash(password, 12)
  const role = adminSecret === process.env.ADMIN_SECRET ? 'ADMIN' : 'USER'

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role },
  })

  return NextResponse.json({
    success: true,
    data: { id: user.id, email: user.email, role: user.role },
  }, { status: 201 })
}
