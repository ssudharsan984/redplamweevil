export default function EmptyState({ icon = '📭', title, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
      <span className="text-5xl">{icon}</span>
      <p className="text-lg font-semibold text-gray-700">{title}</p>
      {message && <p className="text-sm text-gray-500 max-w-xs">{message}</p>}
    </div>
  )
}
