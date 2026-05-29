import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { hash } from 'bcryptjs'
import { v4 as uuid } from 'uuid'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import type { Prisma } from '@prisma/client'

// GET /api/profiles — list profiles with filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const gender    = searchParams.get('gender') as 'MALE' | 'FEMALE' | null
  const ageMin    = searchParams.get('ageMin')
  const ageMax    = searchParams.get('ageMax')
  const caste     = searchParams.get('caste')
  const subCaste  = searchParams.get('subCaste')
  const nakshatra = searchParams.get('nakshatra')
  const state     = searchParams.get('state')
  const page      = parseInt(searchParams.get('page') ?? '1')
  const limit     = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50)
  const skip      = (page - 1) * limit

  const where: Prisma.ProfileWhereInput = { status: 'ACTIVE' }

  if (gender)    where.gender = gender
  if (caste)     where.caste  = { contains: caste, mode: 'insensitive' }
  if (subCaste)  where.subCaste = { contains: subCaste, mode: 'insensitive' }
  if (nakshatra) where.nakshatra = { contains: nakshatra, mode: 'insensitive' }
  if (state)     where.currentState = { contains: state, mode: 'insensitive' }

  if (ageMin || ageMax) {
    const now = new Date()
    where.dateOfBirth = {}
    if (ageMax) {
      const minDob = new Date(now)
      minDob.setFullYear(now.getFullYear() - parseInt(ageMax))
      where.dateOfBirth.gte = minDob
    }
    if (ageMin) {
      const maxDob = new Date(now)
      maxDob.setFullYear(now.getFullYear() - parseInt(ageMin))
      where.dateOfBirth.lte = maxDob
    }
  }

  const [profiles, total] = await Promise.all([
    prisma.profile.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, gender: true, dateOfBirth: true,
        caste: true, subCaste: true, nakshatra: true, rashi: true,
        currentCity: true, currentState: true, photoUrl: true,
        education: true, occupation: true, heightCm: true,
        mangalDosha: true, gotram: true, birthPlace: true,
        status: true, createdAt: true,
      },
    }),
    prisma.profile.count({ where }),
  ])

  return NextResponse.json({
    success: true,
    data: profiles,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  })
}

// POST /api/profiles — create a new profile
export async function POST(req: NextRequest) {
  const session = await getSession()

  const formData = await req.formData()
  const body = Object.fromEntries(formData.entries())

  // Handle photo upload
  let photoUrl: string | null = null
  const photo = formData.get('photo') as File | null
  if (photo && photo.size > 0) {
    const bytes  = await photo.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext    = photo.name.split('.').pop() ?? 'jpg'
    const fname  = `${uuid()}.${ext}`
    const dir    = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, fname), buffer)
    photoUrl = `/uploads/${fname}`
  }

  // For self-registration: create user account if email/password provided
  let userId: string | undefined = session?.user
    ? (session.user as { id: string }).id
    : undefined

  if (!userId && body.email && body.password) {
    const existing = await prisma.user.findUnique({ where: { email: body.email as string } })
    if (!existing) {
      const passwordHash = await hash(body.password as string, 12)
      const user = await prisma.user.create({
        data: {
          email: body.email as string,
          passwordHash,
          name: body.name as string,
        },
      })
      userId = user.id
    } else {
      userId = existing.id
    }
  }

  const prefCastes = body.prefCastes
    ? (body.prefCastes as string).split(',').map((s) => s.trim()).filter(Boolean)
    : []

  const prefStates = body.prefStates
    ? (body.prefStates as string).split(',').map((s) => s.trim()).filter(Boolean)
    : []

  const profile = await prisma.profile.create({
    data: {
      userId: userId ?? null,
      name:            body.name as string,
      gender:          (body.gender as 'MALE' | 'FEMALE'),
      dateOfBirth:     new Date(body.dateOfBirth as string),
      birthTime:       (body.birthTime as string) || null,
      birthPlace:      body.birthPlace as string,
      currentCity:     (body.currentCity as string) || null,
      currentState:    (body.currentState as string) || null,
      caste:           body.caste as string,
      subCaste:        (body.subCaste as string) || null,
      sakha:           (body.sakha as string) || null,
      gotram:          (body.gotram as string) || null,
      nakshatra:       body.nakshatra as string,
      rashi:           (body.rashi as string) || null,
      mangalDosha:     body.mangalDosha === 'true',
      kuladeviTemple:  (body.kuladeviTemple as string) || null,
      surname:         (body.surname as string) || null,
      heightCm:        body.heightCm ? parseInt(body.heightCm as string) : null,
      complexion:      (body.complexion as string) || null,
      bodyType:        (body.bodyType as string) || null,
      education:       (body.education as string) || null,
      educationDetail: (body.educationDetail as string) || null,
      occupation:      (body.occupation as string) || null,
      occupationDetail:(body.occupationDetail as string) || null,
      annualIncomeLpa: body.annualIncomeLpa ? parseFloat(body.annualIncomeLpa as string) : null,
      fatherName:      (body.fatherName as string) || null,
      fatherOccupation:(body.fatherOccupation as string) || null,
      motherName:      (body.motherName as string) || null,
      motherOccupation:(body.motherOccupation as string) || null,
      siblings:        (body.siblings as string) || null,
      familyType:      (body.familyType as 'JOINT' | 'NUCLEAR' | 'EXTENDED') || null,
      familyValues:    (body.familyValues as string) || null,
      contactEmail:    (body.contactEmail as string) || null,
      contactPhone:    (body.contactPhone as string) || null,
      photoUrl,
      status:          'PENDING_CONSENT',
      consentGiven:    false,
      consentToken:    uuid(),
      uploadedByAdmin: (session?.user as { role?: string })?.role === 'ADMIN',
      prefAgeMin:      body.prefAgeMin ? parseInt(body.prefAgeMin as string) : null,
      prefAgeMax:      body.prefAgeMax ? parseInt(body.prefAgeMax as string) : null,
      prefCastes,
      prefStates,
    },
  })

  return NextResponse.json({ success: true, data: profile }, { status: 201 })
}
