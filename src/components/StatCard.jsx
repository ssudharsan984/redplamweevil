export default function StatCard({ label, value, icon, colorClass = 'text-primary-600', bgClass = 'bg-primary-50', trend }) {
  return (
    <div className="card group cursor-default">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 ${bgClass} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
        {trend != null && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className={`text-3xl font-extrabold ${colorClass} leading-none mb-1`}>{value}</p>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
    </div>
  )
}
