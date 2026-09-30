// FILE: app/admin/DeleteButton.tsx  (delete with confirmation)

'use client'

export default function DeleteButton({
  action,
  id,
  label,
}: {
  action: (formData: FormData) => void
  id: string
  label: string
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete "${label}"? This cannot be undone.`)) {
          e.preventDefault()
        }
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-xs text-red-400/70 hover:text-red-400 transition"
      >
        Delete
      </button>
    </form>
  )
}