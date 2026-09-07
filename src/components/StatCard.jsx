export default function StatCard({ label, value, icon, colorClass = 'text-primary-600', bgClass = 'bg-primary-50' }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className={`w-11 h-11 ${bgClass} rounded-xl flex items-center justify-center mb-4`}>
        <div className={`w-5 h-5 ${colorClass}`}>{icon}</div>
      </div>
      <p className={`text-3xl font-extrabold ${colorClass} leading-none mb-1.5`}>{value}</p>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
    </div>
  )
}
