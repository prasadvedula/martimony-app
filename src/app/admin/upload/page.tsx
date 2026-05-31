'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { uploadApi } from '@/lib/api'

interface UploadResult {
  status: string
  name?: string
  profileId?: string
  confidence?: string
  warnings?: string[]
  consentLink?: string
  error?: string
  rawText?: string
}

interface UploadSummary {
  total: number
  created: number
  skipped: number
  errored: number
}

export default function AdminUploadPage() {
  const [file, setFile]         = useState<File | null>(null)
  const [loading, setLoading]   = useState(false)
  const [results, setResults]   = useState<UploadResult[]>([])
  const [summary, setSummary]   = useState<UploadSummary | null>(null)
  const [batchId, setBatchId]   = useState('')
  const [error, setError]       = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  async function handleUpload() {
    if (!file) return
    setLoading(true)
    setError('')
    setResults([])
    setSummary(null)

    const fd = new FormData()
    fd.append('file', file)

    try {
      const data = await uploadApi.pdf(fd)

      if (!data.success) {
        setError(data.error ?? 'Upload failed.')
      } else {
        setResults((data.results ?? []) as UploadResult[])
        setSummary(data.summary as UploadSummary)
        setBatchId(data.batchId ?? '')
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-pink-600 hover:underline">← Admin Dashboard</Link>
      </div>

      <div className="mb-8">
        <h1 className="section-title">Bulk Profile Upload</h1>
        <p className="text-gray-600 text-sm mt-1">
          Upload a PDF containing multiple matrimonial profiles. Each profile will be created as &ldquo;pending consent&rdquo; and activated only after the family confirms.
        </p>
      </div>

      {/* PDF format guide */}
      <div className="card mb-6 bg-pink-50 border-pink-200">
        <h3 className="font-semibold text-pink-900 mb-2">📋 PDF Format Guide</h3>
        <p className="text-sm text-pink-800 mb-3">
          Each profile should be separated by blank lines. Use &ldquo;Label: Value&rdquo; format:
        </p>
        <pre className="bg-white rounded-lg p-3 text-xs text-gray-700 border border-pink-100 overflow-x-auto">
{`Name: Priya Sharma
Gender: Female
Date of Birth: 1995-03-15
Birth Time: 06:30
Place of Birth: Bangalore, Karnataka
Caste: Brahmin
Sub Caste: Smartha
Gotram: Bharadvaja
Nakshatra: Rohini
Rashi: Vrishabha
Mangal: No
Education: B.Tech Computer Science
Occupation: Software Engineer
Phone: 9876543210
Email: family@example.com

Name: Rajesh Kumar
Gender: Male
...`}
        </pre>
      </div>

      {/* Upload area */}
      <div className="card mb-6">
        <div
          className="border-2 border-dashed border-pink-200 rounded-xl p-12 text-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const f = e.dataTransfer.files?.[0]
            if (f?.type === 'application/pdf') setFile(f)
          }}
        >
          <div className="text-5xl mb-3">📄</div>
          {file ? (
            <div>
              <p className="font-semibold text-gray-800">{file.name}</p>
              <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 font-medium">Drop your PDF here or click to browse</p>
              <p className="text-sm text-gray-400 mt-1">PDF files only</p>
            </div>
          )}
          <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFile} />
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="btn-primary w-full mt-4 py-3 text-base"
        >
          {loading ? 'Processing PDF…' : '⬆ Upload & Process'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-6">
          {error}
        </div>
      )}

      {/* Results */}
      {summary && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-3">Upload Results — Batch {batchId.slice(0, 8)}</h2>
            <div className="grid grid-cols-4 gap-4 text-center mb-4">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-xl font-bold">{summary.total}</p>
                <p className="text-xs text-gray-500">Total Found</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <p className="text-xl font-bold text-green-700">{summary.created}</p>
                <p className="text-xs text-green-600">Created</p>
              </div>
              <div className="bg-yellow-100 rounded-lg p-3">
                <p className="text-xl font-bold text-yellow-700">{summary.skipped}</p>
                <p className="text-xs text-yellow-600">Skipped</p>
              </div>
              <div className="bg-red-100 rounded-lg p-3">
                <p className="text-xl font-bold text-red-700">{summary.errored}</p>
                <p className="text-xs text-red-600">Errors</p>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Created profiles are in &ldquo;Pending Consent&rdquo; status. Share the consent links with the families to activate them.
            </p>
          </div>

          {/* Individual results */}
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className={`card p-4 ${
                r.status === 'CREATED'  ? 'border-green-200' :
                r.status === 'SKIPPED' ? 'border-yellow-200' : 'border-red-200'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span>{r.status === 'CREATED' ? '✅' : r.status === 'SKIPPED' ? '⚠️' : '❌'}</span>
                    <span className="font-medium text-sm">{r.name ?? 'Unknown'}</span>
                    {r.confidence && (
                      <span className={`badge ${
                        r.confidence === 'HIGH' ? 'badge-green' :
                        r.confidence === 'MEDIUM' ? 'badge-orange' : 'badge-red'
                      }`}>{r.confidence}</span>
                    )}
                  </div>
                  {r.consentLink && (
                    <Link href={r.consentLink} target="_blank" className="btn-secondary btn-sm flex-shrink-0">
                      Consent Link ↗
                    </Link>
                  )}
                </div>
                {r.warnings && r.warnings.length > 0 && (
                  <ul className="mt-2 text-xs text-yellow-700 space-y-0.5">
                    {r.warnings.map((w, j) => <li key={j}>• {w}</li>)}
                  </ul>
                )}
                {r.error && <p className="mt-1 text-xs text-red-600">{r.error}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
