'use client'

import { useState } from 'react'
import { enrollInCourse } from '@/app/actions/enroll'

export default function EnrollButton({
  courseId,
  enrolled,
}: {
  courseId: string
  enrolled: boolean
}) {
  const [loading, setLoading] = useState(false)

  if (enrolled) {
    return (
      <span className="text-green-400 text-sm font-semibold">✓ Enrolled</span>
    )
  }

  async function handleClick() {
    setLoading(true)
    await enrollInCourse(courseId)
    setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-white text-black text-sm font-semibold rounded-full px-5 py-1.5 hover:bg-neutral-200 disabled:opacity-50"
    >
      {loading ? 'Enrolling...' : 'Enroll'}
    </button>
  )
}