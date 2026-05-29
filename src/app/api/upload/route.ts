import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { parsePdfBuffer } from '@/lib/pdf-parser'
import { prisma } from '@/lib/db'
import { v4 as uuid } from 'uuid'

// POST /api/upload — admin bulk PDF upload
export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file || file.type !== 'application/pdf') {
    return NextResponse.json({ success: false, error: 'Please upload a PDF file' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const drafts = await parsePdfBuffer(buffer)

  if (drafts.length === 0) {
    return NextResponse.json({ success: false, error: 'No profile data found in PDF' }, { status: 400 })
  }

  const batchId = uuid()
  const results = []

  for (const draft of drafts) {
    if (!draft.name || !draft.gender || !draft.nakshatra || !draft.caste) {
      results.push({ status: 'SKIPPED', warnings: draft.warnings, rawText: draft.rawText.slice(0, 100) })
      continue
    }

    const consentToken = uuid()
    try {
      const profile = await prisma.profile.create({
        data: {
          name:           draft.name,
          gender:         draft.gender,
          dateOfBirth:    draft.dateOfBirth ? new Date(draft.dateOfBirth) : new Date('1990-01-01'),
          birthTime:      draft.birthTime ?? null,
          birthPlace:     draft.birthPlace ?? 'Unknown',
          currentCity:    draft.currentCity ?? null,
          currentState:   draft.currentState ?? null,
          caste:          draft.caste,
          subCaste:       draft.subCaste ?? null,
          sakha:          draft.sakha ?? null,
          gotram:         draft.gotram ?? null,
          nakshatra:      draft.nakshatra,
          rashi:          draft.rashi ?? null,
          mangalDosha:    draft.mangalDosha ?? false,
          surname:        draft.surname ?? null,
          heightCm:       draft.heightCm ?? null,
          education:      draft.education ?? null,
          occupation:     draft.occupation ?? null,
          annualIncomeLpa:draft.annualIncomeLpa ?? null,
          fatherName:     draft.fatherName ?? null,
          motherName:     draft.motherName ?? null,
          familyType:     draft.familyType ?? null,
          contactEmail:   draft.contactEmail ?? null,
          contactPhone:   draft.contactPhone ?? null,
          status:         'PENDING_CONSENT',
          consentGiven:   false,
          consentToken,
          uploadedByAdmin: true,
          pdfUploadBatch:  batchId,
        },
      })

      // Create consent request record
      await prisma.consentRequest.create({
        data: {
          token:     consentToken,
          profileId: profile.id,
          email:     draft.contactEmail ?? null,
          phone:     draft.contactPhone ?? null,
        },
      })

      results.push({
        status: 'CREATED',
        profileId: profile.id,
        name: draft.name,
        confidence: draft.parseConfidence,
        warnings: draft.warnings,
        consentLink: `/consent/${consentToken}`,
      })
    } catch (err) {
      results.push({ status: 'ERROR', name: draft.name, error: String(err) })
    }
  }

  const created  = results.filter((r) => r.status === 'CREATED').length
  const skipped  = results.filter((r) => r.status === 'SKIPPED').length
  const errored  = results.filter((r) => r.status === 'ERROR').length

  return NextResponse.json({
    success: true,
    batchId,
    summary: { total: drafts.length, created, skipped, errored },
    results,
  })
}
