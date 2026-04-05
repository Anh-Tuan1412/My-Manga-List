import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { PIE_COLORS } from '../constants/manga'
import { formatCurrency } from '../utils/formatters'

function StatsPanel({ stats, displayCount }) {
  return (
    <article className="panel stats-panel">
      <div>
        <h2>Thống kê bộ sưu tập</h2>
        <p className="mini-note">Tổng manga hiển thị: {displayCount}</p>
        <p className="cost">Wishlist dự kiến: {formatCurrency(stats.wishlistTotalCost)}</p>
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={stats.genreDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={86}
              label
            >
              {stats.genreDistribution.map((entry, index) => (
                <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

export default StatsPanel
