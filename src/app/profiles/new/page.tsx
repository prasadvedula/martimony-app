import { ProfileForm } from '@/components/ProfileForm'

export const metadata = { title: 'Register Profile â€” Matrimony' }

export default function NewProfilePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="section-title">Register a Profile</h1>
        <p className="text-gray-600 mt-1">
          Fill in all details carefully. Your profile will be reviewed and you&apos;ll receive a consent link before it goes live.
        </p>
      </div>
      <ProfileForm />
    </div>
  )
}
