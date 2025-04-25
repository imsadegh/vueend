// utils/dateFa.ts
import * as jalaali from 'jalaali-js'
import { DateTime } from 'luxon'

// Persian-digit formatter
const faNum = (n: number) => new Intl.NumberFormat('fa-IR', { useGrouping: false }).format(n)

/**
 * Convert ISO/Gregorian date-time → Jalali string "۱۴۰۴/۰۲/۰۶ ۱۸:۳۰"
 * @param iso  ISO 8601 string or null
 */
export function formatDateFa(iso: string | null) {
  if (!iso) return '–'

  const dt = DateTime.fromISO(iso, { zone: 'Asia/Tehran' }) // Luxon handles TZ/parse
  const { jy, jm, jd } = jalaali.toJalaali(dt.year, dt.month, dt.day)

  const hh = faNum(dt.hour).padStart(2, '۰')
  const mm = faNum(dt.minute).padStart(2, '۰')

  return `${hh}:${mm} - ${faNum(jy)}/${faNum(jm).padStart(2, '۰')}/${faNum(jd).padStart(2, '۰')}`
}
