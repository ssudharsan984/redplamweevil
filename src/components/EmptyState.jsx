export default function EmptyState({ title, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
      <div className="w-12 h-12 text-gray-300 mx-auto mb-2">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <p className="text-lg font-semibold text-gray-700">{title}</p>
      {message && <p className="text-sm text-gray-500 max-w-xs">{message}</p>}
    </div>
  )
}
