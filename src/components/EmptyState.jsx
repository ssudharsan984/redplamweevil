export default function EmptyState({ title, message, icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-3 animate-fade-in">
      <div className="text-5xl mb-1 animate-pop">{icon || '🌿'}</div>
      <p className="text-base font-semibold text-gray-700">{title}</p>
      {message && <p className="text-sm text-stone-400 max-w-xs leading-relaxed">{message}</p>}
    </div>
  )
}
