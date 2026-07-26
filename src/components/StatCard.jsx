export default function StatCard({ label, value, icon, colorClass = 'text-primary-600' }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`text-3xl ${colorClass}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}
