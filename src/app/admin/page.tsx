import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { differenceInYears } from 'date-fns'

export const metadata = { title: 'Admin Dashboard â€” Matrimony' }

async function getStats() {
  const [total, active, pendingConsent, rejected, male, female] = await Promise.all([
    prisma.profile.count(),
    prisma.profile.count({ where: { status: 'ACTIVE' } }),
    prisma.profile.count({ where: { status: 'PENDING_CONSENT' } }),
    prisma.profile.count({ where: { status: 'REJECTED' } }),
    prisma.profile.count({ where: { gender: 'MALE' } }),
    prisma.profile.count({ where: { gender: 'FEMALE' } }),
  ])
  return { total, active, pendingConsent, rejected, male, female }
}

async function getPendingProfiles() {
  return prisma.profile.findMany({
    where: { status: 'PENDING_CONSENT' },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true, name: true, gender: true, dateOfBirth: true,
      caste: true, nakshatra: true, contactEmail: true, contactPhone: true,
      consentToken: true, createdAt: true, uploadedByAdmin: true,
    },
  })
}

export default async function AdminPage() {
  const session = await getSession()
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    redirect('/login')
  }

  const [stats, pending] = await Promise.all([getStats(), getPendingProfiles()])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage profiles, consent requests, and uploads</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/upload" className="btn-primary">
            ðŸ“„ Bulk Upload PDF
          </Link>
          <Link href="/profiles/new" className="btn-secondary">
            + Add Profile
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Total',    value: stats.total,         color: 'bg-gray-100    text-gray-800'   },
          { label: 'Active',   value: stats.active,        color: 'bg-green-100   text-green-800'  },
          { label: 'Pending',  value: stats.pendingConsent,color: 'bg-yellow-100  text-yellow-800' },
          { label: 'Rejected', value: stats.rejected,      color: 'bg-red-100     text-red-800'    },
          { label: 'Grooms',   value: stats.male,          color: 'bg-blue-100    text-blue-800'   },
          { label: 'Brides',   value: stats.female,        color: 'bg-pink-100    text-pink-800'   },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/admin/upload" className="card hover:shadow-md transition-shadow text-center group">
          <div className="text-4xl mb-3">ðŸ“„</div>
          <h3 className="font-semibold">Bulk Upload PDF</h3>
          <p className="text-sm text-gray-500 mt-1">Upload community profiles from a PDF document</p>
        </Link>
        <Link href="/profiles" className="card hover:shadow-md transition-shadow text-center">
          <div className="text-4xl mb-3">ðŸ”</div>
          <h3 className="font-semibold">Browse All Profiles</h3>
          <p className="text-sm text-gray-500 mt-1">Search and view all registered profiles</p>
        </Link>
        <Link href="/match" className="card hover:shadow-md transition-shadow text-center">
          <div className="text-4xl mb-3">â­</div>
          <h3 className="font-semibold">Kundali Match</h3>
          <p className="text-sm text-gray-500 mt-1">Check compatibility between two profiles</p>
        </Link>
      </div>

      {/* Pending consent table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">
            Pending Consent ({stats.pendingConsent})
          </h2>
          <span className="badge badge-orange">Awaiting response</span>
        </div>

        {pending.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No profiles pending consent.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left pb-3 pr-4 text-gray-500 font-medium">Name</th>
                  <th className="text-left pb-3 pr-4 text-gray-500 font-medium">Age/Gender</th>
                  <th className="text-left pb-3 pr-4 text-gray-500 font-medium">Caste/Star</th>
                  <th className="text-left pb-3 pr-4 text-gray-500 font-medium">Contact</th>
                  <th className="text-left pb-3 pr-4 text-gray-500 font-medium">Source</th>
                  <th className="text-left pb-3 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 pr-4">
                      <Link href={`/profiles/${p.id}`} className="font-medium text-pink-700 hover:underline">
                        {p.name}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {differenceInYears(new Date(), p.dateOfBirth)} yrs Â· {p.gender === 'MALE' ? 'â™‚' : 'â™€'}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {p.caste}<br />
                      <span className="text-xs text-gray-400">{p.nakshatra}</span>
                    </td>
                    <td className="py-3 pr-4 text-gray-500 text-xs">
                      {p.contactEmail && <div>{p.contactEmail}</div>}
                      {p.contactPhone && <div>{p.contactPhone}</div>}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`badge ${p.uploadedByAdmin ? 'badge-orange' : 'badge-gray'}`}>
                        {p.uploadedByAdmin ? 'PDF Upload' : 'Self-Reg'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <AdminActivateButton profileId={p.id} />
                        {p.consentToken && (
                          <Link
                            href={`/consent/${p.consentToken}`}
                            target="_blank"
                            className="btn-secondary btn-sm"
                          >
                            Consent Link
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// Client component for activate button
function AdminActivateButton({ profileId }: { profileId: string }) {
  return (
    <form action={`/api/profiles/${profileId}`} method="PATCH">
      <Link
        href={`/api/profiles/${profileId}`}
        className="btn-primary btn-sm"
        onClick={async (e) => {
          e.preventDefault()
          await fetch(`/api/profiles/${profileId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'ACTIVE', consentGiven: true }),
          })
          window.location.reload()
        }}
      >
        âœ“ Activate
      </Link>
    </form>
  )
}
