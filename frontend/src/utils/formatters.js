export const formatCurrency = (value) => {
  const amount = Number(value || 0)
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const getProgressPercent = (item) => {
  if (!item.totalChapters) {
    return 0
  }

  return Math.max(0, Math.min(100, Math.round((item.ownedChapters / item.totalChapters) * 100)))
}
