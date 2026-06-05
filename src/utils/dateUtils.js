export const getCurrentWeekMonday = () => {
  const today = new Date()
  const day = today.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  return monday.toISOString().split('T')[0]
}

export const getISOWeekNumber = (date = new Date()) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

// Retourne le dayDiff (0=lundi … 6=dimanche) d'une date ISO par rapport au lundi de la semaine en cours, ou -1 si hors semaine
export const getDayIndexInCurrentWeek = (dateStr, mondayStr) => {
  const [y, m, d] = mondayStr.split('-').map(Number)
  const mondayDate = new Date(y, m - 1, d)
  const execDate = new Date(dateStr + 'T00:00:00')
  const diff = Math.round((execDate - mondayDate) / (24 * 60 * 60 * 1000))
  return diff >= 0 && diff <= 6 ? diff : -1
}
