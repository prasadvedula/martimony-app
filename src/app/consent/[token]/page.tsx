'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface ConsentData {
  request: { status: string; sentAt: string }
  profile: { id: string; name: string; gender: string; status: string; consentGiven: boolean }
}

export default function ConsentPage() {
  const params = useParams()
  const token  = params.token as string

  const [data, setData]       = useState<ConsentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState<'ACCEPT' | 'REJECT' | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/consent/${token}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d.data)
        else setError(d.error ?? 'Invalid consent link.')
        setLoading(false)
      })
      .catch(() => { setError('Network error.'); setLoading(false) })
  }, [token])

  async function respond(action: 'ACCEPT' | 'REJECT') {
    setSubmitting(true)
    const res  = await fetch(`/api/consent/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    const d = await res.json()
    if (d.success) setDone(action)
    else setError(d.error ?? 'Failed.')
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-spin">🪔</div>
          <p className="text-gray-500">Verifying consent link…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="font-semibold text-gray-900 mb-2">Invalid Link</h2>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <div className="text-5xl mb-4">{done === 'ACCEPT' ? '✅' : '🙏'}</div>
          <h2 className="font-semibold text-gray-900 mb-2">
            {done === 'ACCEPT' ? 'Consent Accepted' : 'Profile Declined'}
          </h2>
          <p className="text-gray-600 text-sm">
            {done === 'ACCEPT'
              ? `Thank you! ${data?.profile.name}'s profile is now active on Matrimony.`
              : `${data?.profile.name}'s profile has been removed. No information will be shared.`}
          </p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const alreadyResponded = data.request.status !== 'PENDING'

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="card max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🪔</div>
          <h1 className="text-xl font-bold text-gray-900">Matrimonial Profile Consent</h1>
          <p className="text-gray-500 text-sm mt-1">Matrimony — Hindu Matrimonial Platform</p>
        </div>

        {alreadyResponded ? (
          <div className="text-center">
            <div className="text-4xl mb-3">ℹ️</div>
            <p className="text-gray-600">
              You have already responded to this consent request.
              Current status: <strong>{data.request.status}</strong>
            </p>
          </div>
        ) : (
          <>
            <div className="bg-pink-50 rounded-xl p-5 mb-6">
              <p className="text-sm text-gray-700">
                A matrimonial profile for <strong>{data.profile.name}</strong> has been registered on Matrimony.
                Before this profile is made visible to other community members, we need your explicit consent.
              </p>
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>• Your profile will only appear after you click <strong>Accept</strong></p>
                <p>• You may withdraw consent at any time by contacting us</p>
                <p>• Your contact details will not be shared publicly</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => respond('ACCEPT')}
                disabled={submitting}
                className="btn-primary flex-1 py-3"
              >
                {submitting ? '…' : '✅ Accept — Activate Profile'}
              </button>
              <button
                onClick={() => respond('REJECT')}
                disabled={submitting}
                className="btn-danger flex-1 py-3"
              >
                {submitting ? '…' : '❌ Decline — Remove Profile'}
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-4 text-center">
              This consent link is unique to this profile and will expire after responding.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
